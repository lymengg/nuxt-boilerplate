import type { ApiResponse } from '~/types/api'
import type { FetchError, FetchOptions } from 'ofetch'

/**
 * Endpoints that must never trigger the session-refresh loop.
 */
export const AUTH_PATHS = [
  '/api/auth/login',
  '/api/auth/refresh',
  '/api/auth/logout',
  '/api/auth/mfa/verify',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
]

export type HttpClient = <T = unknown>(request: string, options?: FetchOptions<'json'>) => Promise<T>
export type ApiClient = HttpClient

/** Custom flag marking a request as already retried after a refresh (loop guard). */
type RetryableOptions = FetchOptions<'json'> & { __authRetried?: boolean }

/**
 * Wraps the raw HTTP client (an ofetch instance) with session-refresh logic:
 *
 * - A 401 on a non-auth path triggers ONE `POST /api/auth/refresh`, then a
 *   one-time retry of the original request.
 * - Concurrent 401s share a single-flight refresh so the backend's refresh-
 *   token rotation is never raced by this client.
 * - If the refresh fails, local auth state is cleared and the user is sent
 *   to /login; the original error is rethrown either way.
 *
 * Extracted from the $api plugin so the flow is unit-testable with a fake
 * http client. The plugin is responsible for building the real ofetch client.
 */
export interface ApiClientOptions {
  /**
   * Called when a 401 could not be recovered by refreshing (the session is
   * gone). Defaults to clearing auth state and navigating to /login.
   * Injectable so tests can observe the flow without a router.
   */
  onSessionExpired?: () => void | Promise<void>
}

export function createApiClient(http: HttpClient, options: ApiClientOptions = {}): ApiClient {
  let refreshPromise: Promise<boolean> | null = null

  function refreshSession(): Promise<boolean> {
    if (!refreshPromise) {
      refreshPromise = http<ApiResponse<unknown>>('/api/auth/refresh', { method: 'POST' })
        .then(() => true)
        .catch(() => false)
        .finally(() => {
          refreshPromise = null
        })
    }
    return refreshPromise
  }

  async function handleSessionExpired() {
    if (options.onSessionExpired) {
      await options.onSessionExpired()
      return
    }
    const auth = useAuthStore()
    auth.reset()
    await navigateTo('/login')
  }

  return async function api<T>(request: string, options: RetryableOptions = {}) {
    try {
      return await http<T>(request, options)
    }
    catch (error) {
      const status = (error as FetchError)?.response?.status
      const url = typeof request === 'string' ? request : String(request)

      if (status === 401 && !options.__authRetried && !AUTH_PATHS.some(p => url.includes(p))) {
        const refreshed = await refreshSession()
        if (refreshed) {
          return http<T>(request, { ...options, __authRetried: true } as RetryableOptions)
        }

        // Refresh failed — the session is gone. Clear local state and go to login.
        await handleSessionExpired()
      }

      throw error
    }
  }
}
