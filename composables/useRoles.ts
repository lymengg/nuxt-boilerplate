import type { Role, RoleListParams } from '~/types/role'
import type { Page } from '~/types/api'
import { roleService } from '~/services/role.service'

export function useRoles() {
  const roles = ref<Role[]>([])
  const allRoles = ref<Role[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = usePagination()

  async function fetchRoles(params: RoleListParams = {}) {
    loading.value = true
    error.value = null

    try {
      const query: RoleListParams = {
        page: pagination.state.page,
        size: pagination.state.size,
        sort: pagination.state.sort,
        ...params,
      }

      const response = await roleService.list(query)

      if (response.success && response.data) {
        roles.value = response.data.content
        pagination.updateFromResponse(response.data.totalElements, response.data.totalPages)
      }
      else {
        throw new Error(response.message || 'Failed to fetch roles')
      }
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch roles'
      roles.value = []
    }
    finally {
      loading.value = false
    }
  }

  async function fetchAllRoles() {
    try {
      const response = await roleService.getAll()
      if (response.success && response.data) {
        allRoles.value = response.data
      }
    }
    catch {
      allRoles.value = []
    }
  }

  async function getRole(id: string): Promise<Role | null> {
    try {
      const response = await roleService.get(id)
      if (response.success && response.data) {
        return response.data
      }
      return null
    }
    catch {
      return null
    }
  }

  async function createRole(data: Parameters<typeof roleService.create>[0]) {
    const response = await roleService.create(data)
    if (response.success) {
      await fetchRoles()
      await fetchAllRoles()
    }
    return response
  }

  async function updateRole(id: string, data: Parameters<typeof roleService.update>[1]) {
    const response = await roleService.update(id, data)
    if (response.success) {
      await fetchRoles()
      await fetchAllRoles()
    }
    return response
  }

  async function deleteRole(id: string) {
    const response = await roleService.delete(id)
    if (response.success) {
      await fetchRoles()
      await fetchAllRoles()
    }
    return response
  }

  async function assignPermissions(id: string, permissionIds: string[]) {
    const response = await roleService.assignPermissions(id, permissionIds)
    if (response.success) {
      await fetchRoles()
      await fetchAllRoles()
    }
    return response
  }

  return {
    roles,
    allRoles,
    loading,
    error,
    pagination,
    fetchRoles,
    fetchAllRoles,
    getRole,
    createRole,
    updateRole,
    deleteRole,
    assignPermissions,
  }
}
