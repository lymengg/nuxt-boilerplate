import type { ApiResponse, RefreshTokenResponse } from '~/types'

interface FetchOptions {
  method?: string
  body?: unknown
  query?: Record<string, unknown>
  headers?: Record<string, string>
}

let isRefreshing = false
let refreshPromise: Promise<string> | null = null
let pendingRequests: Array<{
  resolve: (token: string) => void
  reject: (error: Error) => void
}> = []

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedAuth: any = null

function getAuth(): { accessToken: string | null } | null {
  if (import.meta.server) return null
  if (cachedAuth) return cachedAuth
  try {
    const nuxtApp = useNuxtApp()
    cachedAuth = (nuxtApp as Record<string, unknown>).$auth
    return cachedAuth as { accessToken: string | null } | null
  } catch {
    return null
  }
}

function getAccessToken(): string | null {
  const auth = getAuth()
  return auth?.accessToken ?? null
}

function setAccessToken(token: string | null): void {
  if (import.meta.server) return
  const auth = getAuth()
  if (auth) {
    auth.accessToken = token
  }
}

function clearAuth(): void {
  setAccessToken(null)
  if (import.meta.client) {
    navigateTo('/login')
  }
}

async function refreshAccessToken(): Promise<string> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true
  refreshPromise = (async () => {
    try {
      const config = useRuntimeConfig()
      const response = await $fetch<ApiResponse<RefreshTokenResponse>>(
        `${config.public.apiBase}/api/auth/refresh`,
        {
          method: 'POST',
          credentials: 'include',
        }
      )

      if (!response.success || !response.data) {
        throw new Error('Refresh failed')
      }

      setAccessToken(response.data.accessToken)
      return response.data.accessToken
    } catch (error) {
      clearAuth()
      throw error
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}

async function processPendingRequests(token: string): Promise<void> {
  const requests = [...pendingRequests]
  pendingRequests = []
  for (const req of requests) {
    req.resolve(token)
  }
}

async function rejectPendingRequests(error: Error): Promise<void> {
  const requests = [...pendingRequests]
  pendingRequests = []
  for (const req of requests) {
    req.reject(error)
  }
}

let cachedApiBase: string | null = null

function getApiBase(): string {
  if (cachedApiBase) return cachedApiBase
  try {
    const config = useRuntimeConfig()
    cachedApiBase = config.public.apiBase as string
    return cachedApiBase
  } catch {
    return 'http://localhost:8080'
  }
}

export async function apiFetch<T>(url: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
  const apiBase = getApiBase()
  const accessToken = getAccessToken()
  const headers: Record<string, string> = {
    ...options.headers,
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  try {
    const response = await $fetch<ApiResponse<T>>(url, {
      baseURL: apiBase,
      method: (options.method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH') || 'GET',
      body: options.body as Record<string, unknown> | undefined,
      query: options.query,
      headers,
      credentials: 'include',
    })

    return response
  } catch (error: unknown) {
    const fetchError = error as { statusCode?: number; response?: { status?: number } }
    const statusCode = fetchError.statusCode || fetchError.response?.status

    if (statusCode === 401 && !url.includes('/auth/')) {
      if (isRefreshing) {
        return new Promise<ApiResponse<T>>((resolve, reject) => {
          pendingRequests.push({
            resolve: async (token: string) => {
              try {
                const retryResponse = await $fetch<ApiResponse<T>>(url, {
                  baseURL: apiBase,
                  method: (options.method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH') || 'GET',
                  body: options.body as Record<string, unknown> | undefined,
                  query: options.query,
                  headers: {
                    ...options.headers,
                    Authorization: `Bearer ${token}`,
                  },
                  credentials: 'include',
                })
                resolve(retryResponse)
              } catch (retryError) {
                reject(retryError as Error)
              }
            },
            reject,
          })
        })
      }

      try {
        const newToken = await refreshAccessToken()
        await processPendingRequests(newToken)

        const retryResponse = await $fetch<ApiResponse<T>>(url, {
          baseURL: apiBase,
          method: (options.method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH') || 'GET',
          body: options.body as Record<string, unknown> | undefined,
          query: options.query,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
          },
          credentials: 'include',
        })

        return retryResponse
      } catch (refreshError) {
        await rejectPendingRequests(refreshError as Error)
        throw refreshError
      }
    }

    throw error
  }
}

export function useApi() {
  return { api: apiFetch }
}
