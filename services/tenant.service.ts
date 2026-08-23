import type { ApiResponse, Page } from '~/types/api'
import type { CreateTenantRequest, Tenant, TenantListParams, UpdateTenantRequest } from '~/types/tenant'

export const tenantService = {
  async list(params: TenantListParams): Promise<ApiResponse<Page<Tenant>>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Page<Tenant>>>('/api/management/tenants', {
      query: params,
    })
  },

  async get(id: number | string): Promise<ApiResponse<Tenant>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Tenant>>(`/api/management/tenants/${id}`)
  },

  async create(data: CreateTenantRequest): Promise<ApiResponse<Tenant>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Tenant>>('/api/management/tenants', {
      method: 'POST',
      body: data,
    })
  },

  /** Update uses the same full body as create. */
  async update(id: number | string, data: UpdateTenantRequest): Promise<ApiResponse<Tenant>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Tenant>>(`/api/management/tenants/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  async delete(id: number | string): Promise<ApiResponse<void>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<void>>(`/api/management/tenants/${id}`, {
      method: 'DELETE',
    })
  },
}
