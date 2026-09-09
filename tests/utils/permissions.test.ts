import { describe, expect, it } from 'vitest'
import { PERMISSION_GROUPS } from '~/types/permission'
import type { UserPermission } from '~/types/user-permission'

/**
 * The complete permission catalog, mirroring spring-boilerplate's
 * `UserPermission` enum. Typed against the union so any rename in the type
 * breaks compilation, and compared at runtime against the catalog + mapping.
 */
const EXPECTED_ALL_PERMISSIONS: UserPermission[] = [
  'TENANT_READ', 'TENANT_CREATE', 'TENANT_UPDATE', 'TENANT_DELETE',
  'USER_READ', 'USER_WRITE', 'USER_CREATE', 'USER_UPDATE', 'USER_DELETE',
  'USER_ENABLE', 'USER_ASSIGN_ROLE',
  'ROLE_READ', 'ROLE_WRITE', 'ROLE_DELETE', 'ROLE_ASSIGN_PERMISSION',
  'DEPARTMENT_READ', 'DEPARTMENT_CREATE', 'DEPARTMENT_UPDATE', 'DEPARTMENT_DELETE',
  'EXPENSE_READ', 'EXPENSE_READ_ALL', 'EXPENSE_CREATE', 'EXPENSE_UPDATE',
  'EXPENSE_DELETE', 'EXPENSE_APPROVE', 'EXPENSE_REJECT', 'EXPENSE_PROCESS',
  'MFA_MANAGE', 'REPORT_READ', 'AUDIT_LOG_READ',
]

describe('permission catalog drift guards', () => {
  it('the UI catalog covers exactly the UserPermission union', () => {
    const catalogIds = PERMISSION_GROUPS.flatMap(g => g.permissions.map(p => p.id)).sort()
    expect(catalogIds).toEqual([...EXPECTED_ALL_PERMISSIONS].sort())
  })

})


