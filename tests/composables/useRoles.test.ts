import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { ApiResponse, Page } from '~/types/api'
import type { Role } from '~/types/role'
import { useRoles } from '~/composables/useRoles'

const mockRole: Role = {
  id: 1,
  name: 'EXPENSE_MANAGER',
  title: 'Expense Manager',
  description: '',
  permissions: ['EXPENSE_READ'],
}

const page: Page<Role> = {
  content: [mockRole],
  page: 0,
  size: 20,
  totalElements: 1,
  totalPages: 1,
  first: true,
  last: true,
  empty: false,
}

const ok = (data: unknown): ApiResponse<unknown> => ({ success: true, message: 'ok', data, timestamp: '' })

const { roleService } = vi.hoisted(() => ({
  roleService: {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    addPermission: vi.fn(),
    removePermission: vi.fn(),
  },
}))

vi.mock('~/services/role.service', () => ({ roleService }))

describe('useRoles', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchRoles', () => {
    it('loads roles with the default name sort and updates totals', async () => {
      roleService.list.mockResolvedValue(ok(page))
      const { roles, loading, pagination, fetchRoles } = useRoles()

      const promise = fetchRoles()
      expect(loading.value).toBe(true)
      await promise

      expect(loading.value).toBe(false)
      expect(roles.value).toEqual([mockRole])
      expect(pagination.state.totalElements).toBe(1)
      expect(roleService.list).toHaveBeenCalledWith({ page: 0, size: 20, sort: 'name,asc' })
    })

    it('clears the list and sets the error on failure', async () => {
      roleService.list.mockRejectedValue(new Error('down'))
      const { roles, error, fetchRoles } = useRoles()

      await fetchRoles()

      expect(error.value).toBe('down')
      expect(roles.value).toEqual([])
    })
  })

  describe('fetchAllRoles', () => {
    it('loads up to 100 roles for dropdowns', async () => {
      roleService.list.mockResolvedValue(ok(page))
      const { allRoles, fetchAllRoles } = useRoles()

      await fetchAllRoles()

      expect(roleService.list).toHaveBeenCalledWith({ page: 0, size: 100, sort: 'name,asc' })
      expect(allRoles.value).toEqual([mockRole])
    })
  })

  describe('getRole', () => {
    it('returns the role on success and null on failure', async () => {
      roleService.get.mockResolvedValue(ok(mockRole))
      const { getRole } = useRoles()
      expect(await getRole(1)).toEqual(mockRole)

      roleService.get.mockRejectedValue(new Error('not found'))
      expect(await getRole(2)).toBeNull()
    })
  })

  describe('mutations', () => {
    it.each([
      ['createRole', 'create'],
      ['updateRole', 'update'],
      ['deleteRole', 'delete'],
      ['addPermission', 'addPermission'],
      ['removePermission', 'removePermission'],
    ] as const)('%s refetches both lists on success', async (action, serviceMethod) => {
      roleService[serviceMethod].mockResolvedValue(ok(mockRole))
      roleService.list.mockResolvedValue(ok(page))
      const { [action]: act } = useRoles()

      await (act as (...args: unknown[]) => Promise<unknown>)(1, action === 'addPermission' || action === 'removePermission' ? 'EXPENSE_READ' : {})

      expect(roleService.list).toHaveBeenCalledTimes(2)
    })

    it('addPermission sends the permission name to the service', async () => {
      roleService.addPermission.mockResolvedValue(ok(mockRole))
      roleService.list.mockResolvedValue(ok(page))
      const { addPermission } = useRoles()

      await addPermission(1, 'EXPENSE_APPROVE')

      expect(roleService.addPermission).toHaveBeenCalledWith(1, { permission: 'EXPENSE_APPROVE' })
    })

    it('does not refetch when the mutation fails', async () => {
      roleService.create.mockResolvedValue({ success: false, message: 'No', data: null, timestamp: '' })
      const { createRole } = useRoles()

      await createRole({ name: 'X', title: '', description: '' })

      expect(roleService.list).not.toHaveBeenCalled()
    })
  })
})
