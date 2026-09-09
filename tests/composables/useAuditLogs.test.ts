import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { ApiResponse, Page } from '~/types/api'
import type { AuditLog } from '~/types/audit'
import { useAuditLogs } from '~/composables/useAuditLogs'

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

const page: Page<AuditLog> = {
  content: [mockAuditLog],
  page: 0,
  size: 20,
  totalElements: 1,
  totalPages: 1,
  first: true,
  last: true,
  empty: false,
}

const ok = (data: unknown): ApiResponse<unknown> => ({ success: true, message: 'ok', data, timestamp: '' })

const { auditService } = vi.hoisted(() => ({
  auditService: {
    list: vi.fn(),
    get: vi.fn(),
  },
}))

vi.mock('~/services/audit.service', () => ({ auditService }))

describe('useAuditLogs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchAuditLogs', () => {
    it('loads audit logs with the timestamp sort and updates totals', async () => {
      auditService.list.mockResolvedValue(ok(page))
      const { auditLogs, loading, pagination, fetchAuditLogs } = useAuditLogs()

      const promise = fetchAuditLogs()
      expect(loading.value).toBe(true)
      await promise

      expect(loading.value).toBe(false)
      expect(auditLogs.value).toEqual([mockAuditLog])
      expect(pagination.state.totalElements).toBe(1)
      expect(auditService.list).toHaveBeenCalledWith({ page: 0, size: 20, sort: 'timestamp,desc' })
    })

    it('merges pagination state with caller params', async () => {
      auditService.list.mockResolvedValue(ok(page))
      const { pagination, fetchAuditLogs } = useAuditLogs()
      pagination.onPageChange(3)

      await fetchAuditLogs({ size: 50 })

      expect(auditService.list).toHaveBeenCalledWith({
        page: 3,
        size: 50,
        sort: 'timestamp,desc',
      })
    })

    it('clears the list and sets the error on failure', async () => {
      auditService.list.mockRejectedValue(new Error('down'))
      const { auditLogs, error, fetchAuditLogs } = useAuditLogs()

      await fetchAuditLogs()

      expect(error.value).toBe('down')
      expect(auditLogs.value).toEqual([])
    })

    it('handles a failed response envelope', async () => {
      auditService.list.mockResolvedValue({ success: false, message: 'Nope', data: null, timestamp: '' })
      const { error, fetchAuditLogs } = useAuditLogs()

      await fetchAuditLogs()

      expect(error.value).toBe('Nope')
    })
  })

  describe('getAuditLog', () => {
    it('returns the log on success', async () => {
      auditService.get.mockResolvedValue(ok(mockAuditLog))
      const { getAuditLog } = useAuditLogs()

      expect(await getAuditLog(1)).toEqual(mockAuditLog)
    })

    it('returns null on failure', async () => {
      auditService.get.mockRejectedValue(new Error('not found'))
      const { getAuditLog } = useAuditLogs()

      expect(await getAuditLog(1)).toBeNull()
    })
  })
})
