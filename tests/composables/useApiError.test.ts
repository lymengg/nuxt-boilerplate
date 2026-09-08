import { describe, expect, it } from 'vitest'
import { useApiError } from '~/composables/useApiError'
import type { ApiResponse } from '~/types/api'

const { getErrorMessage, getFieldErrors, getStatus, isValidationError } = useApiError()

/** A FetchError-like object as thrown by ofetch for a backend ApiResponse. */
function backendError(status: number, message: string, data?: unknown): unknown {
  return {
    request: 'http://localhost:8080/api/test',
    response: { status, _data: {} },
    data: { success: false, message, data, timestamp: '' } as ApiResponse<unknown>,
  }
}

function networkError(): unknown {
  return { request: 'http://localhost:8080/api/test', response: undefined, data: undefined }
}

describe('useApiError', () => {
  describe('getErrorMessage', () => {
    it('returns the backend message for an ApiResponse error', () => {
      expect(getErrorMessage(backendError(400, 'Username already exists'))).toBe('Username already exists')
    })

    it('returns a network message when there is no HTTP response', () => {
      expect(getErrorMessage(networkError())).toBe('Unable to reach the server. Please try again.')
    })

    it('returns the message of a plain Error', () => {
      expect(getErrorMessage(new Error('boom'))).toBe('boom')
    })

    it('returns a string error as-is', () => {
      expect(getErrorMessage('something went wrong')).toBe('something went wrong')
    })

    it('returns a fallback for unknown errors', () => {
      expect(getErrorMessage(null)).toBe('An unexpected error occurred')
      expect(getErrorMessage(undefined)).toBe('An unexpected error occurred')
      expect(getErrorMessage({ nope: true })).toBe('An unexpected error occurred')
    })
  })

  describe('getFieldErrors', () => {
    it('returns the field map from a validation error', () => {
      const errors = getFieldErrors(backendError(400, 'Validation failed', { username: 'Username is required' }))
      expect(errors).toEqual({ username: 'Username is required' })
    })

    it('returns an empty object when there are no field errors', () => {
      expect(getFieldErrors(backendError(401, 'Invalid credentials'))).toEqual({})
    })

    it('returns an empty object for network errors', () => {
      expect(getFieldErrors(networkError())).toEqual({})
    })
  })

  describe('getStatus', () => {
    it('returns the HTTP status of a FetchError', () => {
      expect(getStatus(backendError(403, 'Forbidden'))).toBe(403)
    })

    it('returns undefined for non-fetch errors', () => {
      expect(getStatus(new Error('boom'))).toBeUndefined()
    })
  })

  describe('isValidationError', () => {
    it('returns true for a 400', () => {
      expect(isValidationError(backendError(400, 'Validation failed'))).toBe(true)
    })

    it('returns false for other statuses', () => {
      expect(isValidationError(backendError(401, 'Invalid credentials'))).toBe(false)
      expect(isValidationError(backendError(500, 'Server error'))).toBe(false)
    })
  })
})
