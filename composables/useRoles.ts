import type { Role } from '~/types'
import { roleService } from '~/services/role.service'

export function useRoles() {
  const roles = ref<Role[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchRoles() {
    isLoading.value = true
    error.value = null

    try {
      const response = await roleService.getAll()
      if (response.success && response.data) {
        roles.value = response.data
      } else {
        error.value = response.message || 'Failed to fetch roles'
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
    roles,
    isLoading,
    error,
    fetchRoles,
  }
}
