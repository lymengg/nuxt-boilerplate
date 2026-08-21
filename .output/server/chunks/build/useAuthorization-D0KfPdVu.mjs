import { u as useAuth } from './useAuth-BC3_nFKE.mjs';

function useAuthorization() {
  const { user } = useAuth();
  function can(permission) {
    if (!user.value) return false;
    return user.value.permissions.includes(permission);
  }
  function canAny(...permissions) {
    return permissions.some((p) => can(p));
  }
  function canAll(...permissions) {
    return permissions.every((p) => can(p));
  }
  function hasRole(role) {
    if (!user.value) return false;
    return user.value.roles.includes(role);
  }
  function hasAnyRole(...roles) {
    return roles.some((r) => hasRole(r));
  }
  function canCategory(category) {
    if (!user.value) return false;
    const prefix = `${category}_`;
    return user.value.permissions.some((p) => p.startsWith(prefix));
  }
  return {
    can,
    canAny,
    canAll,
    hasRole,
    hasAnyRole,
    canCategory
  };
}

export { useAuthorization as u };
//# sourceMappingURL=useAuthorization-D0KfPdVu.mjs.map
