import { describe, expect, it, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { useAuthorization } from '~/composables/useAuthorization'
import type { AuthUser } from '~/types/auth'

function buildUser(roles: string[], permissions: string[]): AuthUser {
  return {
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

describe('useAuthorization', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('returns false for every check when there is no user', () => {
    const { can, canAny, canAll, hasRole, hasAnyRole } = useAuthorization()
    expect(can('EXPENSE_READ')).toBe(false)
    expect(canAny('EXPENSE_READ', 'USER_READ')).toBe(false)
    expect(canAll('EXPENSE_READ')).toBe(false)
    expect(hasRole('EMPLOYEE')).toBe(false)
    expect(hasAnyRole('EMPLOYEE', 'ADMIN')).toBe(false)
  })

  it('can() checks the backend-provided permission set', () => {
    useAuthStore().user = buildUser(['EMPLOYEE'], ['EXPENSE_READ', 'EXPENSE_CREATE'])
    const { can } = useAuthorization()

    expect(can('EXPENSE_READ')).toBe(true)
    expect(can('EXPENSE_CREATE')).toBe(true)
    expect(can('EXPENSE_APPROVE')).toBe(false)
    expect(can('USER_READ')).toBe(false)
  })

  it('canAny() returns true when any permission is granted', () => {
    useAuthStore().user = buildUser(['EMPLOYEE'], ['EXPENSE_READ', 'EXPENSE_CREATE'])
    const { canAny } = useAuthorization()

    expect(canAny('USER_READ', 'EXPENSE_READ')).toBe(true)
    expect(canAny('USER_READ', 'EXPENSE_APPROVE')).toBe(false)
  })

  it('canAll() returns true only when every permission is granted', () => {
    useAuthStore().user = buildUser(['FINANCE'], ['EXPENSE_READ', 'EXPENSE_READ_ALL', 'EXPENSE_PROCESS'])
    const { canAll } = useAuthorization()

    expect(canAll('EXPENSE_READ', 'EXPENSE_READ_ALL', 'EXPENSE_PROCESS')).toBe(true)
    expect(canAll('EXPENSE_READ', 'EXPENSE_APPROVE')).toBe(false)
  })

  it('hasRole() checks the role list', () => {
    useAuthStore().user = buildUser(['DEPARTMENT_MANAGER'], ['EXPENSE_APPROVE'])
    const { hasRole } = useAuthorization()

    expect(hasRole('DEPARTMENT_MANAGER')).toBe(true)
    expect(hasRole('EMPLOYEE')).toBe(false)
  })

  it('hasAnyRole() returns true when any role matches', () => {
    useAuthStore().user = buildUser(['EMPLOYEE', 'AUDITOR'], ['EXPENSE_CREATE', 'AUDIT_LOG_READ'])
    const { hasAnyRole } = useAuthorization()

    expect(hasAnyRole('FINANCE', 'AUDITOR')).toBe(true)
    expect(hasAnyRole('FINANCE', 'PLATFORM_ADMIN')).toBe(false)
  })

  it('PLATFORM_ADMIN can do everything', () => {
    useAuthStore().user = buildUser(
      ['PLATFORM_ADMIN'],
      ['TENANT_DELETE', 'ROLE_ASSIGN_PERMISSION', 'AUDIT_LOG_READ'],
    )
    const { can, hasRole } = useAuthorization()

    expect(can('TENANT_DELETE')).toBe(true)
    expect(can('ROLE_ASSIGN_PERMISSION')).toBe(true)
    expect(can('AUDIT_LOG_READ')).toBe(true)
    expect(hasRole('PLATFORM_ADMIN')).toBe(true)
  })
})
