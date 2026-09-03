# Security Hardening — Auth & Proxy

This document explains every security issue found in the authentication code,
why it matters, and how it was fixed. Each issue is mapped to the **OWASP Top 10**
(2021) and written in plain language so the concepts are easy to understand.

---

## Current architecture (backend-owned cookie auth, static SPA)

Auth is **fully owned by the Spring backend**; the frontend is a static SPA on
`xxx.com` that calls the API directly at `api.xxx.com` (same-site,
cross-origin — no proxy, no server-side session state).

```
Browser (static SPA on xxx.com)  ←fetch with httpOnly cookies→  Spring Boot (api.xxx.com)
```

- Spring sets `__Host-access_token` (15 min) and `__Host-refresh_token`
  (7 days) httpOnly cookies: `Secure`, `SameSite=Strict`, host-only (no
  `Domain`), `Path=/` (RFC 10017 §6.1.3.2 — the `__Host-` prefix is enforced
  by the browser against exactly these attributes).
- Tokens never enter browser JavaScript — XSS cannot read them.
- On 401 the client calls `POST /api/auth/refresh` once (single-flight) and
  retries; the backend rotates the refresh token (with a ~60s reuse grace window
  for multi-tab safety) and sets new cookies.
- CSRF: `SameSite=Strict` blocks cross-site requests; the backend's
  `OriginCheckFilter` rejects state-changing requests whose `Origin` does not
  exactly match the configured frontend origin (needed because the frontend
  and API share a registrable domain, so SameSite alone is insufficient).
- CORS: the API allows exactly the frontend origin with credentials
  (`CorsConfig`, `app.frontend-url`).
- Revocation: logout/password change revoke refresh tokens and blacklist the
  access token's `jti` (Redis).

The issues below are the **historical record** of the original BFF
(Backend-for-Frontend) implementation — a Nuxt-server session layer that stored
tokens in Nitro storage and issued an opaque HMAC-signed cookie. That layer was
removed in favor of the backend-owned model above; the sections are kept for
reference because each vulnerability class and its fix still applies.

---

## Table of Contents

- [Issue #1 — Session Fixation on Login (CRITICAL)](#issue-1--session-fixation-on-login-critical)
- [Issue #2 — No CSRF Protection Beyond SameSite (CRITICAL)](#issue-2--no-csrf-protection-beyond-samesite-critical)
- [Issue #3 — Default Session Secret in Production (CRITICAL)](#issue-3--default-session-secret-in-production-critical)
- [Issue #4 — No Absolute Session Timeout (CRITICAL)](#issue-4--no-absolute-session-timeout-critical)
- [Issue #5 — Session TTL Doesn't Slide (HIGH)](#issue-5--session-ttl-doesnt-slide-high)
- [Issue #6 — No Rate Limiting on Auth Endpoints (HIGH)](#issue-6--no-rate-limiting-on-auth-endpoints-high)
- [Issue #7 — Self-Referential Refresh Path (HIGH)](#issue-7--self-referential-refresh-path-high)
- [Issue #8 — No Session Revocation Mechanism (HIGH)](#issue-8--no-session-revocation-mechanism-high)
- [Issue #9 — `__Host-` Cookie Prefix (MEDIUM)](#issue-9--__host--cookie-prefix-medium)
- [Issue #10 — No Security Logging (LOW)](#issue-10--no-security-logging-low)
- [Issue #11 — No BFF-Side Input Validation (LOW)](#issue-11--no-bff-side-input-validation-low)
- [Issue #12 — Logout Doesn't Revoke Refresh Token (MEDIUM)](#issue-12--logout-doesnt-revoke-refresh-token-medium)
- [Issue #13 — Password Change Doesn't Kill Other Sessions (MEDIUM)](#issue-13--password-change-doesnt-kill-other-sessions-medium)
- [Summary of Changes](#summary-of-changes)

---

## Issue #1 — Session Fixation on Login (CRITICAL)

**OWASP:** A07: Identification and Authentication Failures

### What is session fixation?

Imagine you're at a hotel. The hotel gives you a key card with room number 101.
You walk to room 101, but someone secretly swapped your key card for a copy of
theirs BEFORE you checked in. Now when you open "your" room, you're actually
entering their room — and they can enter yours too.

In web terms: an attacker forces a **known session ID** onto your browser before
you log in. After you log in, the server associates your authenticated identity
with that known session ID. The attacker can now use the same session ID to
impersonate you.

### How it worked in our code

```ts
// OLD login.post.ts
await createBffSession(event, { ... })
```

`createBffSession` generates a new random session ID, but it **never destroyed
any pre-existing session first**. If the browser already had a `bff_session`
cookie (planted by an attacker via XSS, a subdomain, or a network injection),
the old session wasn't invalidated before the new one was created.

### The fix

Always destroy any existing session **before** creating a new one on any
privilege change (login, MFA verification):

```ts
// NEW login.post.ts
await destroyBffSession(event)    // ← invalidate any pre-existing session
await createBffSession(event, { ... })
```

This ensures the old session ID is dead before the new one is born. Even if an
attacker planted a cookie, it's now useless.

### Where it was fixed

- `server/api/auth/login.post.ts`
- `server/api/auth/mfa/verify.post.ts`

---

## Issue #2 — No CSRF Protection Beyond SameSite (CRITICAL)

**OWASP:** A01: Broken Access Control

### What is CSRF?

**CSRF** (Cross-Site Request Forgery) is when an attacker tricks your browser
into making a request to a site you're logged into — **without you knowing**.

Example: You're logged into your bank. You visit `evil.com`. `evil.com` has a
hidden form that POSTs to `bank.com/transfer?to=attacker&amount=10000`. Your
browser sends the request **with your session cookie** because that's how
cookies work — they're sent to the origin automatically.

### What we had

The session cookie uses `SameSite=Strict`, which tells the browser: "only send
this cookie if the request originated from the same site." This blocks most CSRF
attacks.

**But it's not enough:**
- **Older browsers** (Safari < 16, some mobile browsers) ignore `SameSite`.
- **Same-site attacks**: if an attacker compromises a subdomain
  (`blog.yoursite.com`), `SameSite` considers it the "same site" and allows the
  cookie through.
- **Edge cases** with top-level navigation forms.

### The fix

Added **Origin header validation** as a second layer of defense:

```ts
// server/middleware/origin-check.ts
export default defineEventHandler((event) => {
  if (SAFE_METHODS.has(event.method)) return  // GET, HEAD, OPTIONS are safe

  const origin = getRequestHeader(event, 'origin')
  const host = getRequestHeader(event, 'host')
  if (origin && new URL(origin).host !== host) {
    throw createError({ statusCode: 403, statusMessage: 'Cross-origin request blocked' })
  }
})
```

**How it works:** Browsers always send an `Origin` header on cross-origin
state-changing requests (POST, PUT, PATCH, DELETE). If the `Origin` doesn't
match our `Host`, we reject it. This is independent of `SameSite` — even if
`SameSite` fails, the Origin check catches it.

**Why not use CSRF tokens?** CSRF tokens (double-submit cookies) are the
traditional defense, but they add complexity. Origin header validation is
simpler, recommended by [OWASP's CSRF Prevention Cheat
Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html),
and sufficient when combined with `SameSite=Strict`.

### Where it was fixed

- `server/middleware/origin-check.ts` (new file)

---

## Issue #3 — Default Session Secret in Production (CRITICAL)

**OWASP:** A02: Cryptographic Failures

### What is the session secret?

The BFF signs each session cookie with an HMAC using a secret key. This
signature prevents tampering — if someone changes the session ID in the cookie,
the signature won't match, and the BFF rejects it.

```
cookie = "session_id.hmac_signature"
```

### The problem

```ts
sessionSecret: process.env.NUXT_SESSION_SECRET || 'dev-only-secret-change-in-production'
```

If `NUXT_SESSION_SECRET` is not set in production, the app silently uses the
**hardcoded default** `'dev-only-secret-change-in-production'`. This string is:
1. **Public** — it's in the source code, on GitHub.
2. **Known to everyone** — anyone reading the code knows the secret.

With this secret, an attacker can **forge valid session cookies for any user**.
They don't need to steal a cookie — they can create one from scratch:

```ts
// Attacker's code (using the known secret):
const sid = 'fake-session-id'
const signature = createHmac('sha256', 'dev-only-secret-change-in-production')
  .update(sid).digest('hex')
const forgedCookie = `${sid}.${signature}`
// Now set this cookie in their browser → they have a "valid" session
```

### The fix

The app now **refuses to start** in production if the secret is missing, too
short, or still the default:

```ts
// server/plugins/validate-config.ts
if (process.env.NODE_ENV === 'production') {
  if (!secret) { console.error('FATAL: ...'); process.exit(1) }
  if (secret.length < 32) { console.error('FATAL: ...'); process.exit(1) }
  if (secret === 'dev-only-secret-change-in-production') { console.error('FATAL: ...'); process.exit(1) }
}
```

**Why 32 characters?** HMAC-SHA256 with a 32-byte (64 hex char) key is
considered secure. 32 characters is a conservative minimum. Generate one with:
```bash
openssl rand -hex 32
```

**Why a server plugin instead of nuxt.config.ts?** Nuxt sets
`NODE_ENV=production` during `typecheck` and `build`, which would trigger false
failures during development. The plugin runs only when the actual server starts.

### Where it was fixed

- `server/plugins/validate-config.ts` (new file)
- `nuxt.config.ts` (removed the inline validation)
- `.env.example` (documented the requirement)

---

## Issue #4 — No Absolute Session Timeout (CRITICAL)

**OWASP:** A07: Identification and Authentication Failures

### What are session timeouts?

There are two types:

1. **Idle timeout** (sliding): "If you don't do anything for 30 minutes, log
   you out." Resets every time you make a request.
2. **Absolute timeout** (fixed): "No matter what you do, after 8 hours, log you
   out." Does NOT reset.

### The problem

The code had an idle timeout (30 min) but **no absolute timeout**. With refresh
token rotation, a user could stay logged in **forever** as long as they made a
request every 30 minutes. For an enterprise expense system, this is too
permissive:

- If a device is stolen, the attacker has unlimited access as long as they're
  active.
- If a session is hijacked, it never expires on its own.
- Compliance requirements (SOX, HIPAA, etc.) often mandate absolute timeouts.

### The fix

The session now stores `createdAt` and enforces an absolute cap:

```ts
// server/utils/session.ts
export interface SessionData {
  // ... existing fields ...
  createdAt: number       // epoch ms when session was created
}

const ABSOLUTE_TIMEOUT_MS = 8 * 60 * 60 * 1000 // 8 hours

export async function getBffSession(event) {
  // ... read session ...
  if (Date.now() - data.createdAt > ABSOLUTE_TIMEOUT_MS) {
    await storage.removeItem(`session:${sid}`)
    deleteCookie(event, COOKIE_NAME, ...)
    return null  // session expired — user must log in again
  }
  return data
}
```

Configurable via `NUXT_SESSION_ABSOLUTE_TIMEOUT_MS` (default: 8 hours).

### Where it was fixed

- `server/utils/session.ts` — `SessionData` type, `getBffSession` enforcement
- `.env.example` — documented the env var

---

## Issue #5 — Session TTL Doesn't Slide (HIGH)

**OWASP:** A07: Identification and Authentication Failures

### The problem

The server-side session had a fixed TTL of 30 minutes, set once at creation.
`getBffSession` read the session but **never refreshed the TTL**. So an active
user making requests every 5 minutes would still be logged out at the 30-minute
mark from creation — not from their last activity.

This is **not** a true idle timeout. A true idle timeout should reset every
time the user is active.

### The fix

`getBffSession` now refreshes the storage TTL on every read:

```ts
// server/utils/session.ts
export async function getBffSession(event) {
  // ... read and validate session ...

  // Sliding idle timeout — refresh the TTL so active users stay alive.
  await storage.setItem(`session:${sid}`, data, { ttl: IDLE_TIMEOUT_SECONDS })

  return data
}
```

**Trade-off:** Sliding TTL means a stolen cookie can be kept alive indefinitely
by an attacker making periodic requests. This is mitigated by the absolute
timeout (issue #4) — even a stolen cookie dies after 8 hours max.

### Where it was fixed

- `server/utils/session.ts` — `getBffSession` now refreshes TTL on read

---

## Issue #6 — No Rate Limiting on Auth Endpoints (HIGH)

**OWASP:** A07: Identification and Authentication Failures

### The problem

The global `nuxt-security` rate limiter was disabled (correctly — it would
throttle legitimate BFF API traffic). But this also disabled it on auth
endpoints:

| Endpoint | Attack |
|----------|--------|
| `POST /api/auth/login` | Brute-force passwords |
| `POST /api/auth/mfa/verify` | Brute-force 6-digit MFA codes (only 1M possibilities!) |
| `POST /api/auth/forgot-password` | Email bombing / enumeration |
| `POST /api/auth/reset-password` | Token brute-force |

The comment said "the Spring backend already rate-limits" — but the BFF is the
**first hop**. An attacker hitting the BFF directly can saturate the BFF→backend
connection before the backend's rate limiter kicks in.

### The fix

Re-enabled rate limiting **per route** via `nuxt.config.ts` `routeRules`:

```ts
routeRules: {
  '/api/auth/login': {
    security: {
      rateLimiter: {
        tokensPerInterval: 10,      // 10 attempts per minute per IP
        interval: 60 * 1000,
        headers: true,              // sends X-RateLimit-* headers
      },
    },
  },
  '/api/auth/mfa/verify': {
    security: {
      rateLimiter: {
        tokensPerInterval: 5,       // 5 MFA attempts per minute per IP
        interval: 60 * 1000,
      },
    },
  },
  // ... same for forgot-password and reset-password ...
}
```

**Why these numbers?**
- **Login: 10/min** — a legitimate user won't fail 10 times in a minute. An
  attacker trying 10 passwords/min would take ~100 years to try 1M common passwords.
- **MFA: 5/min** — a 6-digit code has 1M possibilities. At 5/min, brute-forcing
  takes ~139 days (and the code changes every 30 seconds with TOTP).
- **Forgot/reset: 5/min** — prevents email bombing and token brute-force.

### Where it was fixed

- `nuxt.config.ts` — `nitro.routeRules` for 4 auth endpoints

---

## Issue #7 — Self-Referential Refresh Path (HIGH)

**OWASP:** A05: Security Misconfiguration

### The problem

```ts
// server/utils/session.ts
const response = await $fetch('/api/auth/refresh', {
  baseURL: config.backendUrl,  // ← this saves it
  method: 'POST',
  body: { refreshToken: session.refreshToken },
})
```

This calls `/api/auth/refresh` with `baseURL` set to the backend URL, so it hits
the **Spring backend's** refresh endpoint. But the path `/api/auth/refresh` is
**identical** to the BFF's own route (`server/api/auth/refresh.post.ts`).

If a future maintainer removes `baseURL` (thinking it's redundant), the BFF
would call **itself** → which calls `refreshBffSession` → which calls itself →
**infinite recursion** → server crash.

### The fix

Added an explicit comment at the call site:

```ts
// NOTE: This calls the Spring backend's /api/auth/refresh directly (via
// baseURL). It does NOT call the BFF's own /api/auth/refresh route —
// that would cause infinite recursion. Do not remove `baseURL`.
```

The comment was already partially in the function doc, but now it's at the exact
line where the mistake would be made.

### Where it was fixed

- `server/utils/session.ts` — explicit comment at the `$fetch` call site

---

## Issue #8 — No Session Revocation Mechanism (HIGH)

**OWASP:** A01: Broken Access Control

### The problem

If a user's cookie is stolen, there was **no way to invalidate that session**
without:
- The user logging out (which requires the cookie — the attacker has it).
- The session TTL expiring (30 min idle, but the attacker can keep it alive).
- Restarting the server (wipes in-memory storage, but also logs out everyone).

There was no admin "kill switch", no way to revoke sessions for a specific user.

### The fix

Sessions are now tracked per user in a `user-sessions:${username}` index. A new
function `revokeAllSessionsForUser(username)` deletes all sessions for a user:

```ts
// server/utils/session.ts
export async function revokeAllSessionsForUser(username: string): Promise<number> {
  const storage = useStorage('session')
  const sids = await storage.getItem<string[]>(`user-sessions:${username}`) || []

  for (const sid of sids) {
    await storage.removeItem(`session:${sid}`)
  }
  await storage.removeItem(`user-sessions:${username}`)

  return sids.length
}
```

This is called on:
- **Password change** — revokes all sessions so the user must re-authenticate on
  every device (see issue #13).
- Can be called from an admin endpoint to force-logout a user.

### Where it was fixed

- `server/utils/session.ts` — `createBffSession` tracks sessions per user,
  `destroyBffSession` cleans up the index, new `revokeAllSessionsForUser` function
- `server/api/auth/change-password.post.ts` — calls `revokeAllSessionsForUser`

---

## Issue #9 — `__Host-` Cookie Prefix (MEDIUM)

**OWASP:** A05: Security Misconfiguration

### What is the `__Host-` prefix?

The `__Host-` prefix is a browser-enforced security feature for cookies. If a
cookie name starts with `__Host-`, the browser **rejects** it unless ALL of
these are true:
- `Secure` is set (only sent over HTTPS).
- `Path=/` (scoped to the entire domain).
- No `Domain` attribute (not shared with subdomains).

This is **defense in depth** against subdomain cookie injection: an attacker who
controls `blog.yoursite.com` cannot set a `__Host-bff_session` cookie because
the prefix requires no `Domain` attribute.

### The fix

```ts
// server/utils/session.ts
const isProd = process.env.NODE_ENV === 'production'
const COOKIE_NAME = isProd ? '__Host-bff_session' : 'bff_session'
```

In production, the cookie is named `__Host-bff_session`. In development, we use
the plain name because `__Host-` requires HTTPS (dev runs on HTTP).

### Where it was fixed

- `server/utils/session.ts` — cookie name is conditional on environment

---

## Issue #10 — No Security Logging (LOW)

**OWASP:** A09: Security Logging and Monitoring Failures

### The problem

No structured logging of security events:
- Failed login attempts (who, when, IP)
- Session creation/destruction
- Refresh failures
- MFA failures
- Session revocation

For an enterprise app, this is needed for **audit** (who did what, when) and
**incident response** (detecting and investigating attacks).

### The fix

Added a `securityLog` helper that outputs structured JSON:

```ts
// server/utils/session.ts
function securityLog(event: string, details: Record<string, unknown>): void {
  const entry = JSON.stringify({
    type: 'security',
    event,
    timestamp: new Date().toISOString(),
    ...details,
  })
  if (isProd) {
    console.warn(entry)  // → ship to Sentry, Datadog, CloudWatch, etc.
  } else {
    console.warn(`[SECURITY:${event}]`, details)  // readable in dev terminal
  }
}
```

Called on: `session.created`, `session.destroyed`, `session.invalid_signature`,
`session.absolute_timeout`, `session.revoked_all`, `session.refresh_failed`.

### Where it was fixed

- `server/utils/session.ts` — `securityLog` function + calls throughout

---

## Issue #11 — No BFF-Side Input Validation (LOW)

**OWASP:** A03: Injection

### The problem

Auth routes passed request bodies straight to the backend without validation:

```ts
// OLD login.post.ts
const body = await readBody<LoginRequest>(event)
return await $fetch('/api/auth/login', { body })  // no validation!
```

If the backend trusts the BFF, a malformed body could cause issues. Validation
at the BFF is **defense in depth** — even if the backend has a bug, the BFF
catches bad input first.

### The fix

All auth routes now validate input with **yup** (reusing the same schemas as the
client-side forms):

```ts
// NEW login.post.ts
const loginSchema = object({
  usernameOrEmail: string().trim().required().max(100),
  password: string().required(),
})

const body = await readValidatedBody(event, loginSchema.validate)
```

`readValidatedBody` is a h3 helper that throws a 400 error if validation fails.

### Where it was fixed

- `server/api/auth/login.post.ts`
- `server/api/auth/mfa/verify.post.ts`
- `server/api/auth/change-password.post.ts`
- `server/api/auth/forgot-password.post.ts`
- `server/api/auth/reset-password.post.ts`

---

## Issue #12 — Logout Doesn't Revoke Refresh Token (MEDIUM)

**OWASP:** A07: Identification and Authentication Failures

### The problem

```ts
// OLD logout.post.ts
await $fetch('/api/auth/logout', {
  headers: { Authorization: `Bearer ${session.accessToken}` },
  // no body — refresh token not sent!
})
```

The backend logout was called with only the access token (as a Bearer header).
If the backend's logout endpoint only revokes the **access token**, the
**refresh token** remains valid. An attacker who stole the refresh token can
still mint new access tokens even after the user "logged out."

### The fix

Now sends the refresh token in the body so the backend can revoke both:

```ts
// NEW logout.post.ts
await $fetch('/api/auth/logout', {
  headers: { Authorization: `Bearer ${session.accessToken}` },
  body: { refreshToken: session.refreshToken },  // ← revoke both tokens
})
```

**Note:** This assumes the backend's `/api/auth/logout` endpoint accepts and
revokes the refresh token from the body. Verify this in the Spring Boot code.

### Where it was fixed

- `server/api/auth/logout.post.ts`

---

## Issue #13 — Password Change Doesn't Kill Other Sessions (MEDIUM)

**OWASP:** A07: Identification and Authentication Failures

### The problem

```ts
// OLD change-password.post.ts
if (response.success) {
  await destroyBffSession(event)  // only destroys the CURRENT session
}
```

This destroyed only the **current** BFF session. If the user had sessions on
other devices (other browsers, other computers), those sessions stayed alive.
An attacker who stole a session on another device would still have access after
the user changed their password.

### The fix

Now revokes **ALL** sessions for the user:

```ts
// NEW change-password.post.ts
if (response.success) {
  await revokeAllSessionsForUser(session.username)  // ← all devices
}
```

This uses the per-user session index (see issue #8) to find and destroy every
active session for the user, across all devices and browsers.

### Where it was fixed

- `server/api/auth/change-password.post.ts`

---

## Summary of Changes

### New files

| File | Purpose |
|------|---------|
| `server/middleware/origin-check.ts` | CSRF defense — Origin header validation |
| `server/plugins/validate-config.ts` | Fails fast if session secret is weak in prod |
| `docs/SECURITY-HARDENING.md` | This document |

### Modified files

| File | Changes |
|------|---------|
| `server/utils/session.ts` | `__Host-` prefix, sliding TTL, absolute timeout, per-user session index, `revokeAllSessionsForUser`, security logging, stale cookie cleanup |
| `server/api/auth/login.post.ts` | Session fixation fix + yup validation |
| `server/api/auth/mfa/verify.post.ts` | Session fixation fix + yup validation |
| `server/api/auth/logout.post.ts` | Sends refresh token in body for revocation |
| `server/api/auth/change-password.post.ts` | Revokes all user sessions + yup validation |
| `server/api/auth/forgot-password.post.ts` | yup validation |
| `server/api/auth/reset-password.post.ts` | yup validation |
| `nuxt.config.ts` | Per-route rate limiting on auth endpoints, session TTL config |
| `.env.example` | Documented new env vars |

### New environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `NUXT_SESSION_IDLE_TIMEOUT_SECONDS` | `1800` (30 min) | Sliding idle timeout |
| `NUXT_SESSION_ABSOLUTE_TIMEOUT_MS` | `28800000` (8h) | Absolute session lifetime cap |

### OWASP Top 10 coverage

| OWASP Category | Issues Addressed |
|----------------|------------------|
| A01: Broken Access Control | #2 (CSRF), #8 (revocation) |
| A02: Cryptographic Failures | #3 (secret validation) |
| A03: Injection | #11 (input validation) |
| A05: Security Misconfiguration | #7 (refresh path), #9 (`__Host-` prefix) |
| A07: Identification & Auth Failures | #1 (fixation), #4 (absolute timeout), #5 (sliding TTL), #6 (rate limiting), #12 (logout), #13 (password change) |
| A09: Security Logging Failures | #10 (security logging) |
