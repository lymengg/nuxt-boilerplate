import type { ApiResponse } from '~/types/api'

/**
 * BFF logout: calls the backend logout endpoint (revokes tokens server-side),
 * then destroys the BFF session and clears the cookie.
 *
 * If backend logout fails, the local session is still destroyed so the user
 * is logged out client-side. Backend tokens are never exposed to the browser.
 */
export default defineEventHandler(async (event) => {
  setNoCacheHeaders(event)

  const session = await getBffSession(event)

  if (session) {
    const config = useRuntimeConfig()
    try {
      await $fetch<ApiResponse<void>>('/api/auth/logout', {
        baseURL: config.backendUrl,
        method: 'POST',
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })
    }
    catch {
      // Backend logout may fail if the token is already expired — still
      // destroy the local session so the user is logged out client-side.
    }
  }

  await destroyBffSession(event)

  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    event: 'LOGOUT',
  }))

  return {
    success: true,
    message: 'Logged out successfully',
    data: null,
  }
})
