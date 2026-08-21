import type { ApiResponse, Page } from '~/types/api'
import type { CreateDepartmentRequest, Department, DepartmentListParams, UpdateDepartmentRequest } from '~/types/department'

export const departmentService = {
  async list(params: DepartmentListParams): Promise<ApiResponse<Page<Department>>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Page<Department>>>('/api/departments', {
      query: params,
    })
  },

  async getAll(tenantId?: string): Promise<ApiResponse<Department[]>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Department[]>>('/api/departments/all', {
      query: tenantId ? { tenantId } : undefined,
    })
  },

  async get(id: string): Promise<ApiResponse<Department>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Department>>(`/api/departments/${id}`)
  },

  async create(data: CreateDepartmentRequest): Promise<ApiResponse<Department>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Department>>('/api/departments', {
      method: 'POST',
      body: data,
    })
  },

  async update(id: string, data: UpdateDepartmentRequest): Promise<ApiResponse<Department>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Department>>(`/api/departments/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<void>>(`/api/departments/${id}`, {
      method: 'DELETE',
    })
  },
}
