export default defineNuxtPlugin(async () => {
  const { $getUser, $setUser, $setAccessToken } = useNuxtApp()

  try {
    const config = useRuntimeConfig()
    const response = await $fetch<{ success: boolean, data: { accessToken: string, user: AuthUser } }>(`${config.public.apiBase}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })

    if (response.success && response.data) {
      $setAccessToken(response.data.accessToken)
      $setUser(response.data.user)
    }
  }
  catch {
    // No valid refresh cookie — user will be redirected to login by middleware
  }
})
