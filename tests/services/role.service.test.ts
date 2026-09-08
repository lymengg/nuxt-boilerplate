import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { ApiResponse } from '~/types/api'
import type { Role } from '~/types/role'
import { roleService } from '~/services/role.service'

const mockRole: Role = {
  id: 1,
  name: 'EXPENSE_MANAGER',
  title: 'Expense Manager',
  description: 'Manages expenses',
  permissions: ['EXPENSE_READ', 'EXPENSE_APPROVE'],
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

describe('roleService', () => {
  beforeEach(() => {
    mockApi.mockReset()
    vi.clearAllMocks()
  })

  it('list sends GET /api/management/roles with query params', async () => {
    mockApi.mockResolvedValue(response({ content: [mockRole] }))

    await roleService.list({ page: 0, size: 20 })

    expect(mockApi).toHaveBeenCalledWith('/api/management/roles', {
      query: { page: 0, size: 20 },
    })
  })

  it('get sends GET /api/management/roles/{id}', async () => {
    mockApi.mockResolvedValue(response(mockRole))

    await roleService.get(1)

    expect(mockApi).toHaveBeenCalledWith('/api/management/roles/1')
  })

  it('create sends POST /api/management/roles with the request body', async () => {
    const data = { name: 'AUDITOR', title: 'Auditor', description: '' }
    mockApi.mockResolvedValue(response(mockRole))

    await roleService.create(data)

    expect(mockApi).toHaveBeenCalledWith('/api/management/roles', { method: 'POST', body: data })
  })

  it('update sends PUT /api/management/roles/{id} with the request body', async () => {
    const data = { name: 'AUDITOR', title: 'Senior Auditor', description: '' }
    mockApi.mockResolvedValue(response(mockRole))

    await roleService.update(1, data)

    expect(mockApi).toHaveBeenCalledWith('/api/management/roles/1', { method: 'PUT', body: data })
  })

  it('delete sends DELETE /api/management/roles/{id}', async () => {
    mockApi.mockResolvedValue(response(null))

    await roleService.delete(1)

    expect(mockApi).toHaveBeenCalledWith('/api/management/roles/1', { method: 'DELETE' })
  })

  it('addPermission sends POST /api/management/roles/{id}/permissions with the permission', async () => {
    mockApi.mockResolvedValue(response(mockRole))

    await roleService.addPermission(1, { permission: 'EXPENSE_APPROVE' })

    expect(mockApi).toHaveBeenCalledWith('/api/management/roles/1/permissions', {
      method: 'POST',
      body: { permission: 'EXPENSE_APPROVE' },
    })
  })

  it('removePermission sends DELETE /api/management/roles/{id}/permissions with the permission', async () => {
    mockApi.mockResolvedValue(response(mockRole))

    await roleService.removePermission(1, { permission: 'EXPENSE_APPROVE' })

    expect(mockApi).toHaveBeenCalledWith('/api/management/roles/1/permissions', {
      method: 'DELETE',
      body: { permission: 'EXPENSE_APPROVE' },
    })
  })
})
