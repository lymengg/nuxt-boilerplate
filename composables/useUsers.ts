import type { User, UserListParams } from '~/types/user'
import { userService } from '~/services/user.service'

export function useUsers() {
  const { getErrorMessage } = useApiError()
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = usePagination(20, 'createdAt,desc')

  async function fetchUsers(params: UserListParams = {}) {
    loading.value = true
    error.value = null

    try {
      const query: UserListParams = {
        page: pagination.state.page,
        size: pagination.state.size,
        sort: pagination.state.sort,
        ...params,
      }

      const response = await userService.list(query)

      if (response.success && response.data) {
        users.value = response.data.content
        pagination.updateFromResponse(response.data.totalElements, response.data.totalPages)
      }
      else {
        throw new Error(response.message || 'Failed to fetch users')
      }
    }
    catch (e) {
      error.value = getErrorMessage(e)
      users.value = []
    }
    finally {
      loading.value = false
    }
  }

  async function getUser(id: number | string): Promise<User | null> {
    try {
      const response = await userService.get(id)
      return response.success && response.data ? response.data : null
    }
    catch {
      return null
    }
  }

  async function createUser(data: Parameters<typeof userService.create>[0]) {
    const response = await userService.create(data)
    if (response.success) {
      await fetchUsers()
    }
    return response
  }

  async function updateUser(id: number | string, data: Parameters<typeof userService.update>[1]) {
    const response = await userService.update(id, data)
    if (response.success) {
      await fetchUsers()
    }
    return response
  }

  async function deleteUser(id: number | string) {
    const response = await userService.delete(id)
    if (response.success) {
      await fetchUsers()
    }
    return response
  }

  /** Single toggle endpoint: `{ enabled }`. */
  async function setEnabled(id: number | string, enabled: boolean) {
    const response = await userService.setEnabled(id, { enabled })
    if (response.success) {
      await fetchUsers()
    }
    return response
  }

  async function assignRole(id: number | string, roleName: string) {
    const response = await userService.assignRole(id, { roleName })
    if (response.success) {
      await fetchUsers()
    }
    return response
  }

  async function removeRole(id: number | string, roleName: string) {
    const response = await userService.removeRole(id, { roleName })
    if (response.success) {
      await fetchUsers()
    }
    return response
  }

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    setEnabled,
    assignRole,
    removeRole,
  }
}
