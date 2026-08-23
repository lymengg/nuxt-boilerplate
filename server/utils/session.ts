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
 * The session cookie is `SameSite=Strict`, `httpOnly`, and `Secure` (in prod).
 * The HMAC prevents tampering — an attacker who steals the cookie can replay
 * it (same as any session cookie), but cannot forge sessions for other users.
 */

const COOKIE_NAME = 'bff_session'
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 days — match backend refresh token TTL

export interface SessionData {
  accessToken: string
  refreshToken: string
  /** Cached user profile so /api/auth/me doesn't need a backend round-trip. */
  user: UserProfileResponse
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

/** Creates a new session, stores it, and sets the signed cookie. */
export async function createBffSession(event: H3Event, data: SessionData): Promise<void> {
  const sid = randomUUID()
  const storage = useStorage('session')
  const ttl = useRuntimeConfig().sessionTtl as number

  await storage.setItem(`session:${sid}`, data, { ttl })

  const cookieValue = `${sid}.${sign(sid)}`
  setCookie(event, COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  })
}

/** Reads and validates the session cookie, returning the session data or null. */
export async function getBffSession(event: H3Event): Promise<SessionData | null> {
  const cookieValue = getCookie(event, COOKIE_NAME)
  if (!cookieValue) return null

  const sid = verify(cookieValue)
  if (!sid) return null

  const storage = useStorage('session')
  const data = await storage.getItem<SessionData>(`session:${sid}`)
  return data
}

/** Updates the session data (e.g. after a token refresh). */
export async function updateBffSession(event: H3Event, data: SessionData): Promise<void> {
  const cookieValue = getCookie(event, COOKIE_NAME)
  if (!cookieValue) return

  const sid = verify(cookieValue)
  if (!sid) return

  const storage = useStorage('session')
  const ttl = useRuntimeConfig().sessionTtl as number
  await storage.setItem(`session:${sid}`, data, { ttl })
}

/** Destroys the session and clears the cookie. */
export async function destroyBffSession(event: H3Event): Promise<void> {
  const cookieValue = getCookie(event, COOKIE_NAME)
  if (cookieValue) {
    const sid = verify(cookieValue)
    if (sid) {
      const storage = useStorage('session')
      await storage.removeItem(`session:${sid}`)
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
 * Refreshes the access token via the backend. On success, updates the stored
 * session with the new token pair. On failure, destroys the session.
 * Returns the new session data or null.
 */
export async function refreshBffSession(event: H3Event): Promise<SessionData | null> {
  const session = await getBffSession(event)
  if (!session) return null

  const config = useRuntimeConfig()
  try {
    const response = await $fetch<ApiResponse<TokenResponse>>('/api/auth/refresh', {
      baseURL: config.backendUrl,
      method: 'POST',
      body: { refreshToken: session.refreshToken },
    })

    if (!response.success || !response.data) {
      await destroyBffSession(event)
      return null
    }

    const updated: SessionData = {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      user: session.user,
    }

    await updateBffSession(event, updated)
    return updated
  }
  catch {
    await destroyBffSession(event)
    return null
  }
}
