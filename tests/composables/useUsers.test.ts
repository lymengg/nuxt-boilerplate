import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { User, UserListParams } from '~/types/user'
import type { ApiResponse, Page } from '~/types/api'

const mockUser: User = {
  id: 1,
  username: 'john.doe',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  enabled: true,
  accountNonLocked: true,
  departmentId: 1,
  departmentName: 'Engineering',
  roles: ['EMPLOYEE'],
  permissions: ['READ_OWN_EXPENSES'],
  mfaEnabled: false,
  mfaMethod: '',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const mockPage: Page<User> = {
  content: [mockUser],
  page: 0,
  size: 20,
  totalElements: 1,
  totalPages: 1,
  first: true,
  last: true,
  empty: false,
}

const mockListResponse: ApiResponse<Page<User>> = {
  success: true,
  message: 'Success',
  data: mockPage,
  timestamp: '2024-01-01T00:00:00Z',
}

const mockUserResponse: ApiResponse<User> = {
  success: true,
  message: 'Success',
  data: mockUser,
  timestamp: '2024-01-01T00:00:00Z',
}

vi.mock('~/services/user.service', () => ({
  userService: {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    setEnabled: vi.fn(),
    assignRole: vi.fn(),
    removeRole: vi.fn(),
  },
}))

vi.mock('~/composables/useApiError', () => ({
  useApiError: () => ({
    getErrorMessage: (e: unknown) => {
      if (e instanceof Error) return e.message
      return 'An unexpected error occurred'
    },
    getFieldErrors: vi.fn(),
    getStatus: vi.fn(),
    isValidationError: vi.fn(),
  }),
}))

vi.mock('~/composables/usePagination', () => ({
  usePagination: () => ({
    state: { page: 0, size: 20, sort: 'createdAt,desc', totalElements: 0, totalPages: 0 },
    page: { value: 0 },
    size: { value: 20 },
    sort: { value: 'createdAt,desc' },
    totalElements: { value: 0 },
    totalPages: { value: 0 },
    onPageChange: vi.fn(),
    onSizeChange: vi.fn(),
    onSortChange: vi.fn(),
    reset: vi.fn(),
    updateFromResponse: vi.fn(),
  }),
}))

import { useUsers } from '~/composables/useUsers'
import { userService } from '~/services/user.service'

describe('useUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchUsers', () => {
    it('fetches users and updates state on success', async () => {
      vi.mocked(userService.list).mockResolvedValue(mockListResponse)

      const { users, loading, error, fetchUsers } = useUsers()

      expect(loading.value).toBe(false)
      expect(error.value).toBeNull()

      await fetchUsers()

      expect(loading.value).toBe(false)
      expect(error.value).toBeNull()
      expect(users.value).toEqual([mockUser])
      expect(userService.list).toHaveBeenCalledOnce()
    })

    it('sets error state on failure', async () => {
      vi.mocked(userService.list).mockRejectedValue(new Error('Network error'))

      const { users, loading, error, fetchUsers } = useUsers()

      await fetchUsers()

      expect(loading.value).toBe(false)
      expect(error.value).toBe('Network error')
      expect(users.value).toEqual([])
    })

    it('sets error when response is not successful', async () => {
      vi.mocked(userService.list).mockResolvedValue({
        success: false,
        message: 'Failed to fetch',
        data: null,
        timestamp: '2024-01-01T00:00:00Z',
      })

      const { users, error, fetchUsers } = useUsers()

      await fetchUsers()

      expect(error.value).toBe('Failed to fetch')
      expect(users.value).toEqual([])
    })

    it('passes query params to service', async () => {
      vi.mocked(userService.list).mockResolvedValue(mockListResponse)

      const { fetchUsers } = useUsers()
      const params: UserListParams = { page: 1, size: 10 }

      await fetchUsers(params)

      expect(userService.list).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1, size: 10 }),
      )
    })
  })

  describe('getUser', () => {
    it('returns user on success', async () => {
      vi.mocked(userService.get).mockResolvedValue(mockUserResponse)

      const { getUser } = useUsers()
      const user = await getUser(1)

      expect(user).toEqual(mockUser)
      expect(userService.get).toHaveBeenCalledWith(1)
    })

    it('returns null on failure', async () => {
      vi.mocked(userService.get).mockRejectedValue(new Error('Not found'))

      const { getUser } = useUsers()
      const user = await getUser(999)

      expect(user).toBeNull()
    })

    it('returns null when response is not successful', async () => {
      vi.mocked(userService.get).mockResolvedValue({
        success: false,
        message: 'Not found',
        data: null,
        timestamp: '2024-01-01T00:00:00Z',
      })

      const { getUser } = useUsers()
      const user = await getUser(999)

      expect(user).toBeNull()
    })
  })

  describe('createUser', () => {
    it('creates user and refetches list on success', async () => {
      vi.mocked(userService.create).mockResolvedValue(mockUserResponse)
      vi.mocked(userService.list).mockResolvedValue(mockListResponse)

      const { createUser } = useUsers()
      const result = await createUser({
        username: 'jane.doe',
        email: 'jane@example.com',
        password: 'Password123',
        departmentId: 1,
      })

      expect(result.success).toBe(true)
      expect(userService.create).toHaveBeenCalledOnce()
      expect(userService.list).toHaveBeenCalledOnce()
    })

    it('does not refetch list on failure', async () => {
      vi.mocked(userService.create).mockResolvedValue({
        success: false,
        message: 'Validation failed',
        data: null,
        timestamp: '2024-01-01T00:00:00Z',
      })

      const { createUser } = useUsers()
      const result = await createUser({
        username: 'jane.doe',
        email: 'jane@example.com',
        password: 'Password123',
        departmentId: 1,
      })

      expect(result.success).toBe(false)
      expect(userService.create).toHaveBeenCalledOnce()
      expect(userService.list).not.toHaveBeenCalled()
    })
  })

  describe('updateUser', () => {
    it('updates user and refetches list on success', async () => {
      vi.mocked(userService.update).mockResolvedValue(mockUserResponse)
      vi.mocked(userService.list).mockResolvedValue(mockListResponse)

      const { updateUser } = useUsers()
      const result = await updateUser(1, { firstName: 'Jane' })

      expect(result.success).toBe(true)
      expect(userService.update).toHaveBeenCalledWith(1, { firstName: 'Jane' })
      expect(userService.list).toHaveBeenCalledOnce()
    })

    it('does not refetch list on failure', async () => {
      vi.mocked(userService.update).mockResolvedValue({
        success: false,
        message: 'Not found',
        data: null,
        timestamp: '2024-01-01T00:00:00Z',
      })

      const { updateUser } = useUsers()
      const result = await updateUser(999, { firstName: 'Jane' })

      expect(result.success).toBe(false)
      expect(userService.list).not.toHaveBeenCalled()
    })
  })

  describe('deleteUser', () => {
    it('deletes user and refetches list on success', async () => {
      vi.mocked(userService.delete).mockResolvedValue({
        success: true,
        message: 'Deleted',
        data: null,
        timestamp: '2024-01-01T00:00:00Z',
      })
      vi.mocked(userService.list).mockResolvedValue(mockListResponse)

      const { deleteUser } = useUsers()
      const result = await deleteUser(1)

      expect(result.success).toBe(true)
      expect(userService.delete).toHaveBeenCalledWith(1)
      expect(userService.list).toHaveBeenCalledOnce()
    })

    it('does not refetch list on failure', async () => {
      vi.mocked(userService.delete).mockResolvedValue({
        success: false,
        message: 'Not found',
        data: null,
        timestamp: '2024-01-01T00:00:00Z',
      })

      const { deleteUser } = useUsers()
      const result = await deleteUser(999)

      expect(result.success).toBe(false)
      expect(userService.list).not.toHaveBeenCalled()
    })
  })

  describe('setEnabled', () => {
    it('enables user and refetches list on success', async () => {
      vi.mocked(userService.setEnabled).mockResolvedValue({
        success: true,
        message: 'Enabled',
        data: { ...mockUser, enabled: true },
        timestamp: '2024-01-01T00:00:00Z',
      })
      vi.mocked(userService.list).mockResolvedValue(mockListResponse)

      const { setEnabled } = useUsers()
      const result = await setEnabled(1, true)

      expect(result.success).toBe(true)
      expect(userService.setEnabled).toHaveBeenCalledWith(1, { enabled: true })
      expect(userService.list).toHaveBeenCalledOnce()
    })

    it('disables user and refetches list on success', async () => {
      vi.mocked(userService.setEnabled).mockResolvedValue({
        success: true,
        message: 'Disabled',
        data: { ...mockUser, enabled: false },
        timestamp: '2024-01-01T00:00:00Z',
      })
      vi.mocked(userService.list).mockResolvedValue(mockListResponse)

      const { setEnabled } = useUsers()
      const result = await setEnabled(1, false)

      expect(result.success).toBe(true)
      expect(userService.setEnabled).toHaveBeenCalledWith(1, { enabled: false })
    })

    it('does not refetch list on failure', async () => {
      vi.mocked(userService.setEnabled).mockResolvedValue({
        success: false,
        message: 'Not found',
        data: null,
        timestamp: '2024-01-01T00:00:00Z',
      })

      const { setEnabled } = useUsers()
      const result = await setEnabled(999, true)

      expect(result.success).toBe(false)
      expect(userService.list).not.toHaveBeenCalled()
    })
  })

  describe('assignRole', () => {
    it('assigns role and refetches list on success', async () => {
      vi.mocked(userService.assignRole).mockResolvedValue({
        success: true,
        message: 'Role assigned',
        data: { ...mockUser, roles: ['EMPLOYEE', 'ADMIN'] },
        timestamp: '2024-01-01T00:00:00Z',
      })
      vi.mocked(userService.list).mockResolvedValue(mockListResponse)

      const { assignRole } = useUsers()
      const result = await assignRole(1, 'ADMIN')

      expect(result.success).toBe(true)
      expect(userService.assignRole).toHaveBeenCalledWith(1, { roleName: 'ADMIN' })
      expect(userService.list).toHaveBeenCalledOnce()
    })

    it('does not refetch list on failure', async () => {
      vi.mocked(userService.assignRole).mockResolvedValue({
        success: false,
        message: 'Not found',
        data: null,
        timestamp: '2024-01-01T00:00:00Z',
      })

      const { assignRole } = useUsers()
      const result = await assignRole(999, 'ADMIN')

      expect(result.success).toBe(false)
      expect(userService.list).not.toHaveBeenCalled()
    })
  })

  describe('removeRole', () => {
    it('removes role and refetches list on success', async () => {
      vi.mocked(userService.removeRole).mockResolvedValue({
        success: true,
        message: 'Role removed',
        data: { ...mockUser, roles: [] },
        timestamp: '2024-01-01T00:00:00Z',
      })
      vi.mocked(userService.list).mockResolvedValue(mockListResponse)

      const { removeRole } = useUsers()
      const result = await removeRole(1, 'ADMIN')

      expect(result.success).toBe(true)
      expect(userService.removeRole).toHaveBeenCalledWith(1, { roleName: 'ADMIN' })
      expect(userService.list).toHaveBeenCalledOnce()
    })

    it('does not refetch list on failure', async () => {
      vi.mocked(userService.removeRole).mockResolvedValue({
        success: false,
        message: 'Not found',
        data: null,
        timestamp: '2024-01-01T00:00:00Z',
      })

      const { removeRole } = useUsers()
      const result = await removeRole(999, 'ADMIN')

      expect(result.success).toBe(false)
      expect(userService.list).not.toHaveBeenCalled()
    })
  })
})
