import { apiFetch } from '~/utils/api'
import type {
  ApiResponse,
  Page,
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  AssignPermissionsRequest,
} from '~/types'

export const roleService = {
  async list(params?: { page?: number; size?: number }): Promise<ApiResponse<Page<Role>>> {
    return apiFetch<Page<Role>>('/api/roles', { query: params as Record<string, unknown> })
  },

  async getAll(): Promise<ApiResponse<Role[]>> {
    return apiFetch<Role[]>('/api/roles/all')
  },

  async get(id: string): Promise<ApiResponse<Role>> {
    return apiFetch<Role>(`/api/roles/${id}`)
  },

  async create(data: CreateRoleRequest): Promise<ApiResponse<Role>> {
    return apiFetch<Role>('/api/roles', {
      method: 'POST',
      body: data,
    })
  },

  async update(id: string, data: UpdateRoleRequest): Promise<ApiResponse<Role>> {
    return apiFetch<Role>(`/api/roles/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  async assignPermissions(id: string, data: AssignPermissionsRequest): Promise<ApiResponse<Role>> {
    return apiFetch<Role>(`/api/roles/${id}/permissions`, {
      method: 'PUT',
      body: data,
    })
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiFetch<void>(`/api/roles/${id}`, {
      method: 'DELETE',
    })
  },
}
