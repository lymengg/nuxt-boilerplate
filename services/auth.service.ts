import type { ApiResponse } from '~/types/api'
import type { AuthUser, LoginRequest, LoginResponse, MfaVerifyRequest, MfaVerifyResponse } from '~/types/auth'

export const authService = {
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<LoginResponse>>('/api/auth/login', {
      method: 'POST',
      body: data,
    })
  },

  async verifyMfa(data: MfaVerifyRequest): Promise<ApiResponse<MfaVerifyResponse>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<MfaVerifyResponse>>('/api/auth/mfa/verify', {
      method: 'POST',
      body: data,
    })
  },

  async logout(): Promise<void> {
    const { $api } = useNuxtApp()
    try {
      await $api('/api/auth/logout', { method: 'POST' })
    }
    catch {
      // Logout should always proceed even if API call fails
    }
  },

  async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<AuthUser>>('/api/auth/me')
  },

  async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<{ accessToken: string }>>('/api/auth/refresh', {
      method: 'POST',
    })
  },
}
