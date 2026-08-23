import type { ApiResponse, Page } from '~/types/api'
import type { CreateUserRequest, UpdateUserRequest, User, UserEnableRequest, UserListParams, UserRoleAssignmentRequest } from '~/types/user'

export const userService = {
  async list(params: UserListParams): Promise<ApiResponse<Page<User>>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Page<User>>>('/api/management/users', {
      query: params,
    })
  },

  async get(id: number | string): Promise<ApiResponse<User>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<User>>(`/api/management/users/${id}`)
  },

  async create(data: CreateUserRequest): Promise<ApiResponse<User>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<User>>('/api/management/users', {
      method: 'POST',
      body: data,
    })
  },

  async update(id: number | string, data: UpdateUserRequest): Promise<ApiResponse<User>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<User>>(`/api/management/users/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  async delete(id: number | string): Promise<ApiResponse<void>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<void>>(`/api/management/users/${id}`, {
      method: 'DELETE',
    })
  },

  /** Backend contract: POST /{id}/enable with `{ enabled }` for both states. */
  async setEnabled(id: number | string, data: UserEnableRequest): Promise<ApiResponse<User>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<User>>(`/api/management/users/${id}/enable`, {
      method: 'POST',
      body: data,
    })
  },

  /** Backend contract: assign/remove exactly one role by name. */
  async assignRole(id: number | string, data: UserRoleAssignmentRequest): Promise<ApiResponse<User>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<User>>(`/api/management/users/${id}/roles`, {
      method: 'POST',
      body: data,
    })
  },

  async removeRole(id: number | string, data: UserRoleAssignmentRequest): Promise<ApiResponse<User>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<User>>(`/api/management/users/${id}/roles`, {
      method: 'DELETE',
      body: data,
    })
  },
}
