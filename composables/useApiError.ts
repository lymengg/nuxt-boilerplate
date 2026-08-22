interface ApiErrorResponse {
  message?: string
  error?: string
  errors?: Record<string, string>
  details?: Record<string, string>
}

export function useApiError() {
  function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message
    }
    if (typeof error === 'string') {
      return error
    }
    if (error && typeof error === 'object') {
      const apiError = error as ApiErrorResponse
      if (apiError.message) {
        return apiError.message
      }
      if (apiError.error) {
        return apiError.error
      }
    }
    return 'An unexpected error occurred'
  }

  function getFieldErrors(error: unknown): Record<string, string> {
    if (error && typeof error === 'object') {
      const apiError = error as ApiErrorResponse
      if (apiError.errors && typeof apiError.errors === 'object') {
        return apiError.errors
      }
      if (apiError.details && typeof apiError.details === 'object') {
        return apiError.details
      }
    }
    return {}
  }

  function isValidationError(error: unknown): boolean {
    if (error && typeof error === 'object') {
      const apiError = error as { code?: string; statusCode?: number }
      return apiError.code === 'VALIDATION_ERROR' || apiError.statusCode === 422
    }
    return false
  }

  return {
    getErrorMessage,
    getFieldErrors,
    isValidationError,
  }
}
