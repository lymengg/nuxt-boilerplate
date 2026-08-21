export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, isInitialized, initialize } = useAuth()

  if (import.meta.server) {
    if (to.path === '/login' || to.path.startsWith('/mfa')) {
      return
    }
    return
  }

  if (!isInitialized.value) {
    await initialize()
  }

  if (!isAuthenticated.value) {
    return navigateTo('/login', { replace: true })
  }
})
