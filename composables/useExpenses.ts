import type { Expense, ExpenseListParams } from '~/types/expense'
import { expenseService } from '~/services/expense.service'

export function useExpenses() {
  const expenses = ref<Expense[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  // The backend Expense entity sorts by `submissionDate` (no `createdAt` column).
  const pagination = usePagination(20, 'submissionDate,desc')

  async function fetchExpenses(params: ExpenseListParams = {}) {
    loading.value = true
    error.value = null

    try {
      const query: ExpenseListParams = {
        page: pagination.state.page,
        size: pagination.state.size,
        sort: pagination.state.sort,
        ...params,
      }

      const response = await expenseService.list(query)

      if (response.success && response.data) {
        expenses.value = response.data.content
        pagination.updateFromResponse(response.data.totalElements, response.data.totalPages)
      }
      else {
        throw new Error(response.message || 'Failed to fetch expenses')
      }
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch expenses'
      expenses.value = []
    }
    finally {
      loading.value = false
    }
  }

  async function getExpense(id: number | string): Promise<Expense | null> {
    try {
      const response = await expenseService.get(id)
      return response.success && response.data ? response.data : null
    }
    catch {
      return null
    }
  }

  async function createExpense(data: Parameters<typeof expenseService.create>[0]) {
    const response = await expenseService.create(data)
    if (response.success) {
      await fetchExpenses()
    }
    return response
  }

  async function updateExpense(id: number | string, data: Parameters<typeof expenseService.update>[1]) {
    const response = await expenseService.update(id, data)
    if (response.success) {
      await fetchExpenses()
    }
    return response
  }

  async function approveExpense(id: number | string) {
    const response = await expenseService.approve(id)
    if (response.success) {
      await fetchExpenses()
    }
    return response
  }

  /** Backend reject takes no reason. */
  async function rejectExpense(id: number | string) {
    const response = await expenseService.reject(id)
    if (response.success) {
      await fetchExpenses()
    }
    return response
  }

  async function processExpense(id: number | string) {
    const response = await expenseService.process(id)
    if (response.success) {
      await fetchExpenses()
    }
    return response
  }

  async function cancelExpense(id: number | string) {
    const response = await expenseService.cancel(id)
    if (response.success) {
      await fetchExpenses()
    }
    return response
  }

  return {
    expenses,
    loading,
    error,
    pagination,
    fetchExpenses,
    getExpense,
    createExpense,
    updateExpense,
    approveExpense,
    rejectExpense,
    processExpense,
    cancelExpense,
  }
}
