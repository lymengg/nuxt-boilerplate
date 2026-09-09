import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { ApiResponse, Page } from '~/types/api'
import type { Expense } from '~/types/expense'
import { useExpenses } from '~/composables/useExpenses'

const mockExpense: Expense = {
  id: 1,
  title: 'Client lunch',
  description: 'Business meeting',
  amount: 25.5,
  category: 'Travel',
  status: 'PENDING',
  ownerId: 1,
  ownerEmail: 'john@example.com',
  departmentId: 1,
  departmentName: 'Engineering',
  submissionDate: '2024-01-01T00:00:00Z',
  decisionDate: null,
  processedDate: null,
  tenantId: 1,
  tenantName: 'Acme',
  approvedById: null,
  approvedByEmail: null,
  rejectedById: null,
  rejectedByEmail: null,
  processedById: null,
  processedByEmail: null,
  updatedAt: '2024-01-01T00:00:00Z',
}

const page: Page<Expense> = {
  content: [mockExpense],
  page: 0,
  size: 20,
  totalElements: 1,
  totalPages: 1,
  first: true,
  last: true,
  empty: false,
}

const okResponse = (data: unknown = page): ApiResponse<unknown> => ({
  success: true,
  message: 'ok',
  data,
  timestamp: '2024-01-01T00:00:00Z',
})

const { expenseService } = vi.hoisted(() => ({
  expenseService: {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    approve: vi.fn(),
    reject: vi.fn(),
    process: vi.fn(),
    cancel: vi.fn(),
  },
}))

vi.mock('~/services/expense.service', () => ({ expenseService }))

describe('useExpenses', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchExpenses', () => {
    it('loads expenses and updates pagination totals', async () => {
      expenseService.list.mockResolvedValue(okResponse())
      const { expenses, loading, pagination, fetchExpenses } = useExpenses()

      const promise = fetchExpenses()
      expect(loading.value).toBe(true)
      await promise

      expect(loading.value).toBe(false)
      expect(expenses.value).toEqual([mockExpense])
      expect(pagination.state.totalElements).toBe(1)
      expect(pagination.state.totalPages).toBe(1)
      expect(expenseService.list).toHaveBeenCalledWith({
        page: 0,
        size: 20,
        sort: 'submissionDate,desc',
      })
    })

    it('merges pagination state with caller params', async () => {
      expenseService.list.mockResolvedValue(okResponse())
      const { pagination, fetchExpenses } = useExpenses()
      pagination.onPageChange(2)

      await fetchExpenses({ status: 'PENDING' })

      expect(expenseService.list).toHaveBeenCalledWith({
        page: 2,
        size: 20,
        sort: 'submissionDate,desc',
        status: 'PENDING',
      })
    })

    it('sets the error and clears the list on failure', async () => {
      expenseService.list.mockRejectedValue(new Error('backend down'))
      const { expenses, error, fetchExpenses } = useExpenses()

      await fetchExpenses()

      expect(error.value).toBe('backend down')
      expect(expenses.value).toEqual([])
    })

    it('handles a failed response envelope', async () => {
      expenseService.list.mockResolvedValue({ success: false, message: 'Nope', data: null, timestamp: '' })
      const { error, fetchExpenses } = useExpenses()

      await fetchExpenses()

      expect(error.value).toBe('Nope')
    })
  })

  describe('getExpense', () => {
    it('returns the expense on success', async () => {
      expenseService.get.mockResolvedValue(okResponse(mockExpense))
      const { getExpense } = useExpenses()

      const result = await getExpense(1)

      expect(result).toEqual(mockExpense)
      expect(expenseService.get).toHaveBeenCalledWith(1)
    })

    it('returns null on failure', async () => {
      expenseService.get.mockRejectedValue(new Error('not found'))
      const { getExpense } = useExpenses()

      expect(await getExpense(1)).toBeNull()
    })
  })

  describe('mutations', () => {
    const MUTATION_CASES: Array<[string, string, unknown?]> = [
      ['createExpense', 'create', { title: 'x' }],
      ['updateExpense', 'update', { title: 'x' }],
      ['approveExpense', 'approve'],
      ['rejectExpense', 'reject'],
      ['processExpense', 'process'],
      ['cancelExpense', 'cancel'],
    ]
    it.each(MUTATION_CASES)('%s calls the service and refetches on success', async (action, serviceMethod, payload) => {
      const serviceFn = (expenseService as Record<string, ReturnType<typeof vi.fn>>)[serviceMethod]
      const composable = useExpenses() as unknown as Record<string, (...args: unknown[]) => Promise<unknown>>
      serviceFn.mockResolvedValue(okResponse(mockExpense))
      expenseService.list.mockResolvedValue(okResponse())
      const act = composable[action]
      const listCallsBefore = expenseService.list.mock.calls.length

      await act(1, payload)

      expect(serviceFn).toHaveBeenCalledTimes(1)
      expect(expenseService.list.mock.calls.length).toBe(listCallsBefore + 1)
    })

    it.each(MUTATION_CASES)('%s does not refetch when the response is a failure', async (action, serviceMethod) => {
      const serviceFn = (expenseService as Record<string, ReturnType<typeof vi.fn>>)[serviceMethod]
      serviceFn.mockResolvedValue({ success: false, message: 'No', data: null, timestamp: '' })
      const composable = useExpenses() as unknown as Record<string, (...args: unknown[]) => Promise<unknown>>

      await composable[action](1)

      expect(expenseService.list).not.toHaveBeenCalled()
    })
  })
})
