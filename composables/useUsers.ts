import type { User, UserListParams } from '~/types'
import { userService } from '~/services/user.service'

export function useUsers() {
  const users = ref<User[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pagination = usePagination()

  async function fetchUsers(params: Partial<UserListParams> = {}) {
    isLoading.value = true
    error.value = null

    try {
      const response = await userService.list({
        page: pagination.page.value,
        size: pagination.size.value,
        sort: pagination.sort.value,
        direction: pagination.direction.value,
        ...params,
      })

      if (response.success && response.data) {
        users.value = response.data.content
        pagination.updateFromResponse(
          response.data.totalElements,
          response.data.totalPages
        )
      } else {
        error.value = response.message || 'Failed to fetch users'
      }
    } catch (err: unknown) {
      const apiError = useApiError()
      const parsed = apiError.handleError(err)
      error.value = parsed.message
    } finally {
      isLoading.value = false
    }
  }

  async function getUser(id: string) {
    isLoading.value = true
    error.value = null

    try {
      const response = await userService.get(id)
      if (response.success && response.data) {
        return response.data
      }
      error.value = response.message || 'Failed to fetch user'
      return null
    } catch (err: unknown) {
      const apiError = useApiError()
      const parsed = apiError.handleError(err)
      error.value = parsed.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    users,
    isLoading,
    error,
    pagination,
    fetchUsers,
    getUser,
  }
}
