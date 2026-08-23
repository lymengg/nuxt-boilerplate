/**
 * Permission catalog for the role-management UI.
 *
 * Permission names MUST match spring-boilerplate's `UserPermission` enum —
 * the backend is the single source of truth and the frontend never invents
 * permissions. Keep this list in sync when the enum changes.
 */
export interface PermissionItem {
  id: string
  name: string
  description: string
}

export interface PermissionGroup {
  name: string
  permissions: PermissionItem[]
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    name: 'Users',
    permissions: [
      { id: 'USER_READ', name: 'Read', description: 'View user details' },
      { id: 'USER_WRITE', name: 'Write', description: 'Update users' },
      { id: 'USER_CREATE', name: 'Create', description: 'Create new users' },
      { id: 'USER_UPDATE', name: 'Update', description: 'Edit user information' },
      { id: 'USER_DELETE', name: 'Delete', description: 'Delete users' },
      { id: 'USER_ENABLE', name: 'Enable/Disable', description: 'Enable or disable user accounts' },
      { id: 'USER_ASSIGN_ROLE', name: 'Assign Role', description: 'Assign or remove roles on users' },
    ],
  },
  {
    name: 'Roles',
    permissions: [
      { id: 'ROLE_READ', name: 'Read', description: 'View role details' },
      { id: 'ROLE_WRITE', name: 'Write', description: 'Create and update roles' },
      { id: 'ROLE_DELETE', name: 'Delete', description: 'Delete roles' },
      { id: 'ROLE_ASSIGN_PERMISSION', name: 'Assign Permissions', description: 'Add or remove permissions on roles' },
    ],
  },
  {
    name: 'Tenants',
    permissions: [
      { id: 'TENANT_READ', name: 'Read', description: 'View tenant details' },
      { id: 'TENANT_CREATE', name: 'Create', description: 'Create new tenants' },
      { id: 'TENANT_UPDATE', name: 'Update', description: 'Edit tenant information' },
      { id: 'TENANT_DELETE', name: 'Delete', description: 'Delete tenants' },
    ],
  },
  {
    name: 'Departments',
    permissions: [
      { id: 'DEPARTMENT_READ', name: 'Read', description: 'View department details' },
      { id: 'DEPARTMENT_CREATE', name: 'Create', description: 'Create new departments' },
      { id: 'DEPARTMENT_UPDATE', name: 'Update', description: 'Edit department information' },
      { id: 'DEPARTMENT_DELETE', name: 'Delete', description: 'Delete departments' },
    ],
  },
  {
    name: 'Expenses',
    permissions: [
      { id: 'EXPENSE_READ', name: 'Read', description: 'View expenses' },
      { id: 'EXPENSE_READ_ALL', name: 'Read All', description: 'View expenses across the tenant' },
      { id: 'EXPENSE_CREATE', name: 'Create', description: 'Create new expenses' },
      { id: 'EXPENSE_UPDATE', name: 'Update', description: 'Edit expense information' },
      { id: 'EXPENSE_DELETE', name: 'Delete', description: 'Delete expenses' },
      { id: 'EXPENSE_APPROVE', name: 'Approve', description: 'Approve expenses' },
      { id: 'EXPENSE_REJECT', name: 'Reject', description: 'Reject expenses' },
      { id: 'EXPENSE_PROCESS', name: 'Process', description: 'Process approved expenses' },
    ],
  },
  {
    name: 'MFA',
    permissions: [
      { id: 'MFA_MANAGE', name: 'Manage', description: 'Manage multi-factor authentication' },
    ],
  },
  {
    name: 'Reporting & Audit',
    permissions: [
      { id: 'REPORT_READ', name: 'Read Reports', description: 'View reports' },
      { id: 'AUDIT_LOG_READ', name: 'Read Audit Logs', description: 'View audit logs' },
    ],
  },
]
