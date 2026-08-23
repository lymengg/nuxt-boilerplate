import type { ApiResponse, Page } from '~/types/api'
import type { AuditLog, AuditLogListParams } from '~/types/audit'

export const auditService = {
  async list(params: AuditLogListParams): Promise<ApiResponse<Page<AuditLog>>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Page<AuditLog>>>('/api/management/audit', {
      query: params,
    })
  },

  async get(id: number | string): Promise<ApiResponse<AuditLog>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<AuditLog>>(`/api/management/audit/${id}`)
  },
}
