# Nuxt Expense Management (Frontend)

Nuxt 3 + PrimeVue frontend for the Spring Boot expense management API
(`spring-boilerplate`). The frontend is a **static SPA** that calls the
backend API directly (e.g. `https://api.xxx.com`) — there is no proxy and no
server-side session layer.

## Architecture

```
Browser (static SPA on xxx.com)
   │  fetch('https://api.xxx.com/api/...') with httpOnly cookies, credentials: 'include'
   ▼
Spring Boot (api.xxx.com) — owns auth entirely
```

- **Auth is fully backend-owned.** Spring sets `__Host-access_token` (15 min)
  and `__Host-refresh_token` (7 days) httpOnly cookies (`Secure`,
  `SameSite=Strict`, host-only, `Path=/`). The SPA sends them via
  `credentials: 'include'`; JavaScript never reads them.
- **Same-site, cross-origin.** `xxx.com` and `api.xxx.com` share a registrable
  domain, so `SameSite=Strict` cookies flow. CORS on the backend allows
  exactly the frontend origin (see `CorsConfig`).
- **CSRF defense**: `SameSite=Strict` + backend `OriginCheckFilter` — for
  state-changing requests the `Origin` header must match the configured
  frontend origin.
- **Token expiry**: on a 401 the client calls `POST /api/auth/refresh` once
  (single-flight, shared across concurrent requests) and retries. If the
  refresh fails, the session is gone → redirect to `/login`.
- **Security headers** (CSP, X-Frame-Options, HSTS, etc.): **set them at your
  static host / CDN in production** — the SPA output contains no server and
  sets no headers. The API sets its own headers via Spring Security.

## Prerequisites

- Node.js 18+
- The Spring Boot backend running at `NUXT_PUBLIC_API_BASE` (default
  `http://localhost:8080`), which itself requires Redis (refresh tokens, MFA,
  rate limiting). The backend must CORS-allow the SPA origin
  (`app.frontend-url`).

## Setup

```bash
npm install
cp .env.example .env   # adjust NUXT_PUBLIC_API_BASE
npm run dev            # http://localhost:3000
```

## Configuration

| Variable | Default | Description |
|---|---|---|
| `NUXT_PUBLIC_API_BASE` | `http://localhost:8080` | API origin the SPA calls directly (e.g. `https://api.xxx.com` in production). Baked in at build time. |

## Authentication flow

1. **Login**: Browser → `POST https://api.xxx.com/api/auth/login` → backend
   verifies credentials and sets the httpOnly access + refresh cookies →
   browser receives the user profile (never tokens).
2. **Subsequent requests**: `GET /api/expenses` → access cookie attached →
   backend authenticates → data returned.
3. **Token expiry**: Backend returns 401 → client calls `POST /api/auth/refresh`
   (single-flight) → backend rotates the tokens and sets new cookies → client
   retries the original request once.
4. **Page reload**: `GET /api/auth/me` → backend returns the current user
   profile. On 401 the store stays empty → route middleware redirects to
   `/login`.
5. **Logout**: `POST /api/auth/logout` → backend revokes tokens and clears
   both cookies.
6. **MFA**: Login returns `mfaRequired` challenge → browser sends code to
   `POST /api/auth/mfa/verify` → backend verifies, sets cookies, returns
   profile.

## Security measures (OWASP Top 10 for frontend)

- **A03:2021 – Injection (XSS)**: CSP with `script-src 'self'` (no
  `unsafe-inline`), `object-src 'none'`, `base-uri 'self'`.
- **A01:2021 – Broken Access Control**: Tokens never exposed to JS — they live
  in httpOnly, `SameSite=Strict`, host-only cookies. XSS cannot read them.
- **A05:2021 – Security Misconfiguration**: HSTS, X-Frame-Options DENY,
  X-Content-Type-Options nosniff, Permissions-Policy (camera/mic disabled).
- **A02:2021 – Cryptographic Failures**: No secrets in this app; all token
  handling (signing, rotation, revocation) is backend-owned.
- **A07:2021 – Identification & Auth Failures**: Backend rotates refresh
  tokens on use (with a reuse grace window for multi-tab safety), revokes on
  logout/password change, and audits all auth events.
- **A08:2021 – Software & Data Integrity Failures**: Cross-origin state-changing
  requests are rejected by the backend (`OriginCheckFilter`).
- **A09:2021 – Logging & Monitoring Failures**: All auth events audited by the
  backend (login, logout, MFA, refresh, lockout).

## Scripts

```bash
npm run dev          # dev server
npm run build        # production build
npm run generate     # static site output (for CDN/static hosting)
npm run typecheck    # vue-tsc type checking
npm run lint         # eslint
```
