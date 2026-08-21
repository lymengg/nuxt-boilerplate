export interface Department {
  id: string
  name: string
  tenantId: string
  tenantName: string
  managerId: string | null
  managerName: string | null
  userCount: number
  createdAt: string
  updatedAt: string
}

export interface CreateDepartmentRequest {
  name: string
  managerId?: string
}

export interface UpdateDepartmentRequest {
  name?: string
  managerId?: string | null
}

export interface DepartmentListParams {
  page?: number
  size?: number
  sort?: string
  direction?: 'asc' | 'desc'
  search?: string
  tenantId?: string
}
