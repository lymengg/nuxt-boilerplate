export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated, isInitialized, initialize } = useAuth()

  if (import.meta.server) {
    return
  }

  if (!isInitialized.value) {
    await initialize()
  }

  if (isAuthenticated.value) {
    return navigateTo('/dashboard', { replace: true })
  }
})
