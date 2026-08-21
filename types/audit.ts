export interface AuditLog {
  id: string
  action: string
  resourceType: string
  resourceId: string
  actorId: string
  actorEmail: string
  tenantId: string
  tenantName: string
  details: Record<string, unknown>
  ipAddress: string
  userAgent: string
  result: 'SUCCESS' | 'FAILURE'
  createdAt: string
}

export interface AuditLogListParams {
  page?: number
  size?: number
  sort?: string
  action?: string
  resourceType?: string
  actorId?: string
  tenantId?: string
  result?: 'SUCCESS' | 'FAILURE'
  startDate?: string
  endDate?: string
}

export const AUDIT_ACTIONS = [
  'LOGIN',
  'LOGOUT',
  'LOGIN_FAILED',
  'MFA_VERIFY',
  'USER_CREATE',
  'USER_UPDATE',
  'USER_DELETE',
  'USER_ENABLE',
  'USER_DISABLE',
  'ROLE_CREATE',
  'ROLE_UPDATE',
  'ROLE_DELETE',
  'ROLE_ASSIGN_PERMISSION',
  'TENANT_CREATE',
  'TENANT_UPDATE',
  'TENANT_DELETE',
  'DEPARTMENT_CREATE',
  'DEPARTMENT_UPDATE',
  'DEPARTMENT_DELETE',
  'EXPENSE_CREATE',
  'EXPENSE_UPDATE',
  'EXPENSE_DELETE',
  'EXPENSE_APPROVE',
  'EXPENSE_REJECT',
  'EXPENSE_PROCESS',
  'EXPENSE_CANCEL',
] as const
