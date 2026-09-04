import type { Department, DepartmentListParams } from '~/types/department'
import { departmentService } from '~/services/department.service'

const ALL_DEPARTMENTS_SIZE = 100

export function useDepartments() {
  const { getErrorMessage } = useApiError()
  const departments = ref<Department[]>([])
  const allDepartments = ref<Department[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  // The backend Department entity has no timestamp columns — sort by name.
  const pagination = usePagination(20, 'name,asc')

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
      error.value = getErrorMessage(e)
      departments.value = []
    }
    finally {
      loading.value = false
    }
  }

  /** Dropdown source — the backend has no `/all` endpoint, so page through. */
  async function fetchAllDepartments() {
    try {
      const response = await departmentService.list({ page: 0, size: ALL_DEPARTMENTS_SIZE, sort: 'name,asc' })
      if (response.success && response.data) {
        allDepartments.value = response.data.content
      }
    }
    catch {
      allDepartments.value = []
    }
  }

  async function getDepartment(id: number | string): Promise<Department | null> {
    try {
      const response = await departmentService.get(id)
      return response.success && response.data ? response.data : null
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

  async function updateDepartment(id: number | string, data: Parameters<typeof departmentService.update>[1]) {
    const response = await departmentService.update(id, data)
    if (response.success) {
      await fetchDepartments()
      await fetchAllDepartments()
    }
    return response
  }

  async function deleteDepartment(id: number | string) {
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
