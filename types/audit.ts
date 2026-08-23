/**
 * Audit log DTOs — mirror spring-boilerplate's AuditLogResponse.
 * The backend list endpoint only supports pagination (no filters).
 */
export interface AuditLog {
  id: number
  actorId: number | null
  actorUsername: string | null
  tenantId: number | null
  action: string
  resourceType: string
  resourceId: string | null
  /** Free-form detail text (may contain JSON). */
  details: string | null
  timestamp: string
}

export interface AuditLogListParams {
  page?: number
  size?: number
  sort?: string
}
