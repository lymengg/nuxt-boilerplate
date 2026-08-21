export type ExpenseStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'PROCESSED'

export interface Expense {
  id: string
  title: string
  description: string
  amount: number
  currency: string
  category: string
  status: ExpenseStatus
  submittedBy: string
  submittedByName: string
  approvedBy: string | null
  approvedByName: string | null
  processedBy: string | null
  processedByName: string | null
  tenantId: string
  tenantName: string
  departmentId: string
  departmentName: string
  receiptUrl: string | null
  rejectionReason: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateExpenseRequest {
  title: string
  description: string
  amount: number
  currency: string
  category: string
  departmentId: string
  receiptFile?: File
}

export interface UpdateExpenseRequest {
  title?: string
  description?: string
  amount?: number
  currency?: string
  category?: string
  departmentId?: string
}

export interface ExpenseListParams {
  page?: number
  size?: number
  sort?: string
  search?: string
  status?: ExpenseStatus
  category?: string
  departmentId?: string
  submittedBy?: string
  minAmount?: number
  maxAmount?: number
  startDate?: string
  endDate?: string
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
