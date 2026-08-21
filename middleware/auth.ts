export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const { isAuthenticated, isMfaPending } = useAuth()

  if (isMfaPending.value && to.path !== '/mfa/verify') {
    return navigateTo('/mfa/verify')
  }

  if (!isAuthenticated.value && to.path !== '/login' && !to.path.startsWith('/mfa')) {
    return navigateTo('/login')
  }
})
