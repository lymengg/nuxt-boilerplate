import type { ApiResponse, Page } from '~/types/api'
import type { CreateRoleRequest, Role, RoleListParams, UpdateRoleRequest } from '~/types/role'

export const roleService = {
  async list(params: RoleListParams): Promise<ApiResponse<Page<Role>>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Page<Role>>>('/api/roles', {
      query: params,
    })
  },

  async getAll(): Promise<ApiResponse<Role[]>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Role[]>>('/api/roles/all')
  },

  async get(id: string): Promise<ApiResponse<Role>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Role>>(`/api/roles/${id}`)
  },

  async create(data: CreateRoleRequest): Promise<ApiResponse<Role>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Role>>('/api/roles', {
      method: 'POST',
      body: data,
    })
  },

  async update(id: string, data: UpdateRoleRequest): Promise<ApiResponse<Role>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Role>>(`/api/roles/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<void>>(`/api/roles/${id}`, {
      method: 'DELETE',
    })
  },

  async assignPermissions(id: string, permissionIds: string[]): Promise<ApiResponse<Role>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Role>>(`/api/roles/${id}/permissions`, {
      method: 'PUT',
      body: { permissionIds },
    })
  },
}
