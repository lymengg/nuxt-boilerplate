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
import type { FetchOptions } from 'ofetch'

/**
 * Auth service — calls backend auth endpoints (`/api/auth/*` on the API
 * origin, e.g. https://api.xxx.com).
 *
 * The backend owns all token management via httpOnly cookies. These methods
 * never receive or return access/refresh tokens — the backend returns only
 * the user profile (on login/MFA verify) or the MFA challenge (if MFA is
 * required).
 *
 * Uses the shared `$api` client (see plugins/api.ts), which applies the API
 * base URL and `credentials: 'include'` so the auth cookies are sent.
 */
function api<T>(path: string, options: FetchOptions<'json'> = {}) {
  const { $api } = useNuxtApp()
  return $api<T>(path, options)
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
