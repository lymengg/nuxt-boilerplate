/**
 * Client-only: restores the session on page load by calling `/api/auth/me`
 * directly on the Spring backend. The backend checks the httpOnly session
 * cookie and returns the user profile. If the session doesn't exist (no
 * cookie, expired, etc.), the backend returns a 401 and the store stays
 * empty — route middleware then redirects to /login.
 *
 * Skips the restore call on auth pages (login, forgot-password, etc.)
 * since there is no session to restore there.
 */
const AUTH_ROUTES = ['/login', '/forgot-password', '/reset-password', '/mfa']

export default defineNuxtPlugin(async () => {
  const route = useRoute()
  if (AUTH_ROUTES.some(p => route.path.startsWith(p))) {
    return
  }
  await useAuthStore().restoreSession()
})
