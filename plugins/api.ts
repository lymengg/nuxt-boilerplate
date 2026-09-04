import type { FetchError, FetchOptions } from 'ofetch'
import type { ApiResponse } from '~/types/api'

/**
 * HTTP client for the app — a thin wrapper around `$fetch` that calls the
 * Spring backend directly at the configured API base (e.g. https://api.xxx.com).
 * The SPA is static; there is no proxy in the request path.
 *
 * No token handling: the backend owns auth entirely via httpOnly cookies
 * (set/rotated/cleared by Spring) — `credentials: 'include'` sends them on
 * these cross-origin calls. The only client-side logic is session refresh on
 * 401: a single-flight `POST /api/auth/refresh` shared across concurrent
 * requests (so the backend's refresh-token rotation is never raced by this
 * client), then a one-time retry of the original request.
 *
 * Errors keep the backend `ApiResponse` body available via `error.data`;
 * `useApiError` extracts the human-readable message and field errors.
 */

/** Endpoints that must never trigger the session-refresh loop. */
const AUTH_PATHS = [
  '/api/auth/login',
  '/api/auth/refresh',
  '/api/auth/logout',
  '/api/auth/mfa/verify',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
]

type ApiClient = <T = unknown>(request: string, options?: FetchOptions<'json'>) => Promise<T>

/** Custom flag marking a request as already retried after a refresh (loop guard). */
type RetryableOptions = FetchOptions<'json'> & { __authRetried?: boolean }

function createApi(): ApiClient {
  const { apiBase } = useRuntimeConfig().public

  const http = $fetch.create({
    baseURL: apiBase,
    // Cross-origin calls (SPA origin → API origin) must send the auth cookies.
    credentials: 'include',
    // No `onResponseError` hook: ofetch 1.5.x creates the `FetchError` only
    // AFTER response hooks run, so `context.error` is undefined here and any
    // access to `error.data` throws, replacing the real error. The backend
    // `ApiResponse` body stays available on the thrown error's `data` and is
    // read by `useApiError`.
  }) as unknown as ApiClient

  // Single-flight session refresh: concurrent 401s share one /refresh call.
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
        const auth = useAuthStore()
        auth.reset()
        await navigateTo('/login')
      }

      throw error
    }
  }
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      api: createApi(),
    },
  }
})

declare module '#app' {
  interface NuxtApp {
    $api: ApiClient
  }
}
