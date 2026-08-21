export interface AuditLog {
  id: string
  action: string
  resourceType: string
  resourceId: string
  actor: AuditActor
  tenantId: string
  tenantName: string
  result: 'SUCCESS' | 'FAILURE'
  metadata: Record<string, unknown>
  ipAddress: string
  userAgent: string
  createdAt: string
}

export interface AuditActor {
  id: string
  email: string
  firstName: string
  lastName: string
}

export interface AuditLogListParams {
  page?: number
  size?: number
  sort?: string
  direction?: 'asc' | 'desc'
  action?: string
  resourceType?: string
  actorId?: string
  result?: 'SUCCESS' | 'FAILURE'
  dateFrom?: string
  dateTo?: string
  tenantId?: string
}

export const AUDIT_ACTIONS = [
  'USER_CREATED',
  'USER_UPDATED',
  'USER_DELETED',
  'USER_ENABLED',
  'USER_DISABLED',
  'ROLE_CREATED',
  'ROLE_UPDATED',
  'ROLE_DELETED',
  'ROLE_ASSIGNED',
  'ROLE_UNASSIGNED',
  'EXPENSE_CREATED',
  'EXPENSE_UPDATED',
  'EXPENSE_APPROVED',
  'EXPENSE_REJECTED',
  'EXPENSE_CANCELLED',
  'EXPENSE_PROCESSED',
  'TENANT_CREATED',
  'TENANT_UPDATED',
  'LOGIN_SUCCESS',
  'LOGIN_FAILURE',
  'LOGOUT',
  'MFA_ENABLED',
  'MFA_DISABLED',
] as const

export const AUDIT_RESOURCE_TYPES = [
  'User',
  'Role',
  'Expense',
  'Tenant',
  'Department',
  'Permission',
  'Session',
] as const
