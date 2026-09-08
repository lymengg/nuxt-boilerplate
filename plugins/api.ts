import { createApiClient, type HttpClient } from '~/utils/api-client'

/**
 * HTTP client for the app — a thin wrapper around `$fetch` that calls the
 * Spring backend directly at the configured API base (e.g. https://api.xxx.com).
 * The SPA is static; there is no proxy in the request path.
 *
 * No token handling: the backend owns auth entirely via httpOnly cookies
 * (set/rotated/cleared by Spring) — `credentials: 'include'` sends them on
 * these cross-origin calls. Session refresh on 401 (single-flight, one-time
 * retry) lives in `utils/api-client.ts`.
 *
 * Errors keep the backend `ApiResponse` body available via `error.data`;
 * `useApiError` extracts the human-readable message and field errors.
 */

function createApi(): HttpClient {
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
  }) as unknown as HttpClient

  return createApiClient(http)
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
    $api: ReturnType<typeof createApi>
  }
}
