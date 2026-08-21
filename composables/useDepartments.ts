import type { Department, DepartmentListParams } from '~/types/department'
import type { Page } from '~/types/api'
import { departmentService } from '~/services/department.service'

export function useDepartments() {
  const departments = ref<Department[]>([])
  const allDepartments = ref<Department[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = usePagination()

  async function fetchDepartments(params: DepartmentListParams = {}) {
    loading.value = true
    error.value = null

    try {
      const query: DepartmentListParams = {
        page: pagination.state.page,
        size: pagination.state.size,
        sort: pagination.state.sort,
        ...params,
      }

      const response = await departmentService.list(query)

      if (response.success && response.data) {
        departments.value = response.data.content
        pagination.updateFromResponse(response.data.totalElements, response.data.totalPages)
      }
      else {
        throw new Error(response.message || 'Failed to fetch departments')
      }
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch departments'
      departments.value = []
    }
    finally {
      loading.value = false
    }
  }

  async function fetchAllDepartments(tenantId?: string) {
    try {
      const response = await departmentService.getAll(tenantId)
      if (response.success && response.data) {
        allDepartments.value = response.data
      }
    }
    catch {
      allDepartments.value = []
    }
  }

  async function getDepartment(id: string): Promise<Department | null> {
    try {
      const response = await departmentService.get(id)
      if (response.success && response.data) {
        return response.data
      }
      return null
    }
    catch {
      return null
    }
  }

  async function createDepartment(data: Parameters<typeof departmentService.create>[0]) {
    const response = await departmentService.create(data)
    if (response.success) {
      await fetchDepartments()
      await fetchAllDepartments()
    }
    return response
  }

  async function updateDepartment(id: string, data: Parameters<typeof departmentService.update>[1]) {
    const response = await departmentService.update(id, data)
    if (response.success) {
      await fetchDepartments()
      await fetchAllDepartments()
    }
    return response
  }

  async function deleteDepartment(id: string) {
    const response = await departmentService.delete(id)
    if (response.success) {
      await fetchDepartments()
      await fetchAllDepartments()
    }
    return response
  }

  return {
    departments,
    allDepartments,
    loading,
    error,
    pagination,
    fetchDepartments,
    fetchAllDepartments,
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  }
}
