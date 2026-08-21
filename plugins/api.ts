import type { ApiResponse } from '~/types/api'

interface RefreshQueueItem {
  resolve: (token: string) => void
  reject: (error: Error) => void
}

let accessToken: string | null = null
let refreshPromise: Promise<string> | null = null
const refreshQueue: RefreshQueueItem[] = []

function setAccessToken(token: string | null) {
  accessToken = token
}

function getAccessToken(): string | null {
  return accessToken
}

async function performRefresh(config: ReturnType<typeof useRuntimeConfig>): Promise<string> {
  const response = await $fetch<ApiResponse<{ accessToken: string }>>('/api/auth/refresh', {
    baseURL: config.public.apiBase,
    method: 'POST',
    credentials: 'include',
  })

  if (!response.success || !response.data) {
    throw new Error(response.message || 'Refresh failed')
  }

  return response.data.accessToken
}

async function handleRefresh(config: ReturnType<typeof useRuntimeConfig>): Promise<string> {
  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = (async () => {
    try {
      const newToken = await performRefresh(config)
      setAccessToken(newToken)
      refreshQueue.forEach(item => item.resolve(newToken))
      return newToken
    }
    catch (error) {
      setAccessToken(null)
      refreshQueue.forEach(item => item.reject(error as Error))
      throw error
    }
    finally {
      refreshPromise = null
      refreshQueue.length = 0
    }
  })()

  return refreshPromise
}

function createApi(config: ReturnType<typeof useRuntimeConfig>) {
  return $fetch.create<unknown>({
    baseURL: config.public.apiBase,
    credentials: 'include',

    async onRequest({ options }) {
      const token = getAccessToken()
      if (token) {
        const headers = new Headers(options.headers as HeadersInit)
        headers.set('Authorization', `Bearer ${token}`)
        options.headers = headers
      }
    },

    async onResponse({ response }) {
      return response._data
    },

    async onResponseError({ response, request, options }) {
      if (response.status === 401 && !String(request).includes('/auth/refresh')) {
        try {
          const newToken = await handleRefresh(config)
          const headers = new Headers(options?.headers as HeadersInit)
          headers.set('Authorization', `Bearer ${newToken}`)

          return $fetch(request as string, {
            headers,
            baseURL: config.public.apiBase,
            credentials: 'include',
          })
        }
        catch {
          setAccessToken(null)
          if (import.meta.client) {
            navigateTo('/login')
          }
          throw new Error('Session expired')
        }
      }

      const errorData = response._data as ApiResponse<unknown> | undefined
      throw new Error(errorData?.message || `Request failed with status ${response.status}`)
    },
  })
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = createApi(config)

  return {
    provide: {
      api,
      setAccessToken,
      getAccessToken,
    },
  }
})
