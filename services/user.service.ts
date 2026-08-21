import { apiFetch } from '~/utils/api'
import type {
  ApiResponse,
  Page,
  User,
  UserListParams,
  CreateUserRequest,
  UpdateUserRequest,
} from '~/types'

export const userService = {
  async list(params: UserListParams): Promise<ApiResponse<Page<User>>> {
    return apiFetch<Page<User>>('/api/users', { query: params as Record<string, unknown> })
  },

  async get(id: string): Promise<ApiResponse<User>> {
    return apiFetch<User>(`/api/users/${id}`)
  },

  async create(data: CreateUserRequest): Promise<ApiResponse<User>> {
    return apiFetch<User>('/api/users', {
      method: 'POST',
      body: data,
    })
  },

  async update(id: string, data: UpdateUserRequest): Promise<ApiResponse<User>> {
    return apiFetch<User>(`/api/users/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  async enable(id: string): Promise<ApiResponse<User>> {
    return apiFetch<User>(`/api/users/${id}/enable`, {
      method: 'POST',
    })
  },

  async disable(id: string): Promise<ApiResponse<User>> {
    return apiFetch<User>(`/api/users/${id}/disable`, {
      method: 'POST',
    })
  },

  async assignRoles(id: string, roleIds: string[]): Promise<ApiResponse<User>> {
    return apiFetch<User>(`/api/users/${id}/roles`, {
      method: 'PUT',
      body: { roleIds },
    })
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiFetch<void>(`/api/users/${id}`, {
      method: 'DELETE',
    })
  },
}
