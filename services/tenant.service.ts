import { apiFetch } from '~/utils/api'
import type {
  ApiResponse,
  Page,
  Tenant,
  TenantListParams,
  CreateTenantRequest,
  UpdateTenantRequest,
} from '~/types'

export const tenantService = {
  async list(params: TenantListParams): Promise<ApiResponse<Page<Tenant>>> {
    return apiFetch<Page<Tenant>>('/api/tenants', { query: params as Record<string, unknown> })
  },

  async getAll(): Promise<ApiResponse<Tenant[]>> {
    return apiFetch<Tenant[]>('/api/tenants/all')
  },

  async get(id: string): Promise<ApiResponse<Tenant>> {
    return apiFetch<Tenant>(`/api/tenants/${id}`)
  },

  async create(data: CreateTenantRequest): Promise<ApiResponse<Tenant>> {
    return apiFetch<Tenant>('/api/tenants', {
      method: 'POST',
      body: data,
    })
  },

  async update(id: string, data: UpdateTenantRequest): Promise<ApiResponse<Tenant>> {
    return apiFetch<Tenant>(`/api/tenants/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiFetch<void>(`/api/tenants/${id}`, {
      method: 'DELETE',
    })
  },
}
