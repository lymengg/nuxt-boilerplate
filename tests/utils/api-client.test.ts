import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createApiClient, AUTH_PATHS, type HttpClient } from '~/utils/api-client'

/** A FetchError-like object as thrown by ofetch for an HTTP error response. */
function fetchError(status: number, request = 'http://localhost:8080/api/x'): unknown {
  return {
    request,
    response: { status },
    data: { success: false, message: 'error', data: null, timestamp: '' },
  }
}

describe('createApiClient', () => {
  let http: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    http = vi.fn()
  })

  it('passes successful responses through unchanged', async () => {
    http.mockResolvedValue({ success: true, data: { id: 1 } })
    const api = createApiClient(http as unknown as HttpClient)

    const result = await api('/api/expenses', { query: { page: 0 } })

    expect(result).toEqual({ success: true, data: { id: 1 } })
    expect(http).toHaveBeenCalledWith('/api/expenses', { query: { page: 0 } })
  })

  it('rethrows non-401 errors without refreshing', async () => {
    http.mockRejectedValue(fetchError(500))
    const api = createApiClient(http as unknown as HttpClient)

    await expect(api('/api/expenses')).rejects.toMatchObject({ response: { status: 500 } })
    expect(http).toHaveBeenCalledTimes(1)
  })

  it('refreshes once and retries the original request on a 401', async () => {
    http.mockImplementation(async (path: string, opts?: { __authRetried?: boolean }) => {
      if (path === '/api/auth/refresh') return { success: true }
      if (opts?.__authRetried) return 'RETRIED_OK'
      throw fetchError(401, path)
    })
    const api = createApiClient(http as unknown as HttpClient)

    const result = await api('/api/expenses')

    expect(result).toBe('RETRIED_OK')
    expect(http).toHaveBeenCalledWith('/api/expenses', { __authRetried: true })
    expect(http).toHaveBeenCalledWith('/api/auth/refresh', { method: 'POST' })
  })

  it('does not refresh for 401s on auth paths', async () => {
    http.mockRejectedValue(fetchError(401))
    const api = createApiClient(http as unknown as HttpClient)

    for (const path of AUTH_PATHS) {
      await expect(api(path)).rejects.toMatchObject({ response: { status: 401 } })
    }

    // The client never issues an actual refresh (POST /api/auth/refresh).
    const refreshAttempts = http.mock.calls.filter(c => c[0] === '/api/auth/refresh' && c[1]?.method === 'POST')
    expect(refreshAttempts).toHaveLength(0)
    // One call per path — the original requests only.
    expect(http).toHaveBeenCalledTimes(AUTH_PATHS.length)
  })

  it('does not retry twice when the retried request is also a 401', async () => {
    http.mockImplementation(async (path: string) => {
      if (path === '/api/auth/refresh') return { success: true }
      throw fetchError(401, path)
    })
    const api = createApiClient(http as unknown as HttpClient)

    await expect(api('/api/expenses')).rejects.toMatchObject({ response: { status: 401 } })

    // original + refresh + retry — no second refresh loop.
    expect(http).toHaveBeenCalledTimes(3)
    expect(http.mock.calls.filter(c => c[0] === '/api/auth/refresh')).toHaveLength(1)
  })

  it('calls onSessionExpired and rethrows when the refresh fails', async () => {
    http.mockRejectedValue(fetchError(401))
    const onSessionExpired = vi.fn()
    const api = createApiClient(http as unknown as HttpClient, { onSessionExpired })

    await expect(api('/api/expenses')).rejects.toMatchObject({ response: { status: 401 } })

    expect(onSessionExpired).toHaveBeenCalledTimes(1)
    expect(http.mock.calls.filter(c => c[0] === '/api/auth/refresh')).toHaveLength(1)
  })

  it('shares a single refresh across concurrent 401s (single-flight)', async () => {
    http.mockImplementation(async (path: string) => {
      if (path === '/api/auth/refresh') return { success: true }
      throw fetchError(401, path)
    })
    const api = createApiClient(http as unknown as HttpClient)

    await Promise.allSettled([api('/api/a'), api('/api/b'), api('/api/c')])

    expect(http.mock.calls.filter(c => c[0] === '/api/auth/refresh')).toHaveLength(1)
  })

  it('recovers concurrent 401s when the refresh succeeds', async () => {
    http.mockImplementation(async (path: string, opts?: { __authRetried?: boolean }) => {
      if (path === '/api/auth/refresh') return { success: true }
      if (opts?.__authRetried) return `OK:${path}`
      throw fetchError(401, path)
    })
    const api = createApiClient(http as unknown as HttpClient)

    const results = await Promise.all([api('/api/a'), api('/api/b')])

    expect(results).toEqual(['OK:/api/a', 'OK:/api/b'])
    expect(http.mock.calls.filter(c => c[0] === '/api/auth/refresh')).toHaveLength(1)
  })
})
