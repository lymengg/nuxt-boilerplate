export interface Permission {
  id: string
  name: string
  description: string
  category: PermissionCategory
}

export type PermissionCategory =
  | 'USERS'
  | 'ROLES'
  | 'TENANTS'
  | 'DEPARTMENTS'
  | 'EXPENSES'
  | 'MFA'
  | 'REPORTS'
  | 'AUDIT'

export const PERMISSION_CATEGORIES: Record<PermissionCategory, string> = {
  USERS: 'User Management',
  ROLES: 'Role Management',
  TENANTS: 'Tenant Management',
  DEPARTMENTS: 'Department Management',
  EXPENSES: 'Expense Management',
  MFA: 'Multi-Factor Authentication',
  REPORTS: 'Reports',
  AUDIT: 'Audit Logs',
}
