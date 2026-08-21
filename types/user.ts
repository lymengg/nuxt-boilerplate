export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  tenantId: string
  tenantName: string
  departmentId: string | null
  departmentName: string | null
  roles: RoleSummary[]
  enabled: boolean
  mfaEnabled: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

export interface RoleSummary {
  id: string
  name: string
}

export interface CreateUserRequest {
  email: string
  firstName: string
  lastName: string
  password: string
  departmentId?: string
  roleIds: string[]
}

export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  departmentId?: string | null
  enabled?: boolean
}

export interface UserListParams {
  page?: number
  size?: number
  sort?: string
  direction?: 'asc' | 'desc'
  search?: string
  enabled?: boolean
  tenantId?: string
  departmentId?: string
  roleId?: string
}
