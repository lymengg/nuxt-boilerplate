import type { FetchError, FetchOptions } from 'ofetch'
import type { ApiResponse } from '~/types/api'

/**
 * HTTP client for the app — a thin wrapper around `$fetch` that talks to the
 * BFF (same-origin `/api/*` routes). No token handling, no refresh logic:
 * the BFF server handles all of that. The browser never sees tokens.
 *
 * Errors keep the backend `ApiResponse` body available via `error.data`;
 * `useApiError` extracts the human-readable message and field errors.
 */

type ApiClient = <T = unknown>(request: string, options?: FetchOptions<'json'>) => Promise<T>

function createApi(): ApiClient {
  return $fetch.create({
    // No baseURL — services already use full same-origin paths like
    // `/api/expenses`, which hit the BFF server routes directly.

    onResponseError({ error }) {
      // Make the backend message the primary error message so UI code can rely
      // on `error.message` (the ApiResponse body stays available on `error.data`).
      const data = (error as FetchError).data as ApiResponse<unknown> | undefined
      if (data && typeof data === 'object' && 'message' in data && data.message) {
        ;(error as FetchError).message = data.message
      }
    },
  }) as unknown as ApiClient
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
