/**
 * Client-side role → permission mapping.
 *
 * The backend does not expose the current user's permissions (only roles, via
 * the JWT / profile). These maps mirror the role_permissions seed data in
 * spring-boilerplate (V4/V7/V11/V12/V15/V16 migrations) so the UI can gate
 * actions. The backend ALWAYS remains the enforcement point — this is purely
 * presentational.
 *
 * Keep in sync with the backend seed migrations when roles or permissions change.
 */
import type { UserPermission } from '~/types/user-permission'

const ALL: UserPermission[] = [
  'TENANT_READ', 'TENANT_CREATE', 'TENANT_UPDATE', 'TENANT_DELETE',
  'USER_READ', 'USER_WRITE', 'USER_CREATE', 'USER_UPDATE', 'USER_DELETE',
  'USER_ENABLE', 'USER_ASSIGN_ROLE',
  'ROLE_READ', 'ROLE_WRITE', 'ROLE_DELETE', 'ROLE_ASSIGN_PERMISSION',
  'DEPARTMENT_READ', 'DEPARTMENT_CREATE', 'DEPARTMENT_UPDATE', 'DEPARTMENT_DELETE',
  'EXPENSE_READ', 'EXPENSE_READ_ALL', 'EXPENSE_CREATE', 'EXPENSE_UPDATE',
  'EXPENSE_DELETE', 'EXPENSE_APPROVE', 'EXPENSE_REJECT', 'EXPENSE_PROCESS',
  'MFA_MANAGE', 'REPORT_READ', 'AUDIT_LOG_READ',
]

export const ROLE_PERMISSIONS: Record<string, UserPermission[]> = {
  PLATFORM_ADMIN: ALL,
  TENANT_ADMIN: [
    'TENANT_READ', 'TENANT_UPDATE',
    'USER_READ', 'USER_WRITE', 'USER_CREATE', 'USER_UPDATE', 'USER_DELETE',
    'USER_ENABLE', 'USER_ASSIGN_ROLE',
    'ROLE_READ', 'ROLE_WRITE', 'ROLE_DELETE', 'ROLE_ASSIGN_PERMISSION',
    'DEPARTMENT_READ', 'DEPARTMENT_CREATE', 'DEPARTMENT_UPDATE', 'DEPARTMENT_DELETE',
    'EXPENSE_READ', 'EXPENSE_READ_ALL', 'EXPENSE_CREATE', 'EXPENSE_UPDATE',
    'EXPENSE_DELETE', 'EXPENSE_APPROVE', 'EXPENSE_REJECT', 'EXPENSE_PROCESS',
    'REPORT_READ', 'AUDIT_LOG_READ',
  ],
  USER_MANAGER: ['USER_READ', 'USER_WRITE', 'USER_CREATE', 'USER_ASSIGN_ROLE'],
  DEPARTMENT_MANAGER: ['USER_READ', 'DEPARTMENT_READ', 'EXPENSE_READ', 'EXPENSE_APPROVE', 'EXPENSE_REJECT', 'REPORT_READ'],
  EMPLOYEE: ['EXPENSE_READ', 'EXPENSE_CREATE', 'EXPENSE_UPDATE', 'EXPENSE_DELETE'],
  AUDITOR: ['USER_READ', 'DEPARTMENT_READ', 'EXPENSE_READ', 'EXPENSE_READ_ALL', 'REPORT_READ', 'AUDIT_LOG_READ'],
  FINANCE: ['EXPENSE_READ', 'EXPENSE_READ_ALL', 'EXPENSE_PROCESS', 'REPORT_READ'],
}

/** All distinct permissions a set of roles grants. */
export function derivePermissions(roles: string[]): string[] {
  const granted = new Set<string>()
  for (const role of roles) {
    for (const permission of ROLE_PERMISSIONS[role] ?? []) {
      granted.add(permission)
    }
  }
  return [...granted]
}
