import { apiFetch } from '~/utils/api'
import type { AuthUser } from '~/types'

interface AuthState {
  accessToken: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  isMfaPending: boolean
  isLoading: boolean
}

const authState = reactive<AuthState>({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isMfaPending: false,
  isLoading: false,
})

export function useAuth() {
  const router = useRouter()

  async function login(email: string, password: string) {
    authState.isLoading = true
    try {
      const response = await apiFetch<{ requiresMfa: boolean; user: AuthUser; accessToken: string }>(
        '/api/auth/login',
        {
          method: 'POST',
          body: { email, password },
        }
      )

      if (response.success && response.data) {
        if (response.data.requiresMfa) {
          authState.isMfaPending = true
          return { requiresMfa: true }
        }

        authState.accessToken = response.data.accessToken
        authState.user = response.data.user
        authState.isAuthenticated = true
        return { success: true }
      }

      return { error: response.message || 'Login failed' }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } }
      return { error: err.data?.message || 'Login failed' }
    } finally {
      authState.isLoading = false
    }
  }

  async function verifyMfa(code: string) {
    authState.isLoading = true
    try {
      const response = await apiFetch<{ user: AuthUser; accessToken: string }>(
        '/api/auth/mfa/verify',
        {
          method: 'POST',
          body: { code },
        }
      )

      if (response.success && response.data) {
        authState.accessToken = response.data.accessToken
        authState.user = response.data.user
        authState.isAuthenticated = true
        authState.isMfaPending = false
        return { success: true }
      }

      return { error: response.message || 'MFA verification failed' }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } }
      return { error: err.data?.message || 'MFA verification failed' }
    } finally {
      authState.isLoading = false
    }
  }

  async function logout() {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' })
    } finally {
      authState.accessToken = null
      authState.user = null
      authState.isAuthenticated = false
      authState.isMfaPending = false
      router.push('/login')
    }
  }

  function initializeAuth(user: AuthUser, accessToken: string) {
    authState.user = user
    authState.accessToken = accessToken
    authState.isAuthenticated = true
  }

  return {
    ...toRefs(authState),
    login,
    verifyMfa,
    logout,
    initializeAuth,
  }
}
