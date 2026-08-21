import type { AuditLog, AuditLogListParams } from '~/types/audit'
import type { Page } from '~/types/api'
import { auditService } from '~/services/audit.service'

export function useAuditLogs() {
  const auditLogs = ref<AuditLog[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = usePagination()

  async function fetchAuditLogs(params: AuditLogListParams = {}) {
    loading.value = true
    error.value = null

    try {
      const query: AuditLogListParams = {
        page: pagination.state.page,
        size: pagination.state.size,
        sort: pagination.state.sort,
        ...params,
      }

      const response = await auditService.list(query)

      if (response.success && response.data) {
        auditLogs.value = response.data.content
        pagination.updateFromResponse(response.data.totalElements, response.data.totalPages)
      }
      else {
        throw new Error(response.message || 'Failed to fetch audit logs')
      }
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch audit logs'
      auditLogs.value = []
    }
    finally {
      loading.value = false
    }
  }

  async function getAuditLog(id: string): Promise<AuditLog | null> {
    try {
      const response = await auditService.get(id)
      if (response.success && response.data) {
        return response.data
      }
      return null
    }
    catch {
      return null
    }
  }

  return {
    auditLogs,
    loading,
    error,
    pagination,
    fetchAuditLogs,
    getAuditLog,
  }
}
