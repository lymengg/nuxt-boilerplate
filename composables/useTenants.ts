import type { Tenant, TenantListParams } from '~/types/tenant'
import type { Page } from '~/types/api'
import { tenantService } from '~/services/tenant.service'

export function useTenants() {
  const tenants = ref<Tenant[]>([])
  const allTenants = ref<Tenant[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = usePagination()

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
      error.value = e instanceof Error ? e.message : 'Failed to fetch tenants'
      tenants.value = []
    }
    finally {
      loading.value = false
    }
  }

  async function fetchAllTenants() {
    try {
      const response = await tenantService.getAll()
      if (response.success && response.data) {
        allTenants.value = response.data
      }
    }
    catch {
      allTenants.value = []
    }
  }

  async function getTenant(id: string): Promise<Tenant | null> {
    try {
      const response = await tenantService.get(id)
      if (response.success && response.data) {
        return response.data
      }
      return null
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

  async function updateTenant(id: string, data: Parameters<typeof tenantService.update>[1]) {
    const response = await tenantService.update(id, data)
    if (response.success) {
      await fetchTenants()
      await fetchAllTenants()
    }
    return response
  }

  async function deleteTenant(id: string) {
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
