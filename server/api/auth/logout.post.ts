import type { ApiResponse } from '~/types/api'

/**
 * BFF logout: calls the backend logout endpoint (revokes tokens server-side),
 * then destroys the BFF session and clears the cookie.
 */
export default defineEventHandler(async (event) => {
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

  return {
    success: true,
    message: 'Logged out successfully',
    data: null,
  }
})
