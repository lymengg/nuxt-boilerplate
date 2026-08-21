import type { ApiResponse, Page } from '~/types/api'
import type { CreateExpenseRequest, Expense, ExpenseListParams, UpdateExpenseRequest } from '~/types/expense'

export const expenseService = {
  async list(params: ExpenseListParams): Promise<ApiResponse<Page<Expense>>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Page<Expense>>>('/api/expenses', {
      query: params,
    })
  },

  async get(id: string): Promise<ApiResponse<Expense>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Expense>>(`/api/expenses/${id}`)
  },

  async create(data: CreateExpenseRequest): Promise<ApiResponse<Expense>> {
    const { $api } = useNuxtApp()
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('amount', String(data.amount))
    formData.append('currency', data.currency)
    formData.append('category', data.category)
    formData.append('departmentId', data.departmentId)
    if (data.receiptFile) {
      formData.append('receipt', data.receiptFile)
    }
    return $api<ApiResponse<Expense>>('/api/expenses', {
      method: 'POST',
      body: formData,
    })
  },

  async update(id: string, data: UpdateExpenseRequest): Promise<ApiResponse<Expense>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Expense>>(`/api/expenses/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<void>>(`/api/expenses/${id}`, {
      method: 'DELETE',
    })
  },

  async approve(id: string): Promise<ApiResponse<Expense>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Expense>>(`/api/expenses/${id}/approve`, {
      method: 'POST',
    })
  },

  async reject(id: string, reason: string): Promise<ApiResponse<Expense>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Expense>>(`/api/expenses/${id}/reject`, {
      method: 'POST',
      body: { reason },
    })
  },

  async process(id: string): Promise<ApiResponse<Expense>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Expense>>(`/api/expenses/${id}/process`, {
      method: 'POST',
    })
  },

  async cancel(id: string): Promise<ApiResponse<Expense>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Expense>>(`/api/expenses/${id}/cancel`, {
      method: 'POST',
    })
  },
}
