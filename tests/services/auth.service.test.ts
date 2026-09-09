import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { UserProfileResponse, MfaLoginResponse } from '~/types/auth'
import { authService } from '~/services/auth.service'

const profile: UserProfileResponse = {
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  roles: ['EMPLOYEE'],
  permissions: ['EXPENSE_READ', 'EXPENSE_CREATE'],
  enabled: true,
  mfaEnabled: false,
  mfaMethod: 'NONE',
}

const mfaChallenge: MfaLoginResponse = {
  mfaRequired: true,
  mfaSessionToken: 'mfa-token',
  method: 'TOTP',
  expiresIn: 300,
}

const { mockApi } = vi.hoisted(() => ({
  mockApi: vi.fn(),
}))

vi.mock('~/composables/useApi', () => ({
  useApi: () => mockApi,
}))

describe('authService', () => {
  beforeEach(() => {
    mockApi.mockReset()
    vi.clearAllMocks()
  })

  it('login sends POST /api/auth/login with credentials', async () => {
    mockApi.mockResolvedValue({ success: true, message: 'ok', data: profile, timestamp: '' })

    const result = await authService.login({ email: 'john@example.com', password: 'Password123!' })

    expect(mockApi).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      body: { email: 'john@example.com', password: 'Password123!' },
    })
    expect(result.data).toEqual(profile)
  })

  it('login passes rememberMe through', async () => {
    mockApi.mockResolvedValue({ success: true, message: 'ok', data: mfaChallenge, timestamp: '' })

    await authService.login({ email: 'john@example.com', password: 'Password123!', rememberMe: true })

    expect(mockApi).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      body: { email: 'john@example.com', password: 'Password123!', rememberMe: true },
    })
  })

  it('verifyMfa sends POST /api/auth/mfa/verify with the session and code', async () => {
    mockApi.mockResolvedValue({ success: true, message: 'ok', data: profile, timestamp: '' })

    await authService.verifyMfa({ mfaSessionToken: 'mfa-token', code: '123456' })

    expect(mockApi).toHaveBeenCalledWith('/api/auth/mfa/verify', {
      method: 'POST',
      body: { mfaSessionToken: 'mfa-token', code: '123456' },
    })
  })

  it('logout sends POST /api/auth/logout', async () => {
    mockApi.mockResolvedValue({ success: true, message: 'ok', data: null, timestamp: '' })

    await authService.logout()

    expect(mockApi).toHaveBeenCalledWith('/api/auth/logout', { method: 'POST' })
  })

  it('getCurrentUser sends GET /api/auth/me', async () => {
    mockApi.mockResolvedValue({ success: true, message: 'ok', data: profile, timestamp: '' })

    const result = await authService.getCurrentUser()

    // The auth service's wrapper always passes an options object (default {}).
    expect(mockApi).toHaveBeenCalledWith('/api/auth/me', {})
    expect(result.data).toEqual(profile)
  })

  it('changePassword sends POST /api/auth/change-password with the request body', async () => {
    mockApi.mockResolvedValue({ success: true, message: 'ok', data: null, timestamp: '' })

    await authService.changePassword({
      currentPassword: 'OldPassword1!',
      newPassword: 'NewPassword123!',
      confirmPassword: 'NewPassword123!',
    })

    expect(mockApi).toHaveBeenCalledWith('/api/auth/change-password', {
      method: 'POST',
      body: {
        currentPassword: 'OldPassword1!',
        newPassword: 'NewPassword123!',
        confirmPassword: 'NewPassword123!',
      },
    })
  })

  it('forgotPassword sends POST /api/auth/forgot-password with the email', async () => {
    mockApi.mockResolvedValue({ success: true, message: 'ok', data: null, timestamp: '' })

    await authService.forgotPassword({ email: 'john@example.com' })

    expect(mockApi).toHaveBeenCalledWith('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: 'john@example.com' },
    })
  })

  it('resetPassword sends POST /api/auth/reset-password with the token and new password', async () => {
    mockApi.mockResolvedValue({ success: true, message: 'ok', data: null, timestamp: '' })

    await authService.resetPassword({
      token: 'reset-token',
      newPassword: 'NewPassword123!',
      confirmPassword: 'NewPassword123!',
    })

    expect(mockApi).toHaveBeenCalledWith('/api/auth/reset-password', {
      method: 'POST',
      body: {
        token: 'reset-token',
        newPassword: 'NewPassword123!',
        confirmPassword: 'NewPassword123!',
      },
    })
  })

  it('propagates errors from the API client', async () => {
    const error = new Error('network')
    mockApi.mockRejectedValue(error)

    await expect(authService.getCurrentUser()).rejects.toThrow('network')
  })
})
