import type { ApiResponse } from '~/types/api'
import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  MfaLoginResponse,
  MfaVerifyRequest,
  ResetPasswordRequest,
  UserProfileResponse,
} from '~/types/auth'
import type { $Fetch, FetchOptions } from 'ofetch'

/**
 * Auth service — calls BFF endpoints (same-origin `/api/auth/*`).
 *
 * The BFF handles all token management server-side. These methods never
 * receive or return access/refresh tokens — the BFF returns only the user
 * profile (on login/MFA verify) or the MFA challenge (if MFA is required).
 *
 * No `baseURL` is needed — all calls are same-origin to the Nuxt server.
 * No `credentials: 'include'` is needed — same-origin requests include
 * cookies by default.
 */
const http = $fetch.create({}) as unknown as $Fetch

function api<T>(path: string, options: FetchOptions<'json'> = {}) {
  return http<T>(path, options)
}

export const authService = {
  login(data: LoginRequest): Promise<ApiResponse<UserProfileResponse | MfaLoginResponse>> {
    return api('/api/auth/login', { method: 'POST', body: data })
  },

  verifyMfa(data: MfaVerifyRequest): Promise<ApiResponse<UserProfileResponse>> {
    return api('/api/auth/mfa/verify', { method: 'POST', body: data })
  },

  logout(): Promise<ApiResponse<void>> {
    return api('/api/auth/logout', { method: 'POST' })
  },

  getCurrentUser(): Promise<ApiResponse<UserProfileResponse>> {
    return api('/api/auth/me')
  },

  changePassword(data: ChangePasswordRequest): Promise<ApiResponse<void>> {
    return api('/api/auth/change-password', { method: 'POST', body: data })
  },

  forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<void>> {
    return api('/api/auth/forgot-password', { method: 'POST', body: data })
  },

  resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<void>> {
    return api('/api/auth/reset-password', { method: 'POST', body: data })
  },
}
