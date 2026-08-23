import type { ApiResponse } from '~/types/api'
import type { LoginRequest, MfaLoginResponse, TokenResponse, UserProfileResponse } from '~/types/auth'

/**
 * BFF login: proxies credentials to the backend, then either:
 * - Creates a BFF session (if login succeeds with tokens) and returns the user
 *   profile (no tokens exposed to the browser).
 * - Returns the MFA challenge (if MFA is required) — no session created yet.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<LoginRequest>(event)
  const config = useRuntimeConfig()

  const response = await $fetch<ApiResponse<TokenResponse | MfaLoginResponse>>('/api/auth/login', {
    baseURL: config.backendUrl,
    method: 'POST',
    body,
  })

  if (!response.success || !response.data) {
    return response
  }

  // MFA challenge — pass through to the browser, no session yet.
  const data = response.data
  if ('mfaRequired' in data) {
    return response
  }

  // Login succeeded — fetch the user profile, then create the BFF session.
  const profile = await $fetch<ApiResponse<UserProfileResponse>>('/api/auth/me', {
    baseURL: config.backendUrl,
    method: 'GET',
    headers: { Authorization: `Bearer ${data.accessToken}` },
  })

  if (!profile.success || !profile.data) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to load user profile after login' })
  }

  await createBffSession(event, {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: profile.data,
  })

  // Return only what the browser needs — no tokens.
  return {
    success: true,
    message: response.message,
    data: profile.data,
  }
})
