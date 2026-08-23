# Nuxt Expense Management (Frontend)

Nuxt 3 + PrimeVue frontend for the Spring Boot expense management API
(`spring-boilerplate`). Uses a **BFF (Backend-for-Frontend)** architecture
consistent with OAuth 2.0 Security Best Current Practice guidance — keeping
OAuth access and refresh tokens out of the browser.

## Architecture

```
Browser
   │
   │ __Host-session (HttpOnly + Secure + SameSite=Strict)
   ▼
Nuxt Server (BFF / Nitro)
   │
   │ opaque session ID → Redis-backed session storage
   ▼
Spring Boot Backend
   │
   ├── Authentication
   ├── Authorization
   ├── Tenant isolation
   └── Resource-level authorization
```

- **Tokens live server-side only.** The Nuxt server (Nitro) stores the access
  and refresh tokens in its `session` storage mount (in-memory for dev, Redis
  for production). The browser receives only an opaque, HMAC-signed, httpOnly
  session cookie (`__Host-session`).
- **All API calls proxy through the BFF.** The browser calls same-origin
  `/api/*` routes; the BFF attaches the Bearer token and forwards to the
  backend. On 401, the BFF transparently refreshes and retries.
- **Auth routes** (`/api/auth/*`) have dedicated BFF handlers that manage
  session creation/destruction. All other routes hit a catch-all proxy.
- **Security headers** (CSP, X-Frame-Options, HSTS, etc.) are set by the
  BFF on every response (see `server/middleware/security-headers.ts`).

## Prerequisites

- Node.js 18+
- The Spring Boot backend running (see `spring-boilerplate/`), which itself
  requires Redis.
- For production session storage: a Redis instance accessible from the Nuxt
  server (set `REDIS_URL`).

## Setup

```bash
npm install
cp .env.example .env   # adjust NUXT_BACKEND_URL and NUXT_SESSION_SECRET
npm run dev            # http://localhost:3000
```

## Configuration

| Variable | Default | Description |
|---|---|---|
| `NUXT_BACKEND_URL` | `http://localhost:8080` | Spring Boot backend URL (server-to-server, never exposed to browser) |
| `NUXT_SESSION_SECRET` | `dev-only-secret-change-in-production` | HMAC secret for signing the BFF session cookie. **Must be at least 256-bit random in production.** Generate with `openssl rand -hex 32`. |
| `REDIS_URL` | _(unset — uses in-memory)_ | Redis connection URL for distributed session storage. Set in production. |
| `NUXT_SESSION_IDLE_TIMEOUT` | `1800000` (30 min) | Session idle timeout in milliseconds. |
| `NUXT_SESSION_ABSOLUTE_TIMEOUT` | `28800000` (8 hours) | Session absolute timeout in milliseconds. |
| `NUXT_ALLOWED_ORIGINS` | _(empty)_ | Comma-separated list of trusted frontend origins for CSRF Origin validation. |

## Session storage

- **Development**: In-memory Nitro storage (no external dependencies).
- **Staging/Production**: Redis via `REDIS_URL`. Redis stores access/refresh
  tokens — treat it as a sensitive credential store. Production Redis should:
  - Not be publicly accessible
  - Use authentication/ACL
  - Use TLS where appropriate
  - Be network-restricted
  - Have appropriate memory configuration
  - Be monitored for eviction

## Authentication flow

1. **Login**: Browser → `POST /api/auth/login` (BFF) → BFF calls backend →
   BFF stores tokens in session storage → BFF sets `__Host-session` cookie →
   browser receives user profile (no tokens).
2. **Subsequent requests**: Browser → `GET /api/expenses` (BFF) → BFF reads
   session, attaches Bearer token, forwards to backend → browser receives data.
3. **Token expiry**: BFF gets 401 from backend → BFF refreshes using stored
   refresh token → BFF retries with new access token → browser is unaware.
4. **Page reload**: Browser → `GET /api/auth/me` (BFF) → BFF checks session
   cookie → returns cached user profile (no backend round-trip). If no session,
   returns 401 → client redirects to `/login`.
5. **Logout**: Browser → `POST /api/auth/logout` (BFF) → BFF calls backend
   logout (revokes tokens) → BFF destroys session + clears cookie.
6. **MFA**: Login returns `mfaRequired` challenge → browser sends code to
   `POST /api/auth/mfa/verify` (BFF) → BFF verifies, creates session, returns
   profile.

## Security measures

### Token protection

- The browser **never** receives access tokens, refresh tokens, or backend
  JWTs. All token handling is server-side in the BFF.
- The session cookie (`__Host-session`) contains only an opaque session ID
  and HMAC-SHA256 signature.

### Session cookie hardening

- `__Host-session` prefix (RFC 6265): requires `Secure`, no `Domain`
- `httpOnly: true`: not accessible to JavaScript
- `Secure`: only sent over HTTPS in production
- `SameSite: Strict`: prevents cross-site cookie sending
- `path: '/'`: scoped to the entire origin
- HMAC-SHA256 signed with timing-safe comparison

### Refresh-token concurrency

- Distributed single-flight refresh using Redis-backed locking
- Only one refresh operation per session at a time across all Nuxt instances
- Concurrent requests wait for the existing refresh and use the updated token
- Locks expire automatically if an instance crashes

### CSRF protection

- `SameSite=Strict` cookies provide primary CSRF defense
- Centralized Origin header validation on state-changing requests
- Fetch Metadata headers (`Sec-Fetch-Site`, `Sec-Fetch-Mode`) as additional signals
- Cross-origin state-changing requests are rejected

### Session lifecycle

- **Idle timeout**: 30 minutes of inactivity
- **Absolute timeout**: 8 hours maximum session lifetime
- **Session rotation**: new session ID generated after login and MFA verification
- **Cache-Control**: `no-store` on all authenticated responses

### Security headers

- `Content-Security-Policy`: `script-src 'self'` (no `unsafe-inline`)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`: camera, microphone, geolocation disabled
- `Strict-Transport-Security`: HSTS with preload (production)
- `X-DNS-Prefetch-Control: off`

### Request limits

- Supported methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
- Body-size limit: 10 MB
- Query-string length limit: 2048 characters
- Query parameter count limit: 50

### Error handling

- No stack traces, SQL errors, database details, or internal hostnames exposed
- Safe application-level errors returned to the browser
- Detailed diagnostics in secure server-side logs only

### Security logging

- Security events logged server-side (login success/failure, MFA, session
  lifecycle, token refresh, password changes)
- Never logs: tokens, session IDs, passwords, cookies, Authorization headers

### Frontend permissions (presentation-only)

- Client-side `derivePermissions()` for UI gating (menus, buttons, visibility)
- The Spring Boot backend remains the final authorization authority
- Frontend state is never a security boundary

### Tenant isolation

- All tenant-scoped operations enforce tenant isolation server-side
- Client-supplied tenant/department/user IDs are never trusted as authorization

## CSP report endpoint

`POST /api/csp-report` receives Content-Security-Policy violation reports.
Hardened with rate limiting, payload validation, and safe logging.

## OWASP Top 10 coverage

- **A01:2021 – Broken Access Control**: Tokens never exposed to JS. Session cookie is httpOnly + SameSite=Strict + HMAC-signed.
- **A02:2021 – Cryptographic Failures**: HMAC-SHA256 signed session cookie; refresh token never leaves the server.
- **A03:2021 – Injection (XSS)**: CSP with `script-src 'self'` (no `unsafe-inline`), `object-src 'none'`, `base-uri 'self'`.
- **A04:2021 – Insecure Design**: BFF architecture keeps tokens server-side; frontend permissions are presentation-only.
- **A05:2021 – Security Misconfiguration**: HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff, Permissions-Policy.
- **A07:2021 – Identification & Auth Failures**: Session cookie is timing-safe-verified; refresh rotation handled by backend; logout revokes all tokens; session rotation after login/MFA.
- **A08:2021 – Software & Data Integrity Failures**: BFF validates session cookie signature on every request; tampered cookies are rejected.
- **A09:2021 – Logging & Monitoring Failures**: Security events logged server-side without sensitive data.

## Scripts

```bash
npm run dev          # dev server
npm run build        # production build
npm run typecheck    # vue-tsc type checking
npm run lint         # eslint
```
