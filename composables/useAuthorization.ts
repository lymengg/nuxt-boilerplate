export function useAuthorization() {
  const { user } = useAuth()

  function can(permission: string): boolean {
    if (!user.value) return false
    return user.value.permissions.includes(permission)
  }

  function canAny(...permissions: string[]): boolean {
    return permissions.some(p => can(p))
  }

  function canAll(...permissions: string[]): boolean {
    return permissions.every(p => can(p))
  }

  function hasRole(role: string): boolean {
    if (!user.value) return false
    return user.value.roles.includes(role)
  }

  function hasAnyRole(...roles: string[]): boolean {
    return roles.some(r => hasRole(r))
  }

  return {
    can,
    canAny,
    canAll,
    hasRole,
    hasAnyRole,
  }
}
