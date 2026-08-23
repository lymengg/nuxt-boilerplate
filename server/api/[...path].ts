import type { ApiResponse } from '~/types/api'

/**
 * BFF catch-all proxy: every non-auth API request flows through here.
 *
 * The browser calls same-origin `/api/management/*`, `/api/expenses/*`, etc.
 * This route:
 * 1. Reads the BFF session to get the access token.
 * 2. Attaches it as a `Bearer` header when forwarding to the backend.
 * 3. On 401, transparently refreshes the session and retries once.
 * 4. Returns the backend response body to the browser.
 *
 * The browser never sees the access token, the refresh token, or the backend URL.
 * Auth routes (`/api/auth/*`) have their own dedicated handlers and never hit
 * this catch-all.
 *
 * Security:
 * - The Authorization header is derived exclusively from the server-side session.
 * - No client-controlled headers (Authorization, X-User-Id, etc.) are forwarded.
 * - The backend URL comes exclusively from server-side runtimeConfig.
 * - Error responses never expose stack traces, SQL errors, or infrastructure details.
 */
export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')

  if (!path) {
    throw createError({ statusCode: 400, statusMessage: 'Missing path' })
  }

  // Auth routes have their own handlers — this catch-all should never receive
  // them, but guard against it just in case.
  if (path.startsWith('auth/')) {
    throw createError({ statusCode: 404, statusMessage: 'Auth route not found' })
  }

  const session = await getBffSession(event)
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'No active session' })
  }

  setNoCacheHeaders(event)

  const config = useRuntimeConfig()
  const method = getMethod(event)
  const query = getQuery(event)
  const body = method !== 'GET' && method !== 'HEAD' ? await readBody(event) : undefined

  const doFetch = (token: string) =>
    $fetch.raw<ApiResponse<unknown>>(`/api/${path}`, {
      baseURL: config.backendUrl,
      method,
      query,
      body,
      headers: { Authorization: `Bearer ${token}` },
    })

  try {
    const response = await doFetch(session.accessToken)
    return response._data
  }
  catch (error: unknown) {
    const status = (error as { response?: { status?: number } }).response?.status

    // On 401, refresh the session and retry once with the new token.
    if (status === 401) {
      const refreshed = await refreshBffSession(event)
      if (refreshed) {
        try {
          const response = await doFetch(refreshed.accessToken)
          return response._data
        }
        catch (retryError: unknown) {
          return forwardError(retryError)
        }
      }

      // Refresh failed — session destroyed. Return 401 so the client redirects.
      throw createError({ statusCode: 401, statusMessage: 'Session expired' })
    }

    return forwardError(error)
  }
})

/**
 * Extracts the backend `ApiResponse` body from a fetch error and re-throws
 * as a safe application-level error. Never exposes stack traces, SQL errors,
 * database details, internal hostnames, file paths, or infrastructure info.
 */
function forwardError(error: unknown): never {
  const apiData = (error as { data?: ApiResponse<unknown> }).data
  const status = (error as { response?: { status?: number } }).response?.status

  if (apiData && typeof apiData === 'object' && 'message' in apiData) {
    throw createError({
      statusCode: status || 500,
      statusMessage: apiData.message || 'Backend error',
      data: apiData,
    })
  }

  // Return a generic error — never expose internal details
  throw createError({
    statusCode: status || 500,
    statusMessage: 'An unexpected error occurred',
  })
}
