import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { ApiResponse } from '~/types/api'
import type { Expense } from '~/types/expense'
import { expenseService } from '~/services/expense.service'

const mockExpense: Expense = {
  id: 1,
  title: 'Client lunch',
  description: 'Business meeting',
  amount: 25.5,
  category: 'Travel',
  status: 'PENDING',
  submissionDate: '2024-01-01T00:00:00Z',
  decisionDate: null,
  processedDate: null,
  ownerId: 1,
  ownerUsername: 'john.doe',
  departmentId: 1,
  departmentName: 'Engineering',
  tenantId: 1,
  tenantName: 'Acme',
  approvedById: null,
  approvedByUsername: null,
  rejectedById: null,
  rejectedByUsername: null,
  processedById: null,
  processedByUsername: null,
  updatedAt: '2024-01-01T00:00:00Z',
}

const response = (data: unknown): ApiResponse<unknown> => ({
  success: true,
  message: 'ok',
  data,
  timestamp: '2024-01-01T00:00:00Z',
})

const { mockApi } = vi.hoisted(() => ({
  mockApi: vi.fn(),
}))

vi.mock('~/composables/useApi', () => ({
  useApi: () => mockApi,
}))

describe('expenseService', () => {
  beforeEach(() => {
    mockApi.mockReset()
    vi.clearAllMocks()
  })

  it('list sends GET /api/expenses with filters as query params', async () => {
    mockApi.mockResolvedValue(response({ content: [mockExpense] }))

    await expenseService.list({ page: 0, size: 20, status: 'PENDING', departmentId: 2 })

    expect(mockApi).toHaveBeenCalledWith('/api/expenses', {
      query: { page: 0, size: 20, status: 'PENDING', departmentId: 2 },
    })
  })

  it('get sends GET /api/expenses/{id}', async () => {
    mockApi.mockResolvedValue(response(mockExpense))

    await expenseService.get(7)

    expect(mockApi).toHaveBeenCalledWith('/api/expenses/7')
  })

  it('create sends POST /api/expenses with the request body', async () => {
    const data = {
      title: 'Meal',
      description: '',
      amount: 25.5,
      category: 'Food',
      departmentId: null,
    }
    mockApi.mockResolvedValue(response(mockExpense))

    await expenseService.create(data)

    expect(mockApi).toHaveBeenCalledWith('/api/expenses', { method: 'POST', body: data })
  })

  it('update sends PUT /api/expenses/{id} with the request body', async () => {
    const data = { title: 'Renamed', description: '', amount: 30, category: 'Travel' }
    mockApi.mockResolvedValue(response(mockExpense))

    await expenseService.update(1, data)

    expect(mockApi).toHaveBeenCalledWith('/api/expenses/1', { method: 'PUT', body: data })
  })

  it.each(['approve', 'reject', 'process', 'cancel'] as const)(
    '%s sends POST /api/expenses/{id}/%s with no body',
    async (action) => {
      mockApi.mockResolvedValue(response(mockExpense))

      await expenseService[action](1)

      expect(mockApi).toHaveBeenCalledWith(`/api/expenses/1/${action}`, { method: 'POST' })
    },
  )
})
