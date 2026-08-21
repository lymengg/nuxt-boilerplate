export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  enabled: boolean
  mfaEnabled: boolean
  tenantId: string
  tenantName: string
  departmentId: string | null
  departmentName: string | null
  roles: UserRole[]
  createdAt: string
  updatedAt: string
}

export interface UserRole {
  id: string
  name: string
  description: string
}

export interface CreateUserRequest {
  email: string
  firstName: string
  lastName: string
  password: string
  tenantId: string
  departmentId?: string
  roleIds: string[]
}

export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  departmentId?: string | null
}

export interface UserListParams {
  page?: number
  size?: number
  sort?: string
  search?: string
  enabled?: boolean
  tenantId?: string
  departmentId?: string
  roleId?: string
}
