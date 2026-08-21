import type { User, UserListParams } from '~/types/user'
import type { Page } from '~/types/api'
import { userService } from '~/services/user.service'

export function useUsers() {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = usePagination()

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
      error.value = e instanceof Error ? e.message : 'Failed to fetch users'
      users.value = []
    }
    finally {
      loading.value = false
    }
  }

  async function getUser(id: string): Promise<User | null> {
    try {
      const response = await userService.get(id)
      if (response.success && response.data) {
        return response.data
      }
      return null
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

  async function updateUser(id: string, data: Parameters<typeof userService.update>[1]) {
    const response = await userService.update(id, data)
    if (response.success) {
      await fetchUsers()
    }
    return response
  }

  async function deleteUser(id: string) {
    const response = await userService.delete(id)
    if (response.success) {
      await fetchUsers()
    }
    return response
  }

  async function enableUser(id: string) {
    const response = await userService.enable(id)
    if (response.success) {
      await fetchUsers()
    }
    return response
  }

  async function disableUser(id: string) {
    const response = await userService.disable(id)
    if (response.success) {
      await fetchUsers()
    }
    return response
  }

  async function assignRoles(id: string, roleIds: string[]) {
    const response = await userService.assignRoles(id, roleIds)
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
    enableUser,
    disableUser,
    assignRoles,
  }
}
