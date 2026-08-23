# Nuxt Expense Management (Frontend)

Nuxt 3 + PrimeVue frontend for the Spring Boot expense management API
(`spring-boilerplate`). Uses a **BFF (Backend-for-Frontend)** architecture
(RFC 9700 Tier 1) — the browser never sees access tokens, refresh tokens, or
the backend URL.

## Architecture

```
Browser  ──same-origin /api/*──▶  Nuxt Server (BFF)  ──server-to-server──▶  Spring Boot
         (opaque session cookie)   (holds tokens in         (Bearer token)
                                    Nitro storage)
```

- **Tokens live server-side only.** The Nuxt server (Nitro) stores the access
  and refresh tokens in its `session` storage mount (in-memory for dev, Redis
  for production). The browser receives only an opaque, HMAC-signed, httpOnly
  session cookie.
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
| `NUXT_SESSION_SECRET` | `dev-only-secret-change-in-production` | HMAC secret for signing the BFF session cookie. **Must be a long random string in production.** |
| `REDIS_URL` | _(unset — uses in-memory)_ | Redis connection URL for distributed session storage. Set in production. |

## Authentication flow

1. **Login**: Browser → `POST /api/auth/login` (BFF) → BFF calls backend →
   BFF stores tokens in session storage → BFF sets opaque cookie → browser
   receives user profile (no tokens).
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

## Security measures (OWASP Top 10 for frontend)

- **A03:2021 – Injection (XSS)**: CSP with `script-src 'self'` (no
  `unsafe-inline`), `object-src 'none'`, `base-uri 'self'`.
- **A01:2021 – Broken Access Control**: Tokens never exposed to JS (XSS cannot
  steal them). Session cookie is httpOnly + SameSite=Strict + HMAC-signed.
- **A05:2021 – Security Misconfiguration**: HSTS, X-Frame-Options DENY,
  X-Content-Type-Options nosniff, Permissions-Policy (camera/mic disabled).
- **A02:2021 – Cryptographic Failures**: Session cookie HMAC-SHA256 signed;
  refresh token never leaves the server side.
- **A07:2021 – Identification & Auth Failures**: Session cookie is
  timing-safe-verified; refresh rotation handled by backend; logout revokes
  all tokens.
- **A08:2021 – Software & Data Integrity Failures**: BFF validates session
  cookie signature on every request; tampered cookies are rejected.
- **A09:2021 – Logging & Monitoring Failures**: All auth events audited by
  the backend (login, logout, MFA, refresh, lockout).

## Scripts

```bash
npm run dev          # dev server
npm run build        # production build
npm run typecheck    # vue-tsc type checking
npm run lint         # eslint
```
