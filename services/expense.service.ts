import { apiFetch } from '~/utils/api'
import type {
  ApiResponse,
  Page,
  Expense,
  ExpenseListParams,
  CreateExpenseRequest,
  UpdateExpenseRequest,
  ApproveExpenseRequest,
  RejectExpenseRequest,
} from '~/types'

export const expenseService = {
  async list(params: ExpenseListParams): Promise<ApiResponse<Page<Expense>>> {
    return apiFetch<Page<Expense>>('/api/expenses', { query: params as Record<string, unknown> })
  },

  async get(id: string): Promise<ApiResponse<Expense>> {
    return apiFetch<Expense>(`/api/expenses/${id}`)
  },

  async create(data: CreateExpenseRequest): Promise<ApiResponse<Expense>> {
    return apiFetch<Expense>('/api/expenses', {
      method: 'POST',
      body: data,
    })
  },

  async update(id: string, data: UpdateExpenseRequest): Promise<ApiResponse<Expense>> {
    return apiFetch<Expense>(`/api/expenses/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  async approve(id: string, data?: ApproveExpenseRequest): Promise<ApiResponse<Expense>> {
    return apiFetch<Expense>(`/api/expenses/${id}/approve`, {
      method: 'POST',
      body: data,
    })
  },

  async reject(id: string, data: RejectExpenseRequest): Promise<ApiResponse<Expense>> {
    return apiFetch<Expense>(`/api/expenses/${id}/reject`, {
      method: 'POST',
      body: data,
    })
  },

  async cancel(id: string): Promise<ApiResponse<Expense>> {
    return apiFetch<Expense>(`/api/expenses/${id}/cancel`, {
      method: 'POST',
    })
  },

  async process(id: string): Promise<ApiResponse<Expense>> {
    return apiFetch<Expense>(`/api/expenses/${id}/process`, {
      method: 'POST',
    })
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiFetch<void>(`/api/expenses/${id}`, {
      method: 'DELETE',
    })
  },
}
