interface ApiError {
  statusCode: number
  message: string
  details?: Record<string, string[]>
}

export function useApiError() {
  function handleError(error: unknown): ApiError {
    const err = error as {
      statusCode?: number
      status?: number
      data?: { message?: string; details?: Record<string, string[]> }
      response?: { status?: number; data?: { message?: string; details?: Record<string, string[]> } }
      message?: string
    }

    const statusCode = err.statusCode || err.status || err.response?.status || 500
    const message =
      err.data?.message ||
      err.response?.data?.message ||
      err.message ||
      'An unexpected error occurred'
    const details = err.data?.details || err.response?.data?.details

    return { statusCode, message, details }
  }

  function getFieldErrors(error: unknown): Record<string, string> {
    const apiError = handleError(error)
    const fieldErrors: Record<string, string> = {}

    if (apiError.details) {
      for (const [field, messages] of Object.entries(apiError.details)) {
        fieldErrors[field] = messages[0]
      }
    }

    return fieldErrors
  }

  function getPermissionDeniedMessage(): string {
    return 'You do not have permission to perform this action.'
  }

  function getNotFoundMessage(resource: string): string {
    return `${resource} not found.`
  }

  function getServerErrorMessage(): string {
    return 'The server is temporarily unavailable. Please try again later.'
  }

  return {
    handleError,
    getFieldErrors,
    getPermissionDeniedMessage,
    getNotFoundMessage,
    getServerErrorMessage,
  }
}
