/**
 * Tenant DTOs — mirror spring-boilerplate's TenantResponse,
 * TenantCreateRequest, TenantUpdateRequest and TenantStatus.
 */
export type TenantStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

export interface Tenant {
  id: number
  name: string
  status: TenantStatus
  createdAt: string
}

export interface CreateTenantRequest {
  name: string
  status: TenantStatus
}

/** Update uses the same full body as create on the backend. */
export interface UpdateTenantRequest {
  name: string
  status: TenantStatus
}

export interface TenantListParams {
  page?: number
  size?: number
  sort?: string
  name?: string
}

export const TENANT_STATUS_CONFIG: Record<TenantStatus, { label: string, severity: string }> = {
  ACTIVE: { label: 'Active', severity: 'success' },
  INACTIVE: { label: 'Inactive', severity: 'danger' },
  SUSPENDED: { label: 'Suspended', severity: 'warn' },
}
