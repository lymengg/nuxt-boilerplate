import type { Department, DepartmentListParams } from '~/types'
import { departmentService } from '~/services/department.service'

export function useDepartments() {
  const departments = ref<Department[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pagination = usePagination()

  async function fetchDepartments(params: Partial<DepartmentListParams> = {}) {
    isLoading.value = true
    error.value = null

    try {
      const response = await departmentService.list({
        page: pagination.page.value,
        size: pagination.size.value,
        sort: pagination.sort.value,
        direction: pagination.direction.value,
        ...params,
      })

      if (response.success && response.data) {
        departments.value = response.data.content
        pagination.updateFromResponse(
          response.data.totalElements,
          response.data.totalPages
        )
      } else {
        error.value = response.message || 'Failed to fetch departments'
      }
    } catch (err: unknown) {
      const apiError = useApiError()
      const parsed = apiError.handleError(err)
      error.value = parsed.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchAllDepartments() {
    isLoading.value = true
    error.value = null

    try {
      const response = await departmentService.getAll()
      if (response.success && response.data) {
        departments.value = response.data
      } else {
        error.value = response.message || 'Failed to fetch departments'
      }
    } catch (err: unknown) {
      const apiError = useApiError()
      const parsed = apiError.handleError(err)
      error.value = parsed.message
    } finally {
      isLoading.value = false
    }
  }

  return {
    departments,
    isLoading,
    error,
    pagination,
    fetchDepartments,
    fetchAllDepartments,
  }
}
