import type { ApiResponse } from '~/types/api'
import type { MfaVerifyRequest, TokenResponse, UserProfileResponse } from '~/types/auth'

/**
 * BFF MFA verify: proxies the MFA code to the backend, then creates a BFF
 * session with the resulting tokens. Returns the user profile (no tokens).
 *
 * Session rotation: a new session ID is generated after successful MFA
 * verification to prevent session fixation attacks.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<MfaVerifyRequest>(event)
  const config = useRuntimeConfig()

  setNoCacheHeaders(event)

  let response: ApiResponse<TokenResponse>
  try {
    response = await $fetch<ApiResponse<TokenResponse>>('/api/auth/mfa/verify', {
      baseURL: config.backendUrl,
      method: 'POST',
      body,
    })
  }
  catch {
    throw createError({ statusCode: 502, statusMessage: 'Backend unavailable' })
  }

  if (!response.success || !response.data) {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      event: 'MFA_FAILURE',
    }))
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

  // Use rotateSession to prevent session fixation
  await rotateSession(event, {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: profile.data,
    createdAt: Date.now(),
    lastActivityAt: Date.now(),
  })

  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    event: 'MFA_SUCCESS',
  }))

  return {
    success: true,
    message: response.message,
    data: profile.data,
  }
})
