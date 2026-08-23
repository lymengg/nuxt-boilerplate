import type { ApiResponse } from '~/types/api'
import type { UserProfileResponse } from '~/types/auth'

/**
 * BFF refresh: exchanges the stored refresh token for a new token pair via
 * the backend, updates the BFF session, and returns the user profile.
 *
 * The browser calls this when it gets a 401 from a BFF-proxied API route and
 * the BFF's automatic retry wasn't enough (e.g. the session expired between
 * requests). If the refresh fails, the session is destroyed and a 401 is
 * returned so the client can redirect to login.
 */
export default defineEventHandler(async (event) => {
  const refreshed = await refreshBffSession(event)

  if (!refreshed) {
    throw createError({ statusCode: 401, statusMessage: 'Session expired' })
  }

  const response: ApiResponse<UserProfileResponse> = {
    success: true,
    message: 'Session refreshed',
    data: refreshed.user,
    timestamp: new Date().toISOString(),
  }

  return response
})
