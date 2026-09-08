import { describe, expect, it } from 'vitest'
import { ROLE_PERMISSIONS, derivePermissions } from '~/utils/permissions'
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

  it('PLATFORM_ADMIN is granted every permission', () => {
    expect([...ROLE_PERMISSIONS.PLATFORM_ADMIN].sort()).toEqual([...EXPECTED_ALL_PERMISSIONS].sort())
  })

  it('every built-in role has a permission mapping', () => {
    const roles = ['PLATFORM_ADMIN', 'TENANT_ADMIN', 'USER_MANAGER', 'DEPARTMENT_MANAGER', 'EMPLOYEE', 'AUDITOR', 'FINANCE']
    for (const role of roles) {
      expect(ROLE_PERMISSIONS[role], `missing mapping for ${role}`).toBeDefined()
      expect(ROLE_PERMISSIONS[role].length, `empty mapping for ${role}`).toBeGreaterThan(0)
    }
  })
})

describe('derivePermissions', () => {
  it('returns an empty array for an unknown role', () => {
    expect(derivePermissions(['NONEXISTENT'])).toEqual([])
  })

  it('returns an empty array for no roles', () => {
    expect(derivePermissions([])).toEqual([])
  })

  it('maps EMPLOYEE to expense permissions only (no approve/process)', () => {
    const permissions = derivePermissions(['EMPLOYEE'])
    expect(permissions).toContain('EXPENSE_READ')
    expect(permissions).toContain('EXPENSE_CREATE')
    expect(permissions).toContain('EXPENSE_UPDATE')
    expect(permissions).toContain('EXPENSE_DELETE')
    expect(permissions).not.toContain('EXPENSE_APPROVE')
    expect(permissions).not.toContain('EXPENSE_REJECT')
    expect(permissions).not.toContain('EXPENSE_PROCESS')
    expect(permissions).not.toContain('USER_READ')
  })

  it('maps FINANCE to read + process, never approve', () => {
    const permissions = derivePermissions(['FINANCE'])
    expect(permissions).toContain('EXPENSE_READ')
    expect(permissions).toContain('EXPENSE_READ_ALL')
    expect(permissions).toContain('EXPENSE_PROCESS')
    expect(permissions).not.toContain('EXPENSE_APPROVE')
    expect(permissions).not.toContain('EXPENSE_CREATE')
  })

  it('maps AUDITOR to read-only access including audit logs', () => {
    const permissions = derivePermissions(['AUDITOR'])
    expect(permissions).toContain('EXPENSE_READ')
    expect(permissions).toContain('EXPENSE_READ_ALL')
    expect(permissions).toContain('AUDIT_LOG_READ')
    expect(permissions).not.toContain('EXPENSE_CREATE')
    expect(permissions).not.toContain('EXPENSE_APPROVE')
    expect(permissions).not.toContain('EXPENSE_PROCESS')
    expect(permissions).not.toContain('USER_CREATE')
  })

  it('maps DEPARTMENT_MANAGER to expense approval without processing', () => {
    const permissions = derivePermissions(['DEPARTMENT_MANAGER'])
    expect(permissions).toContain('EXPENSE_APPROVE')
    expect(permissions).toContain('EXPENSE_REJECT')
    expect(permissions).not.toContain('EXPENSE_PROCESS')
    expect(permissions).not.toContain('EXPENSE_CREATE')
  })

  it('maps USER_MANAGER to user management without admin roles', () => {
    const permissions = derivePermissions(['USER_MANAGER'])
    expect(permissions).toContain('USER_READ')
    expect(permissions).toContain('USER_WRITE')
    expect(permissions).toContain('USER_CREATE')
    expect(permissions).toContain('USER_ASSIGN_ROLE')
    expect(permissions).not.toContain('USER_DELETE')
    expect(permissions).not.toContain('USER_ENABLE')
    expect(permissions).not.toContain('ROLE_WRITE')
    expect(permissions).not.toContain('TENANT_CREATE')
  })

  it('deduplicates permissions across multiple roles', () => {
    const permissions = derivePermissions(['EMPLOYEE', 'FINANCE'])
    expect(permissions).toContain('EXPENSE_READ')
    const duplicates = permissions.filter(p => p === 'EXPENSE_READ')
    expect(duplicates).toHaveLength(1)
  })

  it('merges permissions from multiple roles', () => {
    const permissions = derivePermissions(['EMPLOYEE', 'AUDITOR'])
    expect(permissions).toContain('EXPENSE_CREATE') // from EMPLOYEE
    expect(permissions).toContain('AUDIT_LOG_READ') // from AUDITOR
  })
})
