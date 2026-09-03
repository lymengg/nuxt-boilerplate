import { computed, ref } from 'vue'
import type { AuthUser, MfaLoginResponse, UserProfileResponse } from '~/types/auth'
import { authService } from '~/services/auth.service'
import { derivePermissions } from '~/utils/permissions'

/**
 * Auth session store — the single source of truth for authentication state.
 *
 * Security model (RFC 9700 Tier 1):
 * - The browser NEVER sees access or refresh tokens. The Spring backend owns
 *   them entirely via httpOnly cookies; the Nuxt server is a transparent
 *   proxy that never touches tokens.
 * - This store only tracks the user profile (returned by the backend without
 *   tokens) and the MFA challenge state (in-memory, single use).
 * - The backend `/api/auth/me` profile exposes roles but not permissions, so
 *   the permission set is derived client-side from roles (see
 *   `utils/permissions.ts`). The server remains the enforcement point.
 */
export const useAuthStore = defineStore('auth', () => {
  // ---- state ----
  const user = ref<AuthUser | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  /** Active MFA challenge from login (in-memory only, single use). */
  const pendingMfa = ref<Pick<MfaLoginResponse, 'mfaSessionToken' | 'method' | 'expiresIn'> | null>(null)

  // ---- internal setters (not exposed) ----
  function setUser(value: AuthUser | null) {
    user.value = value
  }

  /** Builds an AuthUser from the profile returned by the BFF. */
  function setProfile(profile: UserProfileResponse): void {
    setUser({
      ...profile,
      permissions: derivePermissions(profile.roles),
    })
  }

  // ---- actions ----
  /**
   * BFF login: the BFF handles token storage. Returns `{ requiresMfa: true }`
   * if the backend issued an MFA challenge, or sets the user profile if login
   * succeeded.
   */
  async function login(usernameOrEmail: string, password: string): Promise<{ requiresMfa: boolean }> {
    const response = await authService.login({ usernameOrEmail, password })
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Login failed')
    }

    const data = response.data
    if ('mfaRequired' in data) {
      pendingMfa.value = {
        mfaSessionToken: data.mfaSessionToken,
        method: data.method,
        expiresIn: data.expiresIn,
      }
      return { requiresMfa: true }
    }

    // BFF returned the user profile directly (no tokens exposed).
    setProfile(data)
    return { requiresMfa: false }
  }

  /** Completes the pending MFA challenge with the 6-digit code. */
  async function verifyMfa(code: string): Promise<void> {
    if (!pendingMfa.value) {
      throw new Error('MFA session expired. Please sign in again.')
    }

    const response = await authService.verifyMfa({
      mfaSessionToken: pendingMfa.value.mfaSessionToken,
      code,
    })
    if (!response.success || !response.data) {
      throw new Error(response.message || 'MFA verification failed')
    }

    pendingMfa.value = null
    setProfile(response.data)
  }

  function cancelMfa() {
    pendingMfa.value = null
  }

  /**
   * Clears all auth state without calling the backend. Used when the session
   * expires and the refresh attempt fails (see plugins/api.ts).
   */
  function reset() {
    setUser(null)
    pendingMfa.value = null
  }

  /** Logs out via the backend (revokes tokens + clears httpOnly cookies). */
  async function logout() {
    try {
      await authService.logout()
    }
    catch {
      // Backend logout may fail if the session is already gone — clear local state.
    }
    finally {
      reset()
      await navigateTo('/login')
    }
  }

  /**
   * Restores the session on page load by calling the BFF `/api/auth/me`.
   * The BFF checks the session cookie and returns the cached user profile
   * (no tokens, no backend round-trip). If the session doesn't exist, the
   * response is a 401 and the store stays empty.
   */
  async function restoreSession(): Promise<void> {
    try {
      const response = await authService.getCurrentUser()
      if (response.success && response.data) {
        setProfile(response.data)
      }
    }
    catch {
      // 401 — no active session. Leave the store empty; route middleware
      // redirects to /login.
    }
  }

  /**
   * Changes the password via the BFF. The BFF destroys the session after a
   * successful change (the backend revokes all tokens), so the user must
   * sign in again.
   */
  async function changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Promise<void> {
    const response = await authService.changePassword({ currentPassword, newPassword, confirmPassword })
    if (!response.success) {
      throw new Error(response.message || 'Failed to change password')
    }
    setUser(null)
  }

  return {
    // state
    user,
    pendingMfa,
    isAuthenticated,
    // actions
    login,
    verifyMfa,
    cancelMfa,
    logout,
    reset,
    restoreSession,
    changePassword,
  }
})
