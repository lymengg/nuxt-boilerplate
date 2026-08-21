export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  createdAt: string
  updatedAt: string
}

export interface Permission {
  id: string
  name: string
  description: string
  group: string
}

export interface CreateRoleRequest {
  name: string
  description: string
  permissionIds: string[]
}

export interface UpdateRoleRequest {
  name?: string
  description?: string
  permissionIds?: string[]
}

export interface RoleListParams {
  page?: number
  size?: number
  sort?: string
  search?: string
}
