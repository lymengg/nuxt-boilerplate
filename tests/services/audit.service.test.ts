import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { ApiResponse } from '~/types/api'
import type { AuditLog } from '~/types/audit'
import { auditService } from '~/services/audit.service'

const mockAuditLog: AuditLog = {
  id: 1,
  actorId: 1,
  actorEmail: 'john@example.com',
  tenantId: 1,
  action: 'EXPENSE_CREATE',
  resourceType: 'EXPENSE',
  resourceId: '42',
  details: 'Created expense',
  timestamp: '2024-01-01T00:00:00Z',
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

describe('auditService', () => {
  beforeEach(() => {
    mockApi.mockReset()
    vi.clearAllMocks()
  })

  it('list sends GET /api/management/audit with query params', async () => {
    mockApi.mockResolvedValue(response({ content: [mockAuditLog] }))

    await auditService.list({ page: 0, size: 20, sort: 'timestamp,desc' })

    expect(mockApi).toHaveBeenCalledWith('/api/management/audit', {
      query: { page: 0, size: 20, sort: 'timestamp,desc' },
    })
  })

  it('get sends GET /api/management/audit/{id}', async () => {
    mockApi.mockResolvedValue(response(mockAuditLog))

    const result = await auditService.get(1)

    expect(mockApi).toHaveBeenCalledWith('/api/management/audit/1')
    expect(result.data).toEqual(mockAuditLog)
  })
})
