export function useApiError() {
  function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message
    }
    if (typeof error === 'string') {
      return error
    }
    return 'An unexpected error occurred'
  }

  function getFieldErrors(error: unknown): Record<string, string> {
    if (error && typeof error === 'object' && 'errors' in error) {
      return (error as { errors: Record<string, string> }).errors
    }
    return {}
  }

  function isValidationError(error: unknown): boolean {
    if (error && typeof error === 'object' && 'code' in error) {
      return (error as { code: string }).code === 'VALIDATION_ERROR'
    }
    return false
  }

  return {
    getErrorMessage,
    getFieldErrors,
    isValidationError,
  }
}
