import type { ApiResponse } from '~/types/api'
import type { ResetPasswordRequest } from '~/types/auth'

/**
 * BFF reset-password: proxies to the backend. No session needed — the reset
 * token in the body authenticates the request.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<ResetPasswordRequest>(event)
  const config = useRuntimeConfig()

  return await $fetch<ApiResponse<void>>('/api/auth/reset-password', {
    baseURL: config.backendUrl,
    method: 'POST',
    body,
  })
})
