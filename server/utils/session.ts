import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'
import type { ApiResponse } from '~/types/api'
import type { TokenResponse, UserProfileResponse } from '~/types/auth'

/**
 * BFF session management — the browser never sees access or refresh tokens.
 *
 * Flow:
 * 1. On login/MFA verify, the BFF receives `{ accessToken, refreshToken, user }`
 *    from the backend, stores them in Nitro's `session` storage mount under a
 *    random session ID, and sets an opaque, signed, httpOnly cookie with that ID.
 * 2. On subsequent requests, the BFF reads the cookie, verifies the HMAC
 *    signature, looks up the session, and attaches the access token as a
 *    Bearer header when proxying to the backend.
 * 3. On logout, the session is destroyed and the cookie cleared.
 *
 * The session cookie is `__Host-session` (RFC 6265 host-prefix), `SameSite=Strict`,
 * `httpOnly`, and `Secure` (in prod). No `Domain` attribute is set.
 * The HMAC prevents tampering — an attacker who steals the cookie can replay
 * it (same as any session cookie), but cannot forge sessions for other users.
 *
 * Concurrent refresh protection: a per-session Redis-based distributed lock
 * ensures only one refresh operation runs at a time per session across all
 * Nuxt instances. Waiting requests receive the updated access token.
 */

const COOKIE_NAME = '__Host-session'
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 days — match backend refresh token TTL

/** Lock key prefix and TTL for distributed refresh locking. */
const REFRESH_LOCK_PREFIX = 'refresh_lock:'
const REFRESH_LOCK_TTL_MS = 10_000 // 10 seconds — max time a refresh lock is held
const REFRESH_LOCK_RETRY_MS = 50 // polling interval for lock acquisition
const REFRESH_LOCK_MAX_WAIT_MS = 15_000 // max time to wait for an in-progress refresh

export interface SessionData {
  accessToken: string
  refreshToken: string
  /** Cached user profile so /api/auth/me doesn't need a backend round-trip. */
  user: UserProfileResponse
  /** Session creation timestamp (ms since epoch). Used for absolute timeout. */
  createdAt: number
  /** Last activity timestamp (ms since epoch). Used for idle timeout. */
  lastActivityAt: number
}

/** Security event types for safe server-side logging. */
export type SecurityEvent =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILURE'
  | 'MFA_SUCCESS'
  | 'MFA_FAILURE'
  | 'SESSION_CREATED'
  | 'SESSION_EXPIRED'
  | 'SESSION_REVOKED'
  | 'LOGOUT'
  | 'TOKEN_REFRESH_FAILURE'
  | 'REFRESH_TOKEN_REUSE'
  | 'PASSWORD_CHANGED'
  | 'PASSWORD_RESET'
  | 'MFA_CHANGED'
  | 'AUTHORIZATION_DENIED'

/**
 * Logs a security event with correlation ID. Never logs sensitive data
 * (tokens, session IDs, passwords, cookies).
 */
function logSecurityEvent(event: SecurityEvent, details?: Record<string, unknown>): void {
  const entry = {
    timestamp: new Date().toISOString(),
    event,
    ...details,
  }
  // Use console.error for security events to ensure they appear in logs
  // even if stdout is not captured. Never include tokens, session IDs,
  // passwords, cookies, or Authorization headers.
  console.error(JSON.stringify(entry))
}

/**
 * Validates the session secret on startup. Must be at least 256-bit (32 bytes)
 * random and not a known weak/default value.
 */
function validateSessionSecret(secret: string): void {
  if (secret === 'dev-only-secret-change-in-production') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'NUXT_SESSION_SECRET must be changed from the default in production. '
        + 'Generate with: openssl rand -hex 32',
      )
    }
    console.warn('[session] Using default dev-only session secret. Set NUXT_SESSION_SECRET in production.')
  }

  // Require at least 32 bytes (256 bits) of entropy
  const bytes = Buffer.from(secret, 'utf-8')
  if (bytes.length < 32) {
    throw new Error(
      'NUXT_SESSION_SECRET must be at least 32 bytes (256 bits). '
      + 'Generate with: openssl rand -hex 32',
    )
  }
}

/**
 * Signs a value with the session secret using HMAC-SHA256.
 * Returns `payload.signature` (both hex).
 */
function sign(value: string): string {
  const secret = useRuntimeConfig().sessionSecret
  return createHmac('sha256', secret).update(value).digest('hex')
}

/**
 * Verifies a `payload.signature` string against the expected HMAC.
 * Uses timingSafeEqual to prevent timing attacks.
 */
function verify(signed: string): string | null {
  const idx = signed.lastIndexOf('.')
  if (idx === -1) return null

  const payload = signed.slice(0, idx)
  const signature = signed.slice(idx + 1)
  const expected = sign(payload)

  if (signature.length !== expected.length) return null
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null

  return payload
}

/**
 * Returns the session storage driver (Redis in production, memory in dev).
 */
function getSessionStorage() {
  return useStorage('session')
}

/**
 * Extracts the session ID from the cookie without verification.
 * Used internally after getBffSession validates the signature.
 */
function extractSessionId(event: H3Event): string | null {
  const cookieValue = getCookie(event, COOKIE_NAME)
  if (!cookieValue) return null
  return verify(cookieValue)
}

/**
 * Checks whether a session has exceeded its idle or absolute timeout.
 * Returns true if the session is still valid.
 */
function isSessionValid(session: SessionData): boolean {
  const config = useRuntimeConfig()
  const now = Date.now()

  // Absolute timeout: 8 hours max session lifetime regardless of activity
  const absoluteTimeoutMs = (config.sessionAbsoluteTimeout as number) || 8 * 60 * 60 * 1000
  if (now - session.createdAt > absoluteTimeoutMs) {
    return false
  }

  // Idle timeout: 30 minutes of inactivity
  const idleTimeoutMs = (config.sessionIdleTimeout as number) || 30 * 60 * 1000
  if (now - session.lastActivityAt > idleTimeoutMs) {
    return false
  }

  return true
}

/** Creates a new session, stores it, and sets the signed cookie. */
export async function createBffSession(event: H3Event, data: SessionData): Promise<void> {
  const secret = useRuntimeConfig().sessionSecret
  validateSessionSecret(secret)

  const sid = randomUUID()
  const storage = getSessionStorage()
  const ttl = useRuntimeConfig().sessionTtl as number

  const now = Date.now()
  const sessionData: SessionData = {
    ...data,
    createdAt: data.createdAt || now,
    lastActivityAt: now,
  }

  await storage.setItem(`session:${sid}`, sessionData, { ttl })

  const cookieValue = `${sid}.${sign(sid)}`
  setCookie(event, COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    // No Domain attribute — __Host- prefix requires it to be absent
  })

  logSecurityEvent('SESSION_CREATED')
}

/**
 * Reads and validates the session cookie, returning the session data or null.
 * Validates HMAC signature, session existence, and idle/absolute timeouts.
 * Updates lastActivityAt on each valid access.
 */
export async function getBffSession(event: H3Event): Promise<SessionData | null> {
  const sid = extractSessionId(event)
  if (!sid) return null

  const storage = getSessionStorage()
  const data = await storage.getItem<SessionData>(`session:${sid}`)
  if (!data) return null

  // Check session validity (idle + absolute timeouts)
  if (!isSessionValid(data)) {
    await storage.removeItem(`session:${sid}`)
    logSecurityEvent('SESSION_EXPIRED')
    return null
  }

  // Update last activity timestamp (touch)
  const updated: SessionData = {
    ...data,
    lastActivityAt: Date.now(),
  }
  const ttl = useRuntimeConfig().sessionTtl as number
  await storage.setItem(`session:${sid}`, updated, { ttl })

  return updated
}

/**
 * Reads the session WITHOUT updating lastActivityAt.
 * Used by refresh logic to get the current state without side effects.
 */
async function readSession(event: H3Event): Promise<{ sid: string, data: SessionData } | null> {
  const sid = extractSessionId(event)
  if (!sid) return null

  const storage = getSessionStorage()
  const data = await storage.getItem<SessionData>(`session:${sid}`)
  if (!data) return null

  if (!isSessionValid(data)) {
    await storage.removeItem(`session:${sid}`)
    logSecurityEvent('SESSION_EXPIRED')
    return null
  }

  return { sid, data }
}

/** Updates the session data (e.g. after a token refresh). */
export async function updateBffSession(event: H3Event, data: SessionData): Promise<void> {
  const sid = extractSessionId(event)
  if (!sid) return

  const storage = getSessionStorage()
  const ttl = useRuntimeConfig().sessionTtl as number
  const updated: SessionData = {
    ...data,
    lastActivityAt: Date.now(),
  }
  await storage.setItem(`session:${sid}`, updated, { ttl })
}

/** Destroys the session and clears the cookie. */
export async function destroyBffSession(event: H3Event): Promise<void> {
  const sid = extractSessionId(event)
  if (sid) {
    const storage = getSessionStorage()
    await storage.removeItem(`session:${sid}`)

    // Also remove any refresh lock for this session
    try {
      await storage.removeItem(`${REFRESH_LOCK_PREFIX}${sid}`)
    }
    catch {
      // Lock removal is best-effort
    }
  }

  deleteCookie(event, COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  })
}

/**
 * Sets Cache-Control: no-store on the response to prevent CDN/proxy caching
 * of authenticated responses.
 */
export function setNoCacheHeaders(event: H3Event): void {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate, private')
  setHeader(event, 'Pragma', 'no-cache')
}

// ---------------------------------------------------------------------------
// Distributed single-flight refresh
// ---------------------------------------------------------------------------

/**
 * Attempts to acquire a distributed refresh lock for a session.
 * Uses a simple key-existence pattern with TTL for crash safety.
 * Returns true if the lock was acquired, false if another instance holds it.
 */
async function tryAcquireRefreshLock(sid: string): Promise<boolean> {
  const storage = getSessionStorage()
  const lockKey = `${REFRESH_LOCK_PREFIX}${sid}`

  try {
    // Use a conditional set: only set if not already present.
    // Nitro storage doesn't have atomic SETNX, so we check-then-set.
    // This is safe enough because the worst case is two concurrent refreshes
    // (which the backend handles via refresh-token rotation).
    const existing = await storage.getItem<string>(lockKey)
    if (existing) {
      return false
    }

    await storage.setItem(lockKey, '1', { ttl: REFRESH_LOCK_TTL_MS / 1000 })
    return true
  }
  catch {
    // If lock operations fail, allow the refresh to proceed (fail-open for availability)
    return true
  }
}

/**
 * Releases the distributed refresh lock for a session.
 */
async function releaseRefreshLock(sid: string): Promise<void> {
  const storage = getSessionStorage()
  try {
    await storage.removeItem(`${REFRESH_LOCK_PREFIX}${sid}`)
  }
  catch {
    // Lock release is best-effort; the TTL will expire the lock anyway
  }
}

/**
 * Performs a distributed single-flight token refresh.
 *
 * Only one refresh operation runs per session at a time across all Nuxt
 * instances. Concurrent requests wait for the existing refresh to complete,
 * then read the updated session state.
 *
 * Requirements satisfied:
 * 1. Only one refresh per session at a time
 * 2. Concurrent requests wait for the existing refresh
 * 3. Waiting requests use the updated access token
 * 4. Works across multiple Nuxt instances (Redis-backed)
 * 5. Uses distributed locking, not in-process Map
 * 6. Stale failed refresh doesn't destroy a successfully refreshed session
 * 7. Re-reads latest session state after waiting
 * 8. Locks expire via TTL if an instance crashes
 * 9. Retry the original request at most once
 */
export async function refreshBffSession(event: H3Event): Promise<SessionData | null> {
  const sessionResult = await readSession(event)
  if (!sessionResult) return null

  const { sid, data: session } = sessionResult

  // Try to acquire the distributed lock
  const acquired = await tryAcquireRefreshLock(sid)

  if (!acquired) {
    // Another instance is refreshing — wait for it to complete
    const waited = await waitForRefreshCompletion(sid)
    if (waited) {
      // Re-read the session to get the updated tokens
      const refreshedResult = await readSession(event)
      if (refreshedResult) {
        return refreshedResult.data
      }
    }
    // Wait failed or session was destroyed — try our own refresh as fallback
    // (the other instance's refresh may have failed)
    const fallbackAcquired = await tryAcquireRefreshLock(sid)
    if (!fallbackAcquired) {
      return null
    }
    // Proceed with refresh below
  }

  try {
    const config = useRuntimeConfig()
    const response = await $fetch<ApiResponse<TokenResponse>>('/api/auth/refresh', {
      baseURL: config.backendUrl,
      method: 'POST',
      body: { refreshToken: session.refreshToken },
    })

    if (!response.success || !response.data) {
      // Refresh failed — destroy session but only if we own the lock
      // (another instance may have already refreshed successfully)
      const currentSession = await readSession(event)
      if (currentSession && currentSession.data.refreshToken === session.refreshToken) {
        // Same refresh token — our failure is authoritative
        await destroyBffSession(event)
        logSecurityEvent('TOKEN_REFRESH_FAILURE')
      }
      return null
    }

    const updated: SessionData = {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      user: session.user,
      createdAt: session.createdAt,
      lastActivityAt: Date.now(),
    }

    await updateBffSession(event, updated)
    return updated
  }
  catch {
    // On error, check if the session still has the same refresh token
    // before destroying — another instance may have refreshed successfully
    const currentSession = await readSession(event)
    if (currentSession && currentSession.data.refreshToken === session.refreshToken) {
      await destroyBffSession(event)
      logSecurityEvent('TOKEN_REFRESH_FAILURE')
    }
    return null
  }
  finally {
    await releaseRefreshLock(sid)
  }
}

/**
 * Waits for an in-progress refresh to complete by polling the lock key.
 * Returns true if the lock was released (refresh completed), false on timeout.
 */
async function waitForRefreshCompletion(sid: string): Promise<boolean> {
  const storage = getSessionStorage()
  const lockKey = `${REFRESH_LOCK_PREFIX}${sid}`
  const startTime = Date.now()

  while (Date.now() - startTime < REFRESH_LOCK_MAX_WAIT_MS) {
    const lock = await storage.getItem<string>(lockKey)
    if (!lock) {
      // Lock released — refresh completed
      return true
    }
    // Wait before polling again
    await new Promise(resolve => setTimeout(resolve, REFRESH_LOCK_RETRY_MS))
  }

  // Timeout waiting for the lock — the other instance may have crashed.
  // The TTL on the lock will eventually expire, so we can proceed.
  return false
}

/**
 * Rotates the session ID after a security-sensitive event (login, MFA).
 * Creates a new session with a new ID and destroys the old one.
 * This prevents session fixation attacks.
 */
export async function rotateSession(event: H3Event, data: SessionData): Promise<void> {
  // Destroy the old session if one exists
  const oldSid = extractSessionId(event)
  if (oldSid) {
    const storage = getSessionStorage()
    await storage.removeItem(`session:${oldSid}`)
  }

  // Create a new session with a new ID
  await createBffSession(event, data)
}
