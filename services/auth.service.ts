import { apiFetch } from '~/utils/api'
import type { ApiResponse, LoginRequest, LoginResponse, MfaVerifyResponse } from '~/types'

export const authService = {
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return apiFetch<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: data,
    })
  },

  async verifyMfa(code: string): Promise<ApiResponse<MfaVerifyResponse>> {
    return apiFetch<MfaVerifyResponse>('/api/auth/mfa/verify', {
      method: 'POST',
      body: { code },
    })
  },

  async logout(): Promise<void> {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' })
    } finally {
      if (import.meta.client) {
        navigateTo('/login')
      }
    }
  },

  async getCurrentUser() {
    return apiFetch('/api/auth/me')
  },
}
