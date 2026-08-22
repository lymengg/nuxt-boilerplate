import type { AuthUser } from '~/types/auth'
import type { ApiResponse } from '~/types/api'

const user = ref<AuthUser | null>(null)
const isInitialized = ref(false)
const isAuthenticated = computed(() => !!user.value)

export function useAuth() {
  const nuxtApp = useNuxtApp()
  const $api = nuxtApp.$api as typeof $fetch
  const setAccessToken = nuxtApp.$setAccessToken as (token: string | null) => void

  async function initialize() {
    if (isInitialized.value) return
    if (import.meta.server) return

    try {
      const response = await $fetch<ApiResponse<AuthUser>>(`${useRuntimeConfig().public.apiBase}/api/auth/me`, {
        credentials: 'include',
      })
      if (response.success && response.data) {
        user.value = response.data
      }
    }
    catch {
      user.value = null
    }
    finally {
      isInitialized.value = true
    }
  }

  async function login(email: string, password: string) {
    const response = await $fetch<ApiResponse<{ accessToken: string, requiresMfa: boolean, user: AuthUser }>>(`${useRuntimeConfig().public.apiBase}/api/auth/login`, {
      method: 'POST',
      body: { email, password },
      credentials: 'include',
    })

    if (response.success && response.data) {
      if (response.data.requiresMfa) {
        return { requiresMfa: true }
      }
      setAccessToken(response.data.accessToken)
      user.value = response.data.user
      return { requiresMfa: false }
    }

    throw new Error(response.message || 'Login failed')
  }

  async function verifyMfa(token: string) {
    const response = await $fetch<ApiResponse<{ accessToken: string, user: AuthUser }>>(`${useRuntimeConfig().public.apiBase}/api/auth/mfa/verify`, {
      method: 'POST',
      body: { token },
      credentials: 'include',
    })

    if (response.success && response.data) {
      setAccessToken(response.data.accessToken)
      user.value = response.data.user
      return true
    }

    throw new Error(response.message || 'MFA verification failed')
  }

  async function logout() {
    try {
      await $fetch(`${useRuntimeConfig().public.apiBase}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    }
    catch {
      // Logout should always proceed
    }
    finally {
      setAccessToken(null)
      user.value = null
      navigateTo('/login')
    }
  }

  return {
    user,
    isAuthenticated,
    isInitialized,
    initialize,
    login,
    verifyMfa,
    logout,
  }
}
