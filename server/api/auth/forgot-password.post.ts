import type { ApiResponse } from '~/types/api'
import type { ForgotPasswordRequest } from '~/types/auth'

/**
 * BFF forgot-password: proxies to the backend. No session needed — this is a
 * public endpoint. The backend always returns the same message regardless of
 * whether the email exists (prevents user enumeration).
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<ForgotPasswordRequest>(event)
  const config = useRuntimeConfig()

  return await $fetch<ApiResponse<void>>('/api/auth/forgot-password', {
    baseURL: config.backendUrl,
    method: 'POST',
    body,
  })
})
