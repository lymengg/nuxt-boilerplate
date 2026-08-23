import type { ApiResponse, Page } from '~/types/api'
import type { Role, RoleListParams, RolePermissionRequest, RoleRequest } from '~/types/role'

export const roleService = {
  async list(params: RoleListParams): Promise<ApiResponse<Page<Role>>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Page<Role>>>('/api/management/roles', {
      query: params,
    })
  },

  async get(id: number | string): Promise<ApiResponse<Role>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Role>>(`/api/management/roles/${id}`)
  },

  async create(data: RoleRequest): Promise<ApiResponse<Role>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Role>>('/api/management/roles', {
      method: 'POST',
      body: data,
    })
  },

  /** Update uses the same full body as create (RoleCreateRequest). */
  async update(id: number | string, data: RoleRequest): Promise<ApiResponse<Role>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Role>>(`/api/management/roles/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  async delete(id: number | string): Promise<ApiResponse<void>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<void>>(`/api/management/roles/${id}`, {
      method: 'DELETE',
    })
  },

  /** Backend contract: add/remove exactly one permission by enum name. */
  async addPermission(id: number | string, data: RolePermissionRequest): Promise<ApiResponse<Role>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Role>>(`/api/management/roles/${id}/permissions`, {
      method: 'POST',
      body: data,
    })
  },

  async removePermission(id: number | string, data: RolePermissionRequest): Promise<ApiResponse<Role>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Role>>(`/api/management/roles/${id}/permissions`, {
      method: 'DELETE',
      body: data,
    })
  },
}
