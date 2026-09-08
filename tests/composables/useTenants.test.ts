import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { ApiResponse, Page } from '~/types/api'
import type { Tenant } from '~/types/tenant'
import { useTenants } from '~/composables/useTenants'

const mockTenant: Tenant = {
  id: 1,
  name: 'Acme Corp',
  status: 'ACTIVE',
  createdAt: '2024-01-01T00:00:00Z',
}

const page: Page<Tenant> = {
  content: [mockTenant],
  page: 0,
  size: 20,
  totalElements: 1,
  totalPages: 1,
  first: true,
  last: true,
  empty: false,
}

const ok = (data: unknown): ApiResponse<unknown> => ({ success: true, message: 'ok', data, timestamp: '' })

const { tenantService } = vi.hoisted(() => ({
  tenantService: {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('~/services/tenant.service', () => ({ tenantService }))

describe('useTenants', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchTenants', () => {
    it('loads tenants with the createdAt sort and updates totals', async () => {
      tenantService.list.mockResolvedValue(ok(page))
      const { tenants, loading, pagination, fetchTenants } = useTenants()

      const promise = fetchTenants()
      expect(loading.value).toBe(true)
      await promise

      expect(loading.value).toBe(false)
      expect(tenants.value).toEqual([mockTenant])
      expect(pagination.state.totalElements).toBe(1)
      expect(tenantService.list).toHaveBeenCalledWith({ page: 0, size: 20, sort: 'createdAt,desc' })
    })

    it('clears the list and sets the error on failure', async () => {
      tenantService.list.mockRejectedValue(new Error('down'))
      const { tenants, error, fetchTenants } = useTenants()

      await fetchTenants()

      expect(error.value).toBe('down')
      expect(tenants.value).toEqual([])
    })
  })

  describe('fetchAllTenants', () => {
    it('loads up to 100 tenants for dropdowns sorted by name', async () => {
      tenantService.list.mockResolvedValue(ok(page))
      const { allTenants, fetchAllTenants } = useTenants()

      await fetchAllTenants()

      expect(tenantService.list).toHaveBeenCalledWith({ page: 0, size: 100, sort: 'name,asc' })
      expect(allTenants.value).toEqual([mockTenant])
    })
  })

  describe('getTenant', () => {
    it('returns the tenant on success and null on failure', async () => {
      tenantService.get.mockResolvedValue(ok(mockTenant))
      const { getTenant } = useTenants()
      expect(await getTenant(1)).toEqual(mockTenant)

      tenantService.get.mockRejectedValue(new Error('not found'))
      expect(await getTenant(2)).toBeNull()
    })
  })

  describe('mutations', () => {
    it.each([
      ['createTenant', 'create'],
      ['updateTenant', 'update'],
      ['deleteTenant', 'delete'],
    ] as const)('%s refetches both lists on success', async (action, serviceMethod) => {
      tenantService[serviceMethod].mockResolvedValue(ok(mockTenant))
      tenantService.list.mockResolvedValue(ok(page))
      const { [action]: act } = useTenants()

      await (act as (...args: unknown[]) => Promise<unknown>)(1, {})

      expect(tenantService.list).toHaveBeenCalledTimes(2)
      expect(tenantService.list).toHaveBeenNthCalledWith(1, { page: 0, size: 20, sort: 'createdAt,desc' })
      expect(tenantService.list).toHaveBeenNthCalledWith(2, { page: 0, size: 100, sort: 'name,asc' })
    })

    it('does not refetch when the mutation fails', async () => {
      tenantService.create.mockResolvedValue({ success: false, message: 'No', data: null, timestamp: '' })
      const { createTenant } = useTenants()

      await createTenant({ name: 'x', status: 'ACTIVE' })

      expect(tenantService.list).not.toHaveBeenCalled()
    })
  })
})
