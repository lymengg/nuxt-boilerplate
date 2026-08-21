export default defineNuxtRouteMiddleware((to) => {
  const requiredPermission = to.meta.permission as string | undefined

  if (!requiredPermission) {
    return
  }

  const { can } = useAuthorization()

  if (!can(requiredPermission)) {
    return navigateTo('/unauthorized', { replace: true })
  }
})
