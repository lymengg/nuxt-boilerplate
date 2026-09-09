/**
 * User management DTOs — mirror spring-boilerplate's UserResponse,
 * UserCreateRequest, UserUpdateRequest, UserEnableRequest,
 * UserRoleAssignmentRequest.
 */
export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  enabled: boolean
  accountNonLocked: boolean
  departmentId: number | null
  departmentName: string | null
  roles: string[]
  permissions: string[]
  mfaEnabled: boolean
  mfaMethod: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateUserRequest {
  email: string
  password: string
  firstName?: string
  lastName?: string
  /** Single role name, e.g. "EMPLOYEE" (defaults to EMPLOYEE on the backend). */
  roleName?: string
  /** Only used when creating a user in another tenant (super admin). Ignored for PLATFORM_ADMIN. */
  tenantId?: number
  /** Required for non-PLATFORM_ADMIN roles; ignored for PLATFORM_ADMIN. */
  departmentId?: number
}

export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  departmentId?: number | null
}

export interface UserEnableRequest {
  enabled: boolean
}

export interface UserRoleAssignmentRequest {
  roleName: string
}

export interface UserListParams {
  page?: number
  size?: number
  sort?: string
}
