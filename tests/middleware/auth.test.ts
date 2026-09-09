import { describe, expect, it, beforeEach } from 'vitest'
import { setActivePinia } from 'pinia'
import { useAuthStore } from '~/stores/auth'

/**
 * Middleware integration tests: navigate the real router (which runs the
 * app's route middleware) and assert where the navigation lands. This proves
 * both the middleware decisions and that they are wired into the routes.
 */
function setUser(roles: string[], permissions: string[] = []) {
  useAuthStore().user = {
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    roles,
    permissions,
    enabled: true,
    mfaEnabled: false,
    mfaMethod: 'NONE',
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
      setUser(['EMPLOYEE'], ['EXPENSE_READ'])
      const finalPath = await navigate('/expenses')
      expect(finalPath).toBe('/expenses')
    })
  })

  describe('guest middleware', () => {
    it('redirects authenticated users away from public pages to /dashboard', async () => {
      setUser(['EMPLOYEE'], ['EXPENSE_READ'])
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
     * matrix — a user with the permission gets in, a user without it is
     * redirected to /unauthorized.
     */
    const PAGES: Array<{ path: string, permission: string, deniedPermission: string }> = [
      { path: '/management/users', permission: 'USER_READ', deniedPermission: 'EXPENSE_READ' },
      { path: '/management/roles', permission: 'ROLE_READ', deniedPermission: 'EXPENSE_READ' },
      { path: '/management/tenants', permission: 'TENANT_READ', deniedPermission: 'USER_READ' },
      { path: '/management/departments', permission: 'DEPARTMENT_READ', deniedPermission: 'EXPENSE_READ' },
      { path: '/management/audit', permission: 'AUDIT_LOG_READ', deniedPermission: 'EXPENSE_READ' },
    ]

    it.each(PAGES)('lets a user with $permission into $path', async ({ path, permission }) => {
      setUser(['EMPLOYEE'], [permission])
      const finalPath = await navigate(path)
      expect(finalPath).toBe(path)
    })

    it.each(PAGES)('redirects a user without $permission away from $path', async ({ path, deniedPermission }) => {
      setUser(['EMPLOYEE'], [deniedPermission])
      const finalPath = await navigate(path)
      expect(finalPath).toBe('/unauthorized')
    })
  })
})
