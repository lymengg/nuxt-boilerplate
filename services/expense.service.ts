import type { ApiResponse, Page } from '~/types/api'
import type { CreateExpenseRequest, Expense, ExpenseListParams, UpdateExpenseRequest } from '~/types/expense'

export const expenseService = {
  async list(params: ExpenseListParams): Promise<ApiResponse<Page<Expense>>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Page<Expense>>>('/api/expenses', {
      query: params,
    })
  },

  async get(id: number | string): Promise<ApiResponse<Expense>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Expense>>(`/api/expenses/${id}`)
  },

  /** JSON body (no file upload) — matches ExpenseCreateRequest. */
  async create(data: CreateExpenseRequest): Promise<ApiResponse<Expense>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Expense>>('/api/expenses', {
      method: 'POST',
      body: data,
    })
  },

  async update(id: number | string, data: UpdateExpenseRequest): Promise<ApiResponse<Expense>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Expense>>(`/api/expenses/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  async approve(id: number | string): Promise<ApiResponse<Expense>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Expense>>(`/api/expenses/${id}/approve`, {
      method: 'POST',
    })
  },

  /** Backend reject takes no request body. */
  async reject(id: number | string): Promise<ApiResponse<Expense>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Expense>>(`/api/expenses/${id}/reject`, {
      method: 'POST',
    })
  },

  async process(id: number | string): Promise<ApiResponse<Expense>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Expense>>(`/api/expenses/${id}/process`, {
      method: 'POST',
    })
  },

  async cancel(id: number | string): Promise<ApiResponse<Expense>> {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<Expense>>(`/api/expenses/${id}/cancel`, {
      method: 'POST',
    })
  },
}
