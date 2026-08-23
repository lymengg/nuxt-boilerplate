import type { ApiResponse } from '~/types/api'
import type { LoginRequest, MfaLoginResponse, TokenResponse, UserProfileResponse } from '~/types/auth'

/**
 * BFF login: proxies credentials to the backend, then either:
 * - Creates a BFF session (if login succeeds with tokens) and returns the user
 *   profile (no tokens exposed to the browser).
 * - Returns the MFA challenge (if MFA is required) — no session created yet.
 *
 * Session rotation: a new session ID is generated after successful login
 * to prevent session fixation attacks.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<LoginRequest>(event)
  const config = useRuntimeConfig()

  setNoCacheHeaders(event)

  let response: ApiResponse<TokenResponse | MfaLoginResponse>
  try {
    response = await $fetch<ApiResponse<TokenResponse | MfaLoginResponse>>('/api/auth/login', {
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
      event: 'LOGIN_FAILURE',
      username: body.usernameOrEmail ? '***' : undefined,
    }))
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

  // Use rotateSession instead of createBffSession to prevent session fixation
  await rotateSession(event, {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: profile.data,
    createdAt: Date.now(),
    lastActivityAt: Date.now(),
  })

  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    event: 'LOGIN_SUCCESS',
  }))

  // Return only what the browser needs — no tokens.
  return {
    success: true,
    message: response.message,
    data: profile.data,
  }
})
