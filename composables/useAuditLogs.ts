import type { AuditLog, AuditLogListParams } from '~/types'
import { auditService } from '~/services/audit.service'

export function useAuditLogs() {
  const auditLogs = ref<AuditLog[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pagination = usePagination()

  async function fetchAuditLogs(params: Partial<AuditLogListParams> = {}) {
    isLoading.value = true
    error.value = null

    try {
      const response = await auditService.list({
        page: pagination.page.value,
        size: pagination.size.value,
        sort: pagination.sort.value,
        direction: pagination.direction.value,
        ...params,
      })

      if (response.success && response.data) {
        auditLogs.value = response.data.content
        pagination.updateFromResponse(
          response.data.totalElements,
          response.data.totalPages
        )
      } else {
        error.value = response.message || 'Failed to fetch audit logs'
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
    auditLogs,
    isLoading,
    error,
    pagination,
    fetchAuditLogs,
  }
}
