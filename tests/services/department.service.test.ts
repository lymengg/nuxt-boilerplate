import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { ApiResponse } from '~/types/api'
import type { Department } from '~/types/department'
import { departmentService } from '~/services/department.service'

const mockDepartment: Department = {
  id: 1,
  name: 'Engineering',
  tenantId: 1,
  tenantName: 'Acme',
  managerIds: [1, 2],
  managerUsernames: ['john.doe', 'jane.smith'],
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

describe('departmentService', () => {
  beforeEach(() => {
    mockApi.mockReset()
    vi.clearAllMocks()
  })

  it('list sends GET /api/management/departments with query params', async () => {
    mockApi.mockResolvedValue(response({ content: [mockDepartment] }))

    await departmentService.list({ page: 0, size: 20 })

    expect(mockApi).toHaveBeenCalledWith('/api/management/departments', {
      query: { page: 0, size: 20 },
    })
  })

  it('get sends GET /api/management/departments/{id}', async () => {
    mockApi.mockResolvedValue(response(mockDepartment))

    await departmentService.get(1)

    expect(mockApi).toHaveBeenCalledWith('/api/management/departments/1')
  })

  it('create sends POST /api/management/departments with the request body', async () => {
    const data = { name: 'Design', tenantId: 1, managerIds: [3] }
    mockApi.mockResolvedValue(response(mockDepartment))

    await departmentService.create(data)

    expect(mockApi).toHaveBeenCalledWith('/api/management/departments', { method: 'POST', body: data })
  })

  it('update sends PUT /api/management/departments/{id} with the request body', async () => {
    const data = { name: 'Design', managerIds: [3] }
    mockApi.mockResolvedValue(response(mockDepartment))

    await departmentService.update(1, data)

    expect(mockApi).toHaveBeenCalledWith('/api/management/departments/1', { method: 'PUT', body: data })
  })

  it('delete sends DELETE /api/management/departments/{id}', async () => {
    mockApi.mockResolvedValue(response(null))

    await departmentService.delete(1)

    expect(mockApi).toHaveBeenCalledWith('/api/management/departments/1', { method: 'DELETE' })
  })
})
