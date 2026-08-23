import type { ApiResponse, Page } from '~/types/api'
import type { CreateDepartmentRequest, Department, DepartmentListParams, UpdateDepartmentRequest } from '~/types/department'

export const departmentService = {
  async list(params: DepartmentListParams): Promise<ApiResponse<Page<Department>>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Page<Department>>>('/api/management/departments', {
      query: params,
    })
  },

  async get(id: number | string): Promise<ApiResponse<Department>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Department>>(`/api/management/departments/${id}`)
  },

  async create(data: CreateDepartmentRequest): Promise<ApiResponse<Department>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Department>>('/api/management/departments', {
      method: 'POST',
      body: data,
    })
  },

  async update(id: number | string, data: UpdateDepartmentRequest): Promise<ApiResponse<Department>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Department>>(`/api/management/departments/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  async delete(id: number | string): Promise<ApiResponse<void>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<void>>(`/api/management/departments/${id}`, {
      method: 'DELETE',
    })
  },
}
