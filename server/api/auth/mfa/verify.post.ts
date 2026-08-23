import type { ApiResponse } from '~/types/api'
import type { MfaVerifyRequest, TokenResponse, UserProfileResponse } from '~/types/auth'

/**
 * BFF MFA verify: proxies the MFA code to the backend, then creates a BFF
 * session with the resulting tokens. Returns the user profile (no tokens).
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<MfaVerifyRequest>(event)
  const config = useRuntimeConfig()

  const response = await $fetch<ApiResponse<TokenResponse>>('/api/auth/mfa/verify', {
    baseURL: config.backendUrl,
    method: 'POST',
    body,
  })

  if (!response.success || !response.data) {
    return response
  }

  const data = response.data

  // Fetch the user profile, then create the BFF session.
  const profile = await $fetch<ApiResponse<UserProfileResponse>>('/api/auth/me', {
    baseURL: config.backendUrl,
    method: 'GET',
    headers: { Authorization: `Bearer ${data.accessToken}` },
  })

  if (!profile.success || !profile.data) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to load user profile after MFA verification' })
  }

  await createBffSession(event, {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: profile.data,
  })

  return {
    success: true,
    message: response.message,
    data: profile.data,
  }
})
