export interface PermissionGroup {
  name: string
  permissions: PermissionItem[]
}

export interface PermissionItem {
  id: string
  name: string
  description: string
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    name: 'Users',
    permissions: [
      { id: 'USER_CREATE', name: 'Create', description: 'Create new users' },
      { id: 'USER_READ', name: 'Read', description: 'View user details' },
      { id: 'USER_UPDATE', name: 'Update', description: 'Edit user information' },
      { id: 'USER_DELETE', name: 'Delete', description: 'Delete users' },
      { id: 'USER_ENABLE_DISABLE', name: 'Enable/Disable', description: 'Enable or disable user accounts' },
    ],
  },
  {
    name: 'Roles',
    permissions: [
      { id: 'ROLE_CREATE', name: 'Create', description: 'Create new roles' },
      { id: 'ROLE_READ', name: 'Read', description: 'View role details' },
      { id: 'ROLE_UPDATE', name: 'Update', description: 'Edit role information' },
      { id: 'ROLE_DELETE', name: 'Delete', description: 'Delete roles' },
      { id: 'ROLE_ASSIGN_PERMISSION', name: 'Assign Permissions', description: 'Assign permissions to roles' },
    ],
  },
  {
    name: 'Tenants',
    permissions: [
      { id: 'TENANT_CREATE', name: 'Create', description: 'Create new tenants' },
      { id: 'TENANT_READ', name: 'Read', description: 'View tenant details' },
      { id: 'TENANT_UPDATE', name: 'Update', description: 'Edit tenant information' },
      { id: 'TENANT_DELETE', name: 'Delete', description: 'Delete tenants' },
    ],
  },
  {
    name: 'Departments',
    permissions: [
      { id: 'DEPARTMENT_CREATE', name: 'Create', description: 'Create new departments' },
      { id: 'DEPARTMENT_READ', name: 'Read', description: 'View department details' },
      { id: 'DEPARTMENT_UPDATE', name: 'Update', description: 'Edit department information' },
      { id: 'DEPARTMENT_DELETE', name: 'Delete', description: 'Delete departments' },
    ],
  },
  {
    name: 'Expenses',
    permissions: [
      { id: 'EXPENSE_CREATE', name: 'Create', description: 'Create new expenses' },
      { id: 'EXPENSE_READ', name: 'Read', description: 'View expense details' },
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
      { id: 'MFA_ENABLE', name: 'Enable', description: 'Enable MFA for users' },
      { id: 'MFA_DISABLE', name: 'Disable', description: 'Disable MFA for users' },
    ],
  },
  {
    name: 'Audit',
    permissions: [
      { id: 'AUDIT_LOG_READ', name: 'Read', description: 'View audit logs' },
    ],
  },
]
