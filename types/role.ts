export interface Role {
  id: string
  name: string
  description: string
  permissions: PermissionSummary[]
  userCount: number
  createdAt: string
  updatedAt: string
}

export interface PermissionSummary {
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

export interface CreateRoleRequest {
  name: string
  description: string
}

export interface UpdateRoleRequest {
  name?: string
  description?: string
}

export interface AssignPermissionsRequest {
  permissionIds: string[]
}
