import type { ApiResponse, Page } from '~/types/api'
import type { CreateUserRequest, UpdateUserRequest, User, UserListParams } from '~/types/user'

export const userService = {
  async list(params: UserListParams): Promise<ApiResponse<Page<User>>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Page<User>>>('/api/users', {
      query: params,
    })
  },

  async get(id: string): Promise<ApiResponse<User>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<User>>(`/api/users/${id}`)
  },

  async create(data: CreateUserRequest): Promise<ApiResponse<User>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<User>>('/api/users', {
      method: 'POST',
      body: data,
    })
  },

  async update(id: string, data: UpdateUserRequest): Promise<ApiResponse<User>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<User>>(`/api/users/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<void>>(`/api/users/${id}`, {
      method: 'DELETE',
    })
  },

  async enable(id: string): Promise<ApiResponse<User>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<User>>(`/api/users/${id}/enable`, {
      method: 'POST',
    })
  },

  async disable(id: string): Promise<ApiResponse<User>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<User>>(`/api/users/${id}/disable`, {
      method: 'POST',
    })
  },

  async assignRoles(id: string, roleIds: string[]): Promise<ApiResponse<User>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<User>>(`/api/users/${id}/roles`, {
      method: 'PUT',
      body: { roleIds },
    })
  },
}
