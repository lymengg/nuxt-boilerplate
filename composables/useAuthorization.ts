import type { PermissionCategory } from '~/types'

export function useAuthorization() {
  const { user } = useAuth()

  function can(permission: string): boolean {
    if (!user.value) return false
    return user.value.permissions.includes(permission)
  }

  function canAny(...permissions: string[]): boolean {
    return permissions.some((p) => can(p))
  }

  function canAll(...permissions: string[]): boolean {
    return permissions.every((p) => can(p))
  }

  function hasRole(role: string): boolean {
    if (!user.value) return false
    return user.value.roles.includes(role)
  }

  function hasAnyRole(...roles: string[]): boolean {
    return roles.some((r) => hasRole(r))
  }

  function canCategory(category: PermissionCategory): boolean {
    if (!user.value) return false
    const prefix = `${category}_`
    return user.value.permissions.some((p) => p.startsWith(prefix))
  }

  return {
    can,
    canAny,
    canAll,
    hasRole,
    hasAnyRole,
    canCategory,
  }
}
