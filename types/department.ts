export interface Department {
  id: string
  name: string
  description: string
  tenantId: string
  tenantName: string
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateDepartmentRequest {
  name: string
  description: string
  tenantId: string
}

export interface UpdateDepartmentRequest {
  name?: string
  description?: string
  enabled?: boolean
}

export interface DepartmentListParams {
  page?: number
  size?: number
  sort?: string
  search?: string
  tenantId?: string
  enabled?: boolean
}
