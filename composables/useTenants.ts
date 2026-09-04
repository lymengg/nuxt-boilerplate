import type { Tenant, TenantListParams } from '~/types/tenant'
import { tenantService } from '~/services/tenant.service'

const ALL_TENANTS_SIZE = 100

export function useTenants() {
  const { getErrorMessage } = useApiError()
  const tenants = ref<Tenant[]>([])
  const allTenants = ref<Tenant[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = usePagination(20, 'createdAt,desc')

  async function fetchTenants(params: TenantListParams = {}) {
    loading.value = true
    error.value = null

    try {
      const query: TenantListParams = {
        page: pagination.state.page,
        size: pagination.state.size,
        sort: pagination.state.sort,
        ...params,
      }

      const response = await tenantService.list(query)

      if (response.success && response.data) {
        tenants.value = response.data.content
        pagination.updateFromResponse(response.data.totalElements, response.data.totalPages)
      }
      else {
        throw new Error(response.message || 'Failed to fetch tenants')
      }
    }
    catch (e) {
      error.value = getErrorMessage(e)
      tenants.value = []
    }
    finally {
      loading.value = false
    }
  }

  /** Dropdown source — the backend has no `/all` endpoint, so page through. */
  async function fetchAllTenants() {
    try {
      const response = await tenantService.list({ page: 0, size: ALL_TENANTS_SIZE, sort: 'name,asc' })
      if (response.success && response.data) {
        allTenants.value = response.data.content
      }
    }
    catch {
      allTenants.value = []
    }
  }

  async function getTenant(id: number | string): Promise<Tenant | null> {
    try {
      const response = await tenantService.get(id)
      return response.success && response.data ? response.data : null
    }
    catch {
      return null
    }
  }

  async function createTenant(data: Parameters<typeof tenantService.create>[0]) {
    const response = await tenantService.create(data)
    if (response.success) {
      await fetchTenants()
      await fetchAllTenants()
    }
    return response
  }

  async function updateTenant(id: number | string, data: Parameters<typeof tenantService.update>[1]) {
    const response = await tenantService.update(id, data)
    if (response.success) {
      await fetchTenants()
      await fetchAllTenants()
    }
    return response
  }

  async function deleteTenant(id: number | string) {
    const response = await tenantService.delete(id)
    if (response.success) {
      await fetchTenants()
      await fetchAllTenants()
    }
    return response
  }

  return {
    tenants,
    allTenants,
    loading,
    error,
    pagination,
    fetchTenants,
    fetchAllTenants,
    getTenant,
    createTenant,
    updateTenant,
    deleteTenant,
  }
}
