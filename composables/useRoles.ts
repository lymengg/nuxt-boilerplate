import type { Role, RoleListParams } from '~/types/role'
import { roleService } from '~/services/role.service'

const ALL_ROLES_SIZE = 100

export function useRoles() {
  const roles = ref<Role[]>([])
  const allRoles = ref<Role[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  // The backend Role entity has no timestamp columns — sort by name.
  const pagination = usePagination(20, 'name,asc')

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

  /** Dropdown source — the backend has no `/all` endpoint, so page through. */
  async function fetchAllRoles() {
    try {
      const response = await roleService.list({ page: 0, size: ALL_ROLES_SIZE, sort: 'name,asc' })
      if (response.success && response.data) {
        allRoles.value = response.data.content
      }
    }
    catch {
      allRoles.value = []
    }
  }

  async function getRole(id: number | string): Promise<Role | null> {
    try {
      const response = await roleService.get(id)
      return response.success && response.data ? response.data : null
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

  async function updateRole(id: number | string, data: Parameters<typeof roleService.update>[1]) {
    const response = await roleService.update(id, data)
    if (response.success) {
      await fetchRoles()
      await fetchAllRoles()
    }
    return response
  }

  async function deleteRole(id: number | string) {
    const response = await roleService.delete(id)
    if (response.success) {
      await fetchRoles()
      await fetchAllRoles()
    }
    return response
  }

  /** Add a single permission; the backend has no bulk permission endpoint. */
  async function addPermission(id: number | string, permission: string) {
    const response = await roleService.addPermission(id, { permission })
    if (response.success) {
      await fetchRoles()
      await fetchAllRoles()
    }
    return response
  }

  async function removePermission(id: number | string, permission: string) {
    const response = await roleService.removePermission(id, { permission })
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
    addPermission,
    removePermission,
  }
}
