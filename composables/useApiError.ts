import type { ApiResponse } from '~/types/api'
import type { FetchError } from 'ofetch'

/**
 * Extracts user-facing messages from errors.
 *
 * The backend wraps every error in an `ApiResponse` body (`success: false`),
 * so `ofetch` throws a `FetchError` whose `data` is that envelope:
 *   - `data.message`   → human-readable message (e.g. "Invalid credentials")
 *   - `data.data`      → field-level validation map on 400 ("Validation failed")
 */
interface BackendErrorLike {
  data?: ApiResponse<unknown>
}

function isFetchError(error: unknown): error is FetchError {
  return typeof error === 'object' && error !== null && 'request' in error && 'response' in error
}

function toBackendError(error: unknown): BackendErrorLike | null {
  if (isFetchError(error)) {
    const data = error.data as ApiResponse<unknown> | undefined
    if (data && typeof data === 'object' && 'success' in data) {
      return { data }
    }
  }
  return null
}

export function useApiError() {
  function getErrorMessage(error: unknown): string {
    const backend = toBackendError(error)
    if (backend?.data?.message) {
      return backend.data.message
    }
    if (error instanceof Error && error.message) {
      return error.message
    }
    if (typeof error === 'string') {
      return error
    }
    return 'An unexpected error occurred'
  }

  /** Field-level validation errors: `{ field: message }` from a 400. */
  function getFieldErrors(error: unknown): Record<string, string> {
    const backend = toBackendError(error)
    const data = backend?.data?.data
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return data as Record<string, string>
    }
    return {}
  }

  function getStatus(error: unknown): number | undefined {
    if (isFetchError(error)) {
      return error.response?.status
    }
    return undefined
  }

  function isValidationError(error: unknown): boolean {
    return getStatus(error) === 400
  }

  return {
    getErrorMessage,
    getFieldErrors,
    getStatus,
    isValidationError,
  }
}
