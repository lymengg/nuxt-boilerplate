import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { ApiResponse } from '~/types/api'
import type { Tenant } from '~/types/tenant'
import { tenantService } from '~/services/tenant.service'

const mockTenant: Tenant = {
  id: 1,
  name: 'Acme Corp',
  status: 'ACTIVE',
  createdAt: '2024-01-01T00:00:00Z',
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

describe('tenantService', () => {
  beforeEach(() => {
    mockApi.mockReset()
    vi.clearAllMocks()
  })

  it('list sends GET /api/management/tenants with query params', async () => {
    mockApi.mockResolvedValue(response({ content: [mockTenant] }))

    await tenantService.list({ page: 0, size: 20 })

    expect(mockApi).toHaveBeenCalledWith('/api/management/tenants', {
      query: { page: 0, size: 20 },
    })
  })

  it('get sends GET /api/management/tenants/{id}', async () => {
    mockApi.mockResolvedValue(response(mockTenant))

    await tenantService.get(1)

    expect(mockApi).toHaveBeenCalledWith('/api/management/tenants/1')
  })

  it('create sends POST /api/management/tenants with the request body', async () => {
    const data = { name: 'Acme Corp', status: 'ACTIVE' as const }
    mockApi.mockResolvedValue(response(mockTenant))

    await tenantService.create(data)

    expect(mockApi).toHaveBeenCalledWith('/api/management/tenants', { method: 'POST', body: data })
  })

  it('update sends PUT /api/management/tenants/{id} with the request body', async () => {
    const data = { name: 'Acme Inc', status: 'INACTIVE' as const }
    mockApi.mockResolvedValue(response(mockTenant))

    await tenantService.update(1, data)

    expect(mockApi).toHaveBeenCalledWith('/api/management/tenants/1', { method: 'PUT', body: data })
  })

  it('delete sends DELETE /api/management/tenants/{id}', async () => {
    mockApi.mockResolvedValue(response(null))

    await tenantService.delete(1)

    expect(mockApi).toHaveBeenCalledWith('/api/management/tenants/1', { method: 'DELETE' })
  })
})
