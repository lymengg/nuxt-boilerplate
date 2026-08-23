/**
 * Client-only: restores the session on page load by calling the BFF
 * `/api/auth/me` endpoint. The BFF checks the opaque session cookie and
 * returns the cached user profile (no tokens, no backend round-trip).
 *
 * If the session doesn't exist (no cookie, expired, or Redis evicted it), the
 * BFF returns a 401 and the store stays empty — route middleware then
 * redirects to /login.
 *
 * Unlike the pre-BFF flow, this does NOT fire a refresh request for anonymous
 * users. The BFF only returns data if a valid session cookie is present.
 */
export default defineNuxtPlugin(async () => {
  await useAuthStore().restoreSession()
})
