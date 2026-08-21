import { apiFetch } from '~/utils/api'
import type {
  ApiResponse,
  Page,
  Department,
  DepartmentListParams,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from '~/types'

export const departmentService = {
  async list(params: DepartmentListParams): Promise<ApiResponse<Page<Department>>> {
    return apiFetch<Page<Department>>('/api/departments', {
      query: params as Record<string, unknown>,
    })
  },

  async getAll(): Promise<ApiResponse<Department[]>> {
    return apiFetch<Department[]>('/api/departments/all')
  },

  async get(id: string): Promise<ApiResponse<Department>> {
    return apiFetch<Department>(`/api/departments/${id}`)
  },

  async create(data: CreateDepartmentRequest): Promise<ApiResponse<Department>> {
    return apiFetch<Department>('/api/departments', {
      method: 'POST',
      body: data,
    })
  },

  async update(id: string, data: UpdateDepartmentRequest): Promise<ApiResponse<Department>> {
    return apiFetch<Department>(`/api/departments/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiFetch<void>(`/api/departments/${id}`, {
      method: 'DELETE',
    })
  },
}
