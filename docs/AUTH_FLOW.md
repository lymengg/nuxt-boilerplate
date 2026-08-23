# Authentication & Authorization Flow

This document describes the complete auth architecture for the Nuxt 3 + Spring Boot boilerplate.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Server-Side (BFF Layer)](#server-side-bff-layer)
  - [Session Management](#session-management)
  - [API Endpoints](#bff-api-endpoints)
  - [Catch-All Proxy](#catch-all-proxy)
  - [Security Headers](#security-headers)
- [Client-Side](#client-side)
  - [Auth Store](#auth-store)
  - [Auth Service](#auth-service)
  - [Plugins](#plugins)
  - [Middleware](#middleware)
  - [Composables](#composables)
- [Flows](#flows)
  - [Login Flow](#login-flow)
  - [MFA Flow](#mfa-flow)
  - [Session Restoration (Page Load)](#session-restoration-page-load)
  - [Protected API Calls](#protected-api-calls)
  - [Logout Flow](#logout-flow)
  - [Password Change Flow](#password-change-flow)
  - [Forgot / Reset Password Flow](#forgot--reset-password-flow)
- [Authorization Model](#authorization-model)
  - [Roles & Permissions](#roles--permissions)
  - [Permission Derivation](#permission-derivation)
  - [Enforcement](#enforcement)
- [Token & Session Storage](#token--session-storage)
- [Security Measures](#security-measures)
- [File Reference](#file-reference)

---

## Architecture Overview

The application implements a **Backend-for-Frontend (BFF) pattern** ([RFC 9700 Tier 1](https://datatracker.ietf.org/doc/html/rfc9700#section-2)). The browser **never sees** access tokens or refresh tokens. All token management happens server-side in the Nuxt (Nitro) layer.

```
Browser  <-->  Nuxt BFF (Nitro server routes)  <-->  Spring Boot Backend
              (opaque httpOnly cookie)              (access + refresh tokens)
```

- The browser communicates only with same-origin `/api/*` routes on the Nuxt server.
- The BFF stores access/refresh tokens server-side in an opaque session.
- A signed, `httpOnly`, `SameSite=Strict` cookie (`bff_session`) identifies the session.
- Tokens are **never** exposed to JavaScript in the browser.

---

## Server-Side (BFF Layer)

### Session Management

**File:** `server/utils/session.ts`

Core session management functions built on top of Nitro's storage layer:

| Function | Description |
|---|---|
| `createBffSession(event, data)` | Creates a new session, stores tokens + profile in Nitro storage, sets signed cookie |
| `getBffSession(event)` | Reads and validates the session cookie (HMAC-SHA256), returns session data or `null` |
| `updateBffSession(event, data)` | Updates session data in storage (e.g., after token refresh) |
| `destroyBffSession(event)` | Removes session from storage and clears the cookie |
| `refreshBffSession(event)` | Exchanges refresh token for new tokens via backend, updates session, or destroys on failure |

**Session Cookie:**
- Name: `bff_session`
- Format: `{UUID}.{HMAC-SHA256(UUID)}`
- Properties: `httpOnly: true`, `secure: true` (prod), `sameSite: 'strict'`, `path: '/'`, `maxAge: 7 days`
- HMAC secret: `NUXT_SESSION_SECRET` env var
- Timing-safe comparison to prevent timing attacks

**Session Data Stored:**
```typescript
interface SessionData {
  accessToken: string    // Backend access token (server-side only)
  refreshToken: string   // Backend refresh token (server-side only)
  user: UserProfileResponse  // Cached user profile (no backend round-trip for /api/auth/me)
}
```

**Storage Backend:**
- Dev: in-memory (Nitro memory driver)
- Prod: Redis via `REDIS_URL` env var
- TTL: 30 minutes (matches backend access token TTL)

---

### BFF API Endpoints

All auth endpoints are dedicated server routes under `server/api/auth/`. They are **not** routed through the catch-all proxy.

| Endpoint | Method | File | Description |
|---|---|---|---|
| `/api/auth/login` | POST | `server/api/auth/login.post.ts` | Proxies credentials to backend; creates BFF session on success or returns MFA challenge |
| `/api/auth/mfa/verify` | POST | `server/api/auth/mfa/verify.post.ts` | Proxies MFA code to backend; creates BFF session with resulting tokens |
| `/api/auth/me` | GET | `server/api/auth/me.get.ts` | Returns cached user profile from BFF session (no backend call) |
| `/api/auth/refresh` | POST | `server/api/auth/refresh.post.ts` | Exchanges stored refresh token for new token pair, updates session |
| `/api/auth/logout` | POST | `server/api/auth/logout.post.ts` | Calls backend logout (revokes tokens), destroys BFF session, clears cookie |
| `/api/auth/change-password` | POST | `server/api/auth/change-password.post.ts` | Proxies to backend; destroys session after success (backend revokes all tokens) |
| `/api/auth/forgot-password` | POST | `server/api/auth/forgot-password.post.ts` | Public endpoint, proxies to backend (no session needed) |
| `/api/auth/reset-password` | POST | `server/api/auth/reset-password.post.ts` | Public endpoint, proxies to backend (reset token authenticates) |

---

### Catch-All Proxy

**File:** `server/api/[...path].ts`

Routes all non-auth API requests (e.g., `/api/expenses/*`, `/api/management/*`):

1. Reads the BFF session from the cookie.
2. Attaches the access token as a `Bearer` header when forwarding to the Spring Boot backend.
3. **On 401:** transparently calls `refreshBffSession()` to get a new token pair and retries the request once.
4. **On refresh failure:** destroys the session, returns 401 to the client.
5. Returns the backend response body to the browser (the backend URL and tokens are never exposed).

---

### Security Headers

**File:** `server/middleware/security-headers.ts`

Applied to every response from the Nuxt server:

| Header | Value | Purpose |
|---|---|---|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self'; ...` | Prevents XSS, data exfiltration, inline script injection |
| `X-Frame-Options` | `DENY` | Prevents clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer leakage |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disables unused browser APIs |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Forces HTTPS (prod only) |
| `X-DNS-Prefetch-Control` | `off` | Disables DNS prefetching |

In development, CSP uses `Content-Security-Policy-Report-Only` to avoid breaking the app during iteration.

---

## Client-Side

### Auth Store

**File:** `stores/auth.ts`

Pinia store — single source of truth for authentication state on the client.

**State:**
- `user: AuthUser | null` — authenticated user profile (includes derived permissions)
- `pendingMfa` — active MFA challenge from login (in-memory, single-use)
- `isAuthenticated: boolean` — computed, `true` when `user` is set

**Actions:**
| Action | Description |
|---|---|
| `login(usernameOrEmail, password)` | Calls BFF `/api/auth/login`; sets user profile or stores MFA challenge |
| `verifyMfa(code)` | Completes pending MFA challenge; sets user profile |
| `cancelMfa()` | Clears pending MFA challenge |
| `logout()` | Calls BFF `/api/auth/logout`; clears state, navigates to `/login` |
| `restoreSession()` | Calls BFF `/api/auth/me` to restore session on page load |
| `changePassword(current, new, confirm)` | Calls BFF `/api/auth/change-password`; clears user state |

**Key Detail:** The store only receives and stores the user profile (no tokens). Permissions are derived client-side from roles via `derivePermissions()`.

---

### Auth Service

**File:** `services/auth.service.ts`

Thin HTTP wrapper around `$fetch` calling same-origin BFF endpoints. No `baseURL` needed (same-origin). No `credentials: 'include'` needed (cookies included by default for same-origin).

| Method | BFF Endpoint |
|---|---|
| `login(data)` | `POST /api/auth/login` |
| `verifyMfa(data)` | `POST /api/auth/mfa/verify` |
| `logout()` | `POST /api/auth/logout` |
| `getCurrentUser()` | `GET /api/auth/me` |
| `changePassword(data)` | `POST /api/auth/change-password` |
| `forgotPassword(data)` | `POST /api/auth/forgot-password` |
| `resetPassword(data)` | `POST /api/auth/reset-password` |

---

### Plugins

**File:** `plugins/auth.client.ts`

Client-only plugin that restores the session on app initialization by calling `authStore.restoreSession()`. This hits BFF `/api/auth/me` which reads the session cookie and returns the cached user profile. If the session is invalid/missing, the store stays empty and route middleware redirects to `/login`.

---

### Middleware

| File | Name | Description |
|---|---|---|
| `middleware/auth.ts` | `auth` | Redirects unauthenticated users to `/login` |
| `middleware/guest.ts` | `guest` | Redirects authenticated users to `/dashboard` (used on login, forgot-password pages) |
| `middleware/permission.ts` | `permission` | Checks `to.meta.permission` against user's derived permissions; redirects to `/unauthorized` if missing |

**Usage in pages:**
```vue
<script setup>
definePageMeta({
  middleware: ['auth', 'permission'],
  permission: 'USER_READ', // checked by permission middleware
})
</script>
```

---

### Composables

**File:** `composables/useAuthorization.ts`

Provides permission-checking helpers that read from the auth store's derived permissions:

| Method | Description |
|---|---|
| `can(permission)` | Returns `true` if the user has the specified permission |
| `canAny(...permissions)` | Returns `true` if the user has at least one of the specified permissions |
| `canAll(...permissions)` | Returns `true` if the user has all of the specified permissions |
| `hasRole(role)` | Returns `true` if the user has the specified role |
| `hasAnyRole(...roles)` | Returns `true` if the user has at least one of the specified roles |

---

## Flows

### Login Flow

```
1. User submits credentials on /login page
2. authStore.login() -> authService.login() -> BFF POST /api/auth/login
3. BFF proxies credentials to Spring Boot POST /api/auth/login

   ┌─ If MFA required:
   │  Backend returns MfaLoginResponse
   │  BFF passes it through (no session created)
   │  Client stores pendingMfa, navigates to /mfa/verify
   │
   └─ If login succeeds:
      Backend returns TokenResponse (accessToken + refreshToken)
      BFF fetches user profile from backend GET /api/auth/me
      BFF creates opaque session (stores tokens + profile in Nitro storage)
      BFF sets signed httpOnly cookie (bff_session)
      BFF returns only the user profile to the browser (no tokens)
4. Client sets user in store, navigates to /dashboard
```

---

### MFA Flow

```
1. User enters 6-digit code on /mfa/verify
2. authStore.verifyMfa() -> authService.verifyMfa() -> BFF POST /api/auth/mfa/verify
3. BFF proxies code + mfaSessionToken to Spring Boot POST /api/auth/mfa/verify
4. Backend returns TokenResponse
5. BFF fetches user profile, creates BFF session, returns profile
6. Client sets user in store, navigates to /dashboard
```

**Supported MFA methods:** `TOTP`, `EMAIL`

---

### Session Restoration (Page Load)

```
1. plugins/auth.client.ts fires on app init
2. Calls authStore.restoreSession()
3. Hits BFF GET /api/auth/me
4. BFF reads bff_session cookie, verifies HMAC signature, looks up session in storage
   ├─ Valid: returns cached user profile (no backend call needed)
   └─ Invalid/missing: returns 401
5. Client store populated or stays empty
6. Route middleware (auth.ts) redirects to /login if not authenticated
```

---

### Protected API Calls

```
1. Browser calls same-origin /api/expenses, /api/management/users, etc.
2. BFF catch-all (server/api/[...path].ts) reads session, attaches Bearer header, proxies to backend
3. Backend processes request and returns response
   ├─ Success: BFF returns response body to browser
   └─ 401: BFF calls refreshBffSession()
        ├─ Refresh succeeds: updates session, retries request once
        └─ Refresh fails: destroys session, returns 401 to client
4. Client redirects to /login on 401
```

---

### Logout Flow

```
1. User clicks logout in AppHeader
2. authStore.logout() -> authService.logout() -> BFF POST /api/auth/logout
3. BFF calls Spring Boot POST /api/auth/logout (revokes tokens server-side)
4. BFF destroys BFF session and clears bff_session cookie
5. Client clears local state, navigates to /login
```

---

### Password Change Flow

```
1. User opens ChangePasswordDialog and submits new password
2. authStore.changePassword() -> BFF POST /api/auth/change-password
3. BFF proxies to backend with session's access token
4. Backend revokes all refresh tokens on success
5. BFF destroys the session
6. Client redirects to /login?passwordChanged=1
```

---

### Forgot / Reset Password Flow

**Forgot Password:**
```
1. User submits email on /forgot-password page
2. authService.forgotPassword() -> BFF POST /api/auth/forgot-password
3. BFF proxies to backend (no session needed)
4. Backend always returns same message (anti-user-enumeration)
5. User sees "check your email" confirmation
```

**Reset Password:**
```
1. User clicks link in email -> navigates to /reset-password?token=...
2. User submits new password
3. authService.resetPassword() -> BFF POST /api/auth/reset-password
4. BFF proxies to backend (reset token in body authenticates the request)
5. Backend updates password, returns success
6. User navigates to /login
```

---

## Authorization Model

### Roles & Permissions

**7 roles**, each granting a set of the **30 permissions**:

| Role | Permissions |
|---|---|
| `PLATFORM_ADMIN` | All 30 permissions |
| `TENANT_ADMIN` | All except `TENANT_CREATE`, `TENANT_DELETE`, `MFA_MANAGE` |
| `USER_MANAGER` | `USER_READ`, `USER_WRITE`, `USER_CREATE`, `USER_ASSIGN_ROLE` |
| `DEPARTMENT_MANAGER` | `USER_READ`, `DEPARTMENT_READ`, `EXPENSE_READ`, `EXPENSE_APPROVE`, `EXPENSE_REJECT`, `REPORT_READ` |
| `EMPLOYEE` | `EXPENSE_READ`, `EXPENSE_CREATE`, `EXPENSE_UPDATE`, `EXPENSE_DELETE` |
| `AUDITOR` | `USER_READ`, `DEPARTMENT_READ`, `EXPENSE_READ`, `EXPENSE_READ_ALL`, `REPORT_READ`, `AUDIT_LOG_READ` |
| `FINANCE` | `EXPENSE_READ`, `EXPENSE_READ_ALL`, `EXPENSE_PROCESS`, `REPORT_READ` |

**Permission groups:**
- **Tenants:** `TENANT_READ`, `TENANT_CREATE`, `TENANT_UPDATE`, `TENANT_DELETE`
- **Users:** `USER_READ`, `USER_WRITE`, `USER_CREATE`, `USER_UPDATE`, `USER_DELETE`, `USER_ENABLE`, `USER_ASSIGN_ROLE`
- **Roles:** `ROLE_READ`, `ROLE_WRITE`, `ROLE_DELETE`, `ROLE_ASSIGN_PERMISSION`
- **Departments:** `DEPARTMENT_READ`, `DEPARTMENT_CREATE`, `DEPARTMENT_UPDATE`, `DEPARTMENT_DELETE`
- **Expenses:** `EXPENSE_READ`, `EXPENSE_READ_ALL`, `EXPENSE_CREATE`, `EXPENSE_UPDATE`, `EXPENSE_DELETE`, `EXPENSE_APPROVE`, `EXPENSE_REJECT`, `EXPENSE_PROCESS`
- **MFA:** `MFA_MANAGE`
- **Reporting & Audit:** `REPORT_READ`, `AUDIT_LOG_READ`

---

### Permission Derivation

**File:** `utils/permissions.ts`

The backend does not expose the user's permissions (only roles). The client derives permissions client-side using `derivePermissions(roles)`:

```typescript
function derivePermissions(roles: string[]): string[] {
  const granted = new Set<string>()
  for (const role of roles) {
    for (const permission of ROLE_PERMISSIONS[role] ?? []) {
      granted.add(permission)
    }
  }
  return [...granted]
}
```

The derived permission set is stored in `AuthUser.permissions` and accessed via the `useAuthorization()` composable.

---

### Enforcement

- **Backend** is always the enforcement point. Client-side checks are purely presentational (hide/show UI elements).
- **Route middleware** (`permission.ts`) provides a second layer of client-side gating by checking `to.meta.permission`.
- **UI components** use `can()`, `canAny()`, `hasRole()` to conditionally render actions (e.g., create buttons, sidebar menu items).

---

## Token & Session Storage

| Concern | Implementation |
|---|---|
| Access token | Stored server-side only in BFF session (Nitro storage). Never sent to browser. |
| Refresh token | Stored server-side only in BFF session. Never sent to browser. |
| Session identifier | HMAC-SHA256-signed opaque cookie (`bff_session`). Payload is a UUID + signature. |
| Cookie properties | `httpOnly: true`, `secure: true` (prod), `sameSite: 'strict'`, `path: '/'`, `maxAge: 7 days` |
| Session storage | In-memory (dev) or Redis (`REDIS_URL`). TTL: 30 minutes. |
| Token refresh | Automatic in the catch-all proxy: on 401, refreshes session and retries once. |
| HMAC secret | `NUXT_SESSION_SECRET` env var. Uses `crypto.createHmac('sha256', secret)`. Timing-safe comparison. |

---

## Security Measures

| Measure | Implementation |
|---|---|
| BFF pattern | Browser never sees tokens (RFC 9700 Tier 1) |
| HMAC-signed session cookie | Prevents tampering. Timing-safe comparison to prevent timing attacks |
| Security headers | CSP, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, HSTS, Permissions-Policy, Referrer-Policy |
| No registration endpoint | User management is admin-only (no self-registration) |
| Anti-user-enumeration | Forgot password always returns the same message regardless of email existence |
| Password policy | Min 8 chars, 1 uppercase, 1 lowercase, 1 number. Enforced client-side (Yup) and server-side (backend `@Password` validator) |
| Same-origin only | BFF is same-origin; no CORS needed. Backend URL never exposed to browser |

---

## File Reference

### Server-Side

| File | Purpose |
|---|---|
| `server/utils/session.ts` | Core BFF session management (create, get, update, destroy, refresh) |
| `server/api/auth/login.post.ts` | BFF login endpoint |
| `server/api/auth/logout.post.ts` | BFF logout endpoint |
| `server/api/auth/me.get.ts` | BFF session check endpoint |
| `server/api/auth/refresh.post.ts` | BFF session refresh endpoint |
| `server/api/auth/mfa/verify.post.ts` | BFF MFA verification endpoint |
| `server/api/auth/change-password.post.ts` | BFF change password endpoint |
| `server/api/auth/forgot-password.post.ts` | BFF forgot password endpoint (public) |
| `server/api/auth/reset-password.post.ts` | BFF reset password endpoint (public) |
| `server/api/[...path].ts` | BFF catch-all proxy with auto-refresh |
| `server/middleware/security-headers.ts` | OWASP security headers middleware |

### Client-Side

| File | Purpose |
|---|---|
| `stores/auth.ts` | Pinia auth store (single source of truth) |
| `services/auth.service.ts` | Auth HTTP service (BFF API calls) |
| `plugins/auth.client.ts` | Client-only session restoration on page load |
| `middleware/auth.ts` | Authentication route guard |
| `middleware/guest.ts` | Guest route guard (redirects authenticated users) |
| `middleware/permission.ts` | Authorization route guard (permission check) |
| `composables/useAuthorization.ts` | Permission-checking composable (`can`, `hasRole`, etc.) |
| `utils/permissions.ts` | Client-side role-to-permission mapping |
| `schemas/login.ts` | Login form validation (Yup) |
| `schemas/mfa.ts` | MFA code validation (Yup) |
| `schemas/password.ts` | Password change/reset/forgot validation (Yup) |

### Types

| File | Purpose |
|---|---|
| `types/auth.ts` | Auth DTOs (LoginRequest, TokenResponse, MfaLoginResponse, UserProfileResponse, AuthUser, etc.) |
| `types/user.ts` | User DTOs (includes roles, permissions, mfaEnabled, mfaMethod) |
| `types/role.ts` | Role DTOs (includes permissions array) |
| `types/permission.ts` | Permission catalog (PERMISSION_GROUPS for role-management UI) |
| `types/user-permission.ts` | UserPermission union type (mirrors Spring Boot enum) |
| `types/api.ts` | Generic ApiResponse<T> envelope, Page<T>, pagination types |

### Pages

| Page | Middleware | Layout | Auth Purpose |
|---|---|---|---|
| `pages/index.vue` | — | — | Root redirect to `/dashboard` or `/login` |
| `pages/login.vue` | `guest` | `auth` | Login form |
| `pages/mfa/verify.vue` | — | `auth` | MFA code entry |
| `pages/forgot-password.vue` | `guest` | `auth` | Forgot password form |
| `pages/reset-password.vue` | — | `auth` | Reset password form |
| `pages/unauthorized.vue` | — | `default` | Access denied page |
| `pages/dashboard.vue` | `auth` | `dashboard` | Protected dashboard |
| `pages/expenses/index.vue` | `auth` | `dashboard` | Protected expenses list |
| `pages/management/users/index.vue` | `auth`, `permission: 'USER_READ'` | `dashboard` | Protected user management |
| `pages/management/roles/index.vue` | `auth`, `permission: 'ROLE_READ'` | `dashboard` | Protected role management |
| `pages/management/tenants/index.vue` | `auth`, `permission: 'TENANT_READ'` | `dashboard` | Protected tenant management |
| `pages/management/departments/index.vue` | `auth`, `permission: 'DEPARTMENT_READ'` | `dashboard` | Protected department management |
| `pages/management/audit/index.vue` | `auth`, `permission: 'AUDIT_LOG_READ'` | `dashboard` | Protected audit log |

### Layouts

| Layout | Purpose |
|---|---|
| `layouts/auth.vue` | Centered card layout for login/MFA/forgot/reset password pages |
| `layouts/dashboard.vue` | Full dashboard layout with header + sidebar for authenticated pages |
| `layouts/default.vue` | Minimal wrapper (used by unauthorized page) |

### Components

| Component | Purpose |
|---|---|
| `components/layout/AppHeader.vue` | User avatar/name, logout button, change-password menu |
| `components/layout/AppSidebar.vue` | Sidebar menu filtered by user permissions via `can()` |
| `components/layout/ChangePasswordDialog.vue` | Modal for changing password |

### Configuration

| File | Purpose |
|---|---|
| `nuxt.config.ts` | Runtime config: `backendUrl`, `sessionSecret`, `sessionTtl`; Nitro storage config |
| `.env.example` | Documents env vars: `NUXT_BACKEND_URL`, `NUXT_SESSION_SECRET`, `REDIS_URL` |
