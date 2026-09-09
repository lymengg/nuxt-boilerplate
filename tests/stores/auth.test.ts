import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { ApiResponse } from '~/types/api'
import type { UserProfileResponse, MfaLoginResponse } from '~/types/auth'
import { useAuthStore } from '~/stores/auth'

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
  mfaSessionToken: 'mfa-session-token',
  method: 'TOTP',
  expiresIn: 300,
}

const ok = (data: unknown): ApiResponse<unknown> => ({
  success: true,
  message: 'Success',
  data,
  timestamp: '2024-01-01T00:00:00Z',
})

const fail = (message: string): ApiResponse<unknown> => ({
  success: false,
  message,
  data: null,
  timestamp: '2024-01-01T00:00:00Z',
})

const { authService } = vi.hoisted(() => ({
  authService: {
    login: vi.fn(),
    verifyMfa: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
    changePassword: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
  },
}))

vi.mock('~/services/auth.service', () => ({ authService }))

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('sets the user profile with backend-provided permissions on success', async () => {
      authService.login.mockResolvedValue(ok(profile))
      const store = useAuthStore()

      const result = await store.login('john@example.com', 'Password123!')

      expect(result).toEqual({ requiresMfa: false })
      expect(authService.login).toHaveBeenCalledWith({ email: 'john@example.com', password: 'Password123!' })
      expect(store.isAuthenticated).toBe(true)
      expect(store.user?.email).toBe('john@example.com')
      expect(store.user?.permissions).toContain('EXPENSE_READ')
      expect(store.user?.permissions).toContain('EXPENSE_CREATE')
      expect(store.user?.permissions).not.toContain('EXPENSE_APPROVE')
      expect(store.pendingMfa).toBeNull()
    })

    it('stores the MFA challenge and does not authenticate when MFA is required', async () => {
      authService.login.mockResolvedValue(ok(mfaChallenge))
      const store = useAuthStore()

      const result = await store.login('john@example.com', 'Password123!')

      expect(result).toEqual({ requiresMfa: true })
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(store.pendingMfa).toEqual({
        mfaSessionToken: 'mfa-session-token',
        method: 'TOTP',
        expiresIn: 300,
      })
    })

    it('throws when the backend reports a failed login', async () => {
      authService.login.mockResolvedValue(fail('Invalid credentials'))
      const store = useAuthStore()

      await expect(store.login('john@example.com', 'wrong')).rejects.toThrow('Invalid credentials')
      expect(store.user).toBeNull()
    })
  })

  describe('verifyMfa', () => {
    it('throws when there is no pending MFA session', async () => {
      const store = useAuthStore()

      await expect(store.verifyMfa('123456')).rejects.toThrow('MFA session expired. Please sign in again.')
    })

    it('completes the challenge and authenticates the user', async () => {
      authService.login.mockResolvedValue(ok(mfaChallenge))
      authService.verifyMfa.mockResolvedValue(ok(profile))
      const store = useAuthStore()
      await store.login('john@example.com', 'Password123!')

      await store.verifyMfa('123456')

      expect(authService.verifyMfa).toHaveBeenCalledWith({
        mfaSessionToken: 'mfa-session-token',
        code: '123456',
      })
      expect(store.pendingMfa).toBeNull()
      expect(store.user?.email).toBe('john@example.com')
      expect(store.isAuthenticated).toBe(true)
    })

    it('throws and keeps the challenge when verification fails', async () => {
      authService.login.mockResolvedValue(ok(mfaChallenge))
      authService.verifyMfa.mockResolvedValue(fail('Invalid code'))
      const store = useAuthStore()
      await store.login('john@example.com', 'Password123!')

      await expect(store.verifyMfa('000000')).rejects.toThrow('Invalid code')
      expect(store.pendingMfa).not.toBeNull()
      expect(store.user).toBeNull()
    })
  })

  describe('cancelMfa', () => {
    it('clears the pending MFA challenge', async () => {
      authService.login.mockResolvedValue(ok(mfaChallenge))
      const store = useAuthStore()
      await store.login('john@example.com', 'Password123!')
      expect(store.pendingMfa).not.toBeNull()

      store.cancelMfa()

      expect(store.pendingMfa).toBeNull()
    })
  })

  describe('reset', () => {
    it('clears user and MFA state without calling the backend', async () => {
      authService.login.mockResolvedValue(ok(profile))
      const store = useAuthStore()
      await store.login('john@example.com', 'Password123!')

      store.reset()

      expect(store.user).toBeNull()
      expect(store.pendingMfa).toBeNull()
      expect(authService.logout).not.toHaveBeenCalled()
    })
  })

  describe('logout', () => {
    it('calls the backend, clears state and redirects to login', async () => {
      authService.login.mockResolvedValue(ok(profile))
      authService.logout.mockResolvedValue(ok(null))
      const store = useAuthStore()
      await store.login('john@example.com', 'Password123!')

      await expect(store.logout()).resolves.toBeUndefined()

      expect(authService.logout).toHaveBeenCalledOnce()
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })

    it('still clears local state when the backend logout fails', async () => {
      authService.login.mockResolvedValue(ok(profile))
      authService.logout.mockRejectedValue(new Error('network down'))
      const store = useAuthStore()
      await store.login('john@example.com', 'Password123!')

      await expect(store.logout()).resolves.toBeUndefined()

      expect(store.user).toBeNull()
    })
  })

  describe('restoreSession', () => {
    it('restores the user profile from /api/auth/me', async () => {
      authService.getCurrentUser.mockResolvedValue(ok(profile))
      const store = useAuthStore()

      await store.restoreSession()

      expect(store.user?.email).toBe('john@example.com')
      expect(store.isAuthenticated).toBe(true)
    })

    it('leaves the store empty when there is no active session (401)', async () => {
      authService.getCurrentUser.mockRejectedValue(new Error('401'))
      const store = useAuthStore()

      await expect(store.restoreSession()).resolves.toBeUndefined()

      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('changePassword', () => {
    it('clears the session after a successful password change', async () => {
      authService.login.mockResolvedValue(ok(profile))
      authService.changePassword.mockResolvedValue(ok(null))
      const store = useAuthStore()
      await store.login('john@example.com', 'Password123!')

      await store.changePassword('OldPassword1!', 'NewPassword123!', 'NewPassword123!')

      expect(authService.changePassword).toHaveBeenCalledWith({
        currentPassword: 'OldPassword1!',
        newPassword: 'NewPassword123!',
        confirmPassword: 'NewPassword123!',
      })
      expect(store.user).toBeNull()
    })

    it('throws and keeps the session when the change fails', async () => {
      authService.login.mockResolvedValue(ok(profile))
      authService.changePassword.mockResolvedValue(fail('Current password is incorrect'))
      const store = useAuthStore()
      await store.login('john@example.com', 'Password123!')

      await expect(store.changePassword('wrong', 'NewPassword123!', 'NewPassword123!')).rejects.toThrow('Current password is incorrect')
      expect(store.user).not.toBeNull()
    })
  })
})
