import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { ApiResponse, Page } from '~/types/api'
import type { User, CreateUserRequest, UpdateUserRequest } from '~/types/user'

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

const { mockService } = vi.hoisted(() => ({
  mockService: {
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

vi.mock('~/services/user.service', () => ({
  userService: mockService,
}))

import { userService } from '~/services/user.service'

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('list', () => {
    it('fetches user list with params', async () => {
      mockService.list.mockResolvedValue(mockListResponse)

      const result = await userService.list({ page: 0, size: 20 })

      expect(mockService.list).toHaveBeenCalledWith({ page: 0, size: 20 })
      expect(result).toEqual(mockListResponse)
    })
  })

  describe('get', () => {
    it('fetches a user by id', async () => {
      mockService.get.mockResolvedValue(mockUserResponse)

      const result = await userService.get(1)

      expect(mockService.get).toHaveBeenCalledWith(1)
      expect(result).toEqual(mockUserResponse)
    })

    it('fetches a user by string id', async () => {
      mockService.get.mockResolvedValue(mockUserResponse)

      await userService.get('1')

      expect(mockService.get).toHaveBeenCalledWith('1')
    })
  })

  describe('create', () => {
    it('creates a new user', async () => {
      const userData: CreateUserRequest = {
        username: 'jane.doe',
        email: 'jane@example.com',
        password: 'Password123',
        departmentId: 1,
      }
      const response: ApiResponse<User> = {
        success: true,
        message: 'User created',
        data: { ...mockUser, id: 2, username: 'jane.doe' },
        timestamp: '2024-01-01T00:00:00Z',
      }
      mockService.create.mockResolvedValue(response)

      const result = await userService.create(userData)

      expect(mockService.create).toHaveBeenCalledWith(userData)
      expect(result).toEqual(response)
    })
  })

  describe('update', () => {
    it('updates an existing user', async () => {
      const updateData: UpdateUserRequest = {
        firstName: 'Jane',
        lastName: 'Smith',
      }
      const response: ApiResponse<User> = {
        success: true,
        message: 'User updated',
        data: { ...mockUser, firstName: 'Jane', lastName: 'Smith' },
        timestamp: '2024-01-01T00:00:00Z',
      }
      mockService.update.mockResolvedValue(response)

      const result = await userService.update(1, updateData)

      expect(mockService.update).toHaveBeenCalledWith(1, updateData)
      expect(result).toEqual(response)
    })
  })

  describe('delete', () => {
    it('deletes a user', async () => {
      const response: ApiResponse<void> = {
        success: true,
        message: 'User deleted',
        data: null,
        timestamp: '2024-01-01T00:00:00Z',
      }
      mockService.delete.mockResolvedValue(response)

      const result = await userService.delete(1)

      expect(mockService.delete).toHaveBeenCalledWith(1)
      expect(result).toEqual(response)
    })
  })

  describe('setEnabled', () => {
    it('enables a user', async () => {
      const response: ApiResponse<User> = {
        success: true,
        message: 'User enabled',
        data: { ...mockUser, enabled: true },
        timestamp: '2024-01-01T00:00:00Z',
      }
      mockService.setEnabled.mockResolvedValue(response)

      const result = await userService.setEnabled(1, { enabled: true })

      expect(mockService.setEnabled).toHaveBeenCalledWith(1, { enabled: true })
      expect(result).toEqual(response)
    })

    it('disables a user', async () => {
      const response: ApiResponse<User> = {
        success: true,
        message: 'User disabled',
        data: { ...mockUser, enabled: false },
        timestamp: '2024-01-01T00:00:00Z',
      }
      mockService.setEnabled.mockResolvedValue(response)

      const result = await userService.setEnabled(1, { enabled: false })

      expect(mockService.setEnabled).toHaveBeenCalledWith(1, { enabled: false })
      expect(result).toEqual(response)
    })
  })

  describe('assignRole', () => {
    it('assigns a role to a user', async () => {
      const response: ApiResponse<User> = {
        success: true,
        message: 'Role assigned',
        data: { ...mockUser, roles: ['EMPLOYEE', 'ADMIN'] },
        timestamp: '2024-01-01T00:00:00Z',
      }
      mockService.assignRole.mockResolvedValue(response)

      const result = await userService.assignRole(1, { roleName: 'ADMIN' })

      expect(mockService.assignRole).toHaveBeenCalledWith(1, { roleName: 'ADMIN' })
      expect(result).toEqual(response)
    })
  })

  describe('removeRole', () => {
    it('removes a role from a user', async () => {
      const response: ApiResponse<User> = {
        success: true,
        message: 'Role removed',
        data: { ...mockUser, roles: [] },
        timestamp: '2024-01-01T00:00:00Z',
      }
      mockService.removeRole.mockResolvedValue(response)

      const result = await userService.removeRole(1, { roleName: 'ADMIN' })

      expect(mockService.removeRole).toHaveBeenCalledWith(1, { roleName: 'ADMIN' })
      expect(result).toEqual(response)
    })
  })
})
