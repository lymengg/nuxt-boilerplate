import type { ApiResponse, Page } from '~/types/api'
import type { CreateTenantRequest, Tenant, TenantListParams, UpdateTenantRequest } from '~/types/tenant'

export const tenantService = {
  async list(params: TenantListParams): Promise<ApiResponse<Page<Tenant>>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Page<Tenant>>>('/api/tenants', {
      query: params,
    })
  },

  async getAll(): Promise<ApiResponse<Tenant[]>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Tenant[]>>('/api/tenants/all')
  },

  async get(id: string): Promise<ApiResponse<Tenant>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Tenant>>(`/api/tenants/${id}`)
  },

  async create(data: CreateTenantRequest): Promise<ApiResponse<Tenant>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Tenant>>('/api/tenants', {
      method: 'POST',
      body: data,
    })
  },

  async update(id: string, data: UpdateTenantRequest): Promise<ApiResponse<Tenant>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Tenant>>(`/api/tenants/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<void>>(`/api/tenants/${id}`, {
      method: 'DELETE',
    })
  },
}
