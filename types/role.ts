/**
 * Role DTOs — mirror spring-boilerplate's RoleResponse, RoleCreateRequest
 * (used for both create and update) and RolePermissionRequest.
 */
export interface Role {
  id: number
  name: string
  title: string | null
  description: string | null
  /** UserPermission enum names, e.g. "EXPENSE_APPROVE". */
  permissions: string[]
}

/** Create and update share the same body on the backend (RoleCreateRequest). */
export interface RoleRequest {
  name: string
  title?: string
  description?: string
}

/** Single permission add/remove (RolePermissionRequest). */
export interface RolePermissionRequest {
  permission: string
}

export interface RoleListParams {
  page?: number
  size?: number
  sort?: string
}
