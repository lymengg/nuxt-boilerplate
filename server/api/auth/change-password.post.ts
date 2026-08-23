import type { ApiResponse } from '~/types/api'
import type { ChangePasswordRequest } from '~/types/auth'

/**
 * BFF change-password: proxies to the backend with the session's access token.
 * After a successful change, the backend revokes all refresh tokens — the BFF
 * session is destroyed so the user must sign in again.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<ChangePasswordRequest>(event)
  const session = await getBffSession(event)

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'No active session' })
  }

  setNoCacheHeaders(event)

  const config = useRuntimeConfig()
  const response = await $fetch<ApiResponse<void>>('/api/auth/change-password', {
    baseURL: config.backendUrl,
    method: 'POST',
    body,
    headers: { Authorization: `Bearer ${session.accessToken}` },
  })

  if (response.success) {
    await destroyBffSession(event)
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      event: 'PASSWORD_CHANGED',
    }))
  }

  return response
})
