import type { ApiResponse } from '~/types/api'
import type { UserProfileResponse } from '~/types/auth'

/**
 * BFF session check: returns the cached user profile from the BFF session.
 * No backend round-trip needed — the profile was fetched at login time and
 * stored alongside the tokens.
 *
 * If the session doesn't exist, returns a 401 so the client can redirect to
 * login. This is the endpoint the auth plugin calls on page load.
 */
export default defineEventHandler(async (event) => {
  const session = await getBffSession(event)

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'No active session' })
  }

  const response: ApiResponse<UserProfileResponse> = {
    success: true,
    message: 'Session active',
    data: session.user,
    timestamp: new Date().toISOString(),
  }

  return response
})
