import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { ApiResponse, Page } from '~/types/api'
import type { Department } from '~/types/department'
import { useDepartments } from '~/composables/useDepartments'

const mockDepartment: Department = {
  id: 1,
  name: 'Engineering',
  tenantId: 1,
  tenantName: 'Acme',
  managerIds: [1],
  managerUsernames: ['john.doe'],
}

const page: Page<Department> = {
  content: [mockDepartment],
  page: 0,
  size: 20,
  totalElements: 1,
  totalPages: 1,
  first: true,
  last: true,
  empty: false,
}

const ok = (data: unknown): ApiResponse<unknown> => ({ success: true, message: 'ok', data, timestamp: '' })

const { departmentService } = vi.hoisted(() => ({
  departmentService: {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('~/services/department.service', () => ({ departmentService }))

describe('useDepartments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchDepartments', () => {
    it('loads departments with the default name sort and updates totals', async () => {
      departmentService.list.mockResolvedValue(ok(page))
      const { departments, loading, pagination, fetchDepartments } = useDepartments()

      const promise = fetchDepartments()
      expect(loading.value).toBe(true)
      await promise

      expect(loading.value).toBe(false)
      expect(departments.value).toEqual([mockDepartment])
      expect(pagination.state.totalElements).toBe(1)
      expect(departmentService.list).toHaveBeenCalledWith({ page: 0, size: 20, sort: 'name,asc' })
    })

    it('clears the list and sets the error on failure', async () => {
      departmentService.list.mockRejectedValue(new Error('down'))
      const { departments, error, fetchDepartments } = useDepartments()

      await fetchDepartments()

      expect(error.value).toBe('down')
      expect(departments.value).toEqual([])
    })
  })

  describe('fetchAllDepartments', () => {
    it('loads up to 100 departments for dropdowns', async () => {
      departmentService.list.mockResolvedValue(ok(page))
      const { allDepartments, fetchAllDepartments } = useDepartments()

      await fetchAllDepartments()

      expect(departmentService.list).toHaveBeenCalledWith({ page: 0, size: 100, sort: 'name,asc' })
      expect(allDepartments.value).toEqual([mockDepartment])
    })

    it('clears the dropdown list on failure', async () => {
      departmentService.list.mockRejectedValue(new Error('down'))
      const { allDepartments, fetchAllDepartments } = useDepartments()

      await fetchAllDepartments()

      expect(allDepartments.value).toEqual([])
    })
  })

  describe('getDepartment', () => {
    it('returns the department on success and null on failure', async () => {
      departmentService.get.mockResolvedValue(ok(mockDepartment))
      const { getDepartment } = useDepartments()
      expect(await getDepartment(1)).toEqual(mockDepartment)

      departmentService.get.mockRejectedValue(new Error('not found'))
      expect(await getDepartment(2)).toBeNull()
    })
  })

  describe('mutations', () => {
    it.each([
      ['createDepartment', 'create'],
      ['updateDepartment', 'update'],
      ['deleteDepartment', 'delete'],
    ] as const)('%s refetches both lists on success', async (action, serviceMethod) => {
      departmentService[serviceMethod].mockResolvedValue(ok(mockDepartment))
      departmentService.list.mockResolvedValue(ok(page))
      const { [action]: act } = useDepartments()

      await (act as (...args: unknown[]) => Promise<unknown>)(1, {})

      // One call for fetchDepartments + one for fetchAllDepartments.
      expect(departmentService.list).toHaveBeenCalledTimes(2)
      expect(departmentService.list).toHaveBeenNthCalledWith(1, { page: 0, size: 20, sort: 'name,asc' })
      expect(departmentService.list).toHaveBeenNthCalledWith(2, { page: 0, size: 100, sort: 'name,asc' })
    })

    it('does not refetch when the mutation fails', async () => {
      departmentService.create.mockResolvedValue({ success: false, message: 'No', data: null, timestamp: '' })
      const { createDepartment } = useDepartments()

      await createDepartment({ name: 'x', tenantId: 1, managerIds: [] })

      expect(departmentService.list).not.toHaveBeenCalled()
    })
  })
})
