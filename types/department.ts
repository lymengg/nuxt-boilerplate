/**
 * Department DTOs — mirror spring-boilerplate's DepartmentResponse,
 * DepartmentCreateRequest and DepartmentUpdateRequest.
 */
export interface Department {
  id: number
  name: string
  tenantId: number
  tenantName: string
  managerIds: number[]
  managerUsernames: string[]
}

export interface CreateDepartmentRequest {
  name: string
  tenantId: number
  managerIds?: number[]
}

export interface UpdateDepartmentRequest {
  name: string
  managerIds?: number[]
}

export interface DepartmentListParams {
  page?: number
  size?: number
  sort?: string
}
