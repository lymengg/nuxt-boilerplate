import type { Expense, ExpenseListParams } from '~/types'
import { expenseService } from '~/services/expense.service'

export function useExpenses() {
  const expenses = ref<Expense[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pagination = usePagination()

  async function fetchExpenses(params: Partial<ExpenseListParams> = {}) {
    isLoading.value = true
    error.value = null

    try {
      const response = await expenseService.list({
        page: pagination.page.value,
        size: pagination.size.value,
        sort: pagination.sort.value,
        direction: pagination.direction.value,
        ...params,
      })

      if (response.success && response.data) {
        expenses.value = response.data.content
        pagination.updateFromResponse(
          response.data.totalElements,
          response.data.totalPages
        )
      } else {
        error.value = response.message || 'Failed to fetch expenses'
      }
    } catch (err: unknown) {
      const apiError = useApiError()
      const parsed = apiError.handleError(err)
      error.value = parsed.message
    } finally {
      isLoading.value = false
    }
  }

  async function getExpense(id: string) {
    isLoading.value = true
    error.value = null

    try {
      const response = await expenseService.get(id)
      if (response.success && response.data) {
        return response.data
      }
      error.value = response.message || 'Failed to fetch expense'
      return null
    } catch (err: unknown) {
      const apiError = useApiError()
      const parsed = apiError.handleError(err)
      error.value = parsed.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    expenses,
    isLoading,
    error,
    pagination,
    fetchExpenses,
    getExpense,
  }
}
