import type { Tenant, TenantListParams } from '~/types'
import { tenantService } from '~/services/tenant.service'

export function useTenants() {
  const tenants = ref<Tenant[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pagination = usePagination()

  async function fetchTenants(params: Partial<TenantListParams> = {}) {
    isLoading.value = true
    error.value = null

    try {
      const response = await tenantService.list({
        page: pagination.page.value,
        size: pagination.size.value,
        sort: pagination.sort.value,
        direction: pagination.direction.value,
        ...params,
      })

      if (response.success && response.data) {
        tenants.value = response.data.content
        pagination.updateFromResponse(
          response.data.totalElements,
          response.data.totalPages
        )
      } else {
        error.value = response.message || 'Failed to fetch tenants'
      }
    } catch (err: unknown) {
      const apiError = useApiError()
      const parsed = apiError.handleError(err)
      error.value = parsed.message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchAllTenants() {
    isLoading.value = true
    error.value = null

    try {
      const response = await tenantService.getAll()
      if (response.success && response.data) {
        tenants.value = response.data
      } else {
        error.value = response.message || 'Failed to fetch tenants'
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
    tenants,
    isLoading,
    error,
    pagination,
    fetchTenants,
    fetchAllTenants,
  }
}
