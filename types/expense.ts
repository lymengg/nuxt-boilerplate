export type ExpenseStatus = 'PENDING' | 'APPROVED' | 'PROCESSED' | 'REJECTED' | 'CANCELLED'

export interface Expense {
  id: string
  title: string
  description: string
  amount: number
  currency: string
  category: string
  status: ExpenseStatus
  submittedBy: ExpenseUser
  approvedBy: ExpenseUser | null
  processedBy: ExpenseUser | null
  tenantId: string
  tenantName: string
  departmentId: string
  departmentName: string
  receiptUrl: string | null
  submittedAt: string
  approvedAt: string | null
  processedAt: string | null
  rejectedAt: string | null
  rejectedReason: string | null
  createdAt: string
  updatedAt: string
}

export interface ExpenseUser {
  id: string
  email: string
  firstName: string
  lastName: string
}

export interface CreateExpenseRequest {
  title: string
  description: string
  amount: number
  currency: string
  category: string
  departmentId: string
}

export interface UpdateExpenseRequest {
  title?: string
  description?: string
  amount?: number
  currency?: string
  category?: string
  departmentId?: string
}

export interface ApproveExpenseRequest {
  comment?: string
}

export interface RejectExpenseRequest {
  reason: string
}

export interface ExpenseListParams {
  page?: number
  size?: number
  sort?: string
  direction?: 'asc' | 'desc'
  search?: string
  status?: ExpenseStatus
  category?: string
  departmentId?: string
  submittedBy?: string
  dateFrom?: string
  dateTo?: string
  minAmount?: number
  maxAmount?: number
}

export const EXPENSE_CATEGORIES = [
  'Travel',
  'Meals',
  'Office Supplies',
  'Software',
  'Hardware',
  'Training',
  'Marketing',
  'Other',
] as const

export const EXPENSE_STATUSES: Record<ExpenseStatus, { label: string; severity: string }> = {
  PENDING: { label: 'Pending', severity: 'warn' },
  APPROVED: { label: 'Approved', severity: 'info' },
  PROCESSED: { label: 'Processed', severity: 'success' },
  REJECTED: { label: 'Rejected', severity: 'danger' },
  CANCELLED: { label: 'Cancelled', severity: 'secondary' },
}
