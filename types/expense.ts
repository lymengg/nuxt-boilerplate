/**
 * Expense DTOs — mirror spring-boilerplate's ExpenseResponse,
 * ExpenseCreateRequest, ExpenseUpdateRequest and ExpenseStatus.
 */
export type ExpenseStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'PROCESSED'

export interface Expense {
  id: number
  title: string
  description: string
  amount: number
  category: string
  status: ExpenseStatus
  submissionDate: string
  decisionDate: string | null
  processedDate: string | null
  ownerId: number
  ownerUsername: string
  departmentId: number | null
  departmentName: string | null
  tenantId: number
  tenantName: string
  approvedById: number | null
  approvedByUsername: string | null
  rejectedById: number | null
  rejectedByUsername: string | null
  processedById: number | null
  processedByUsername: string | null
  updatedAt: string
}

export interface CreateExpenseRequest {
  title: string
  description?: string
  amount: number
  category: string
  /** Optional — the backend falls back to the current user's department. */
  departmentId?: number | null
}

export interface UpdateExpenseRequest {
  title: string
  description?: string
  amount: number
  category: string
}

export interface ExpenseListParams {
  page?: number
  size?: number
  sort?: string
  status?: ExpenseStatus
  tenantId?: number
  departmentId?: number
}

export const EXPENSE_CATEGORIES = [
  'Travel',
  'Meals',
  'Office Supplies',
  'Software',
  'Hardware',
  'Services',
  'Training',
  'Other',
] as const

export const EXPENSE_STATUS_CONFIG: Record<ExpenseStatus, { label: string, severity: string }> = {
  PENDING: { label: 'Pending', severity: 'warn' },
  APPROVED: { label: 'Approved', severity: 'info' },
  REJECTED: { label: 'Rejected', severity: 'danger' },
  CANCELLED: { label: 'Cancelled', severity: 'secondary' },
  PROCESSED: { label: 'Processed', severity: 'success' },
}
