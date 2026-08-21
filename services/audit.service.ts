import { apiFetch } from '~/utils/api'
import type { ApiResponse, Page, AuditLog, AuditLogListParams } from '~/types'

export const auditService = {
  async list(params: AuditLogListParams): Promise<ApiResponse<Page<AuditLog>>> {
    return apiFetch<Page<AuditLog>>('/api/audit-logs', {
      query: params as Record<string, unknown>,
    })
  },

  async get(id: string): Promise<ApiResponse<AuditLog>> {
    return apiFetch<AuditLog>(`/api/audit-logs/${id}`)
  },
}
