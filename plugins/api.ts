import type { ApiResponse } from '~/types/api'
import type { AuthUser } from '~/types/auth'

interface RefreshQueueItem {
  resolve: (data: { accessToken: string, user: AuthUser }) => void
  reject: (error: Error) => void
}

let accessToken: string | null = null
let user: AuthUser | null = null
let refreshPromise: Promise<{ accessToken: string, user: AuthUser }> | null = null
const refreshQueue: RefreshQueueItem[] = []

function setAccessToken(token: string | null) {
  accessToken = token
}

function getAccessToken(): string | null {
  return accessToken
}

function setUser(value: AuthUser | null) {
  user = value
}

function getUser(): AuthUser | null {
  return user
}

async function performRefresh(config: ReturnType<typeof useRuntimeConfig>): Promise<{ accessToken: string, user: AuthUser }> {
  const response = await $fetch<ApiResponse<{ accessToken: string, user: AuthUser }>>('/api/auth/refresh', {
    baseURL: config.public.apiBase,
    method: 'POST',
    credentials: 'include',
  })

  if (!response.success || !response.data) {
    throw new Error(response.message || 'Refresh failed')
  }

  return response.data
}

async function handleRefresh(config: ReturnType<typeof useRuntimeConfig>): Promise<{ accessToken: string, user: AuthUser }> {
  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = (async () => {
    try {
      const data = await performRefresh(config)
      setAccessToken(data.accessToken)
      setUser(data.user)
      refreshQueue.forEach(item => item.resolve(data))
      return data
    }
    catch (error) {
      setAccessToken(null)
      setUser(null)
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

    async onResponseError({ response, request, options }) {
      if (response.status === 401 && !String(request).includes('/auth/refresh')) {
        try {
          const data = await handleRefresh(config)
          const headers = new Headers(options?.headers as HeadersInit)
          headers.set('Authorization', `Bearer ${data.accessToken}`)

          return $fetch(request as string, {
            headers,
            baseURL: config.public.apiBase,
            credentials: 'include',
          })
        }
        catch {
          setAccessToken(null)
          setUser(null)
          navigateTo('/login')
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
      setUser,
      getUser,
    },
  }
})
