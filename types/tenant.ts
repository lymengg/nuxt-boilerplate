export interface Tenant {
  id: string
  name: string
  domain: string
  enabled: boolean
  userCount: number
  createdAt: string
  updatedAt: string
}

export interface CreateTenantRequest {
  name: string
  domain: string
}

export interface UpdateTenantRequest {
  name?: string
  domain?: string
  enabled?: boolean
}

export interface TenantListParams {
  page?: number
  size?: number
  sort?: string
  direction?: 'asc' | 'desc'
  search?: string
  enabled?: boolean
}
