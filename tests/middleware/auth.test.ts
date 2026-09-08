import { describe, expect, it, beforeEach } from 'vitest'
import { setActivePinia } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { derivePermissions } from '~/utils/permissions'

/**
 * Middleware integration tests: navigate the real router (which runs the
 * app's route middleware) and assert where the navigation lands. This proves
 * both the middleware decisions and that they are wired into the routes.
 */
function setUser(roles: string[]) {
  useAuthStore().user = {
    username: 'john.doe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    roles,
    enabled: true,
    mfaEnabled: false,
    mfaMethod: 'NONE',
    permissions: derivePermissions(roles),
  }
}

async function navigate(path: string): Promise<string> {
  const router = useRouter()
  await router.push(path)
  return router.currentRoute.value.path
}

describe('route middleware', () => {
  beforeEach(async () => {
    // The route middleware reads the store from the APP's pinia instance,
    // so test state must be set there, not in a fresh test pinia.
    setActivePinia(useNuxtApp().$pinia)
    useAuthStore().user = null
    // Reset to a neutral route: a push to the CURRENT route is aborted by
    // vue-router before middleware runs, which would mask redirects.
    await useRouter().replace('/login')
  })

  describe('auth middleware', () => {
    it('redirects unauthenticated users to /login', async () => {
      const finalPath = await navigate('/expenses')
      expect(finalPath).toBe('/login')
    })

    it('lets authenticated users reach protected pages', async () => {
      setUser(['EMPLOYEE'])
      const finalPath = await navigate('/expenses')
      expect(finalPath).toBe('/expenses')
    })
  })

  describe('guest middleware', () => {
    it('redirects authenticated users away from public pages to /dashboard', async () => {
      setUser(['EMPLOYEE'])
      const finalPath = await navigate('/forgot-password')
      expect(finalPath).toBe('/dashboard')
    })

    it('lets unauthenticated users reach /login', async () => {
      const finalPath = await navigate('/login')
      expect(finalPath).toBe('/login')
    })
  })

  describe('permission middleware', () => {
    /**
     * RBAC sweep: every management route declares its permission in
     * definePageMeta and runs ['auth', 'permission'] middleware. Prove the
     * matrix — a role with the permission gets in, a role without it is
     * redirected to /unauthorized.
     */
    const PAGES: Array<{ path: string, permission: string, allowedRole: string, deniedRole: string }> = [
      { path: '/management/users', permission: 'USER_READ', allowedRole: 'USER_MANAGER', deniedRole: 'EMPLOYEE' },
      { path: '/management/roles', permission: 'ROLE_READ', allowedRole: 'TENANT_ADMIN', deniedRole: 'EMPLOYEE' },
      { path: '/management/tenants', permission: 'TENANT_READ', allowedRole: 'PLATFORM_ADMIN', deniedRole: 'USER_MANAGER' },
      { path: '/management/departments', permission: 'DEPARTMENT_READ', allowedRole: 'TENANT_ADMIN', deniedRole: 'EMPLOYEE' },
      { path: '/management/audit', permission: 'AUDIT_LOG_READ', allowedRole: 'AUDITOR', deniedRole: 'EMPLOYEE' },
    ]

    it.each(PAGES)('lets a $allowedRole (with $permission) into $path', async ({ path, allowedRole }) => {
      setUser([allowedRole])
      const finalPath = await navigate(path)
      expect(finalPath).toBe(path)
    })

    it.each(PAGES)('redirects a $deniedRole (without $permission) away from $path', async ({ path, deniedRole }) => {
      setUser([deniedRole])
      const finalPath = await navigate(path)
      expect(finalPath).toBe('/unauthorized')
    })
  })
})
