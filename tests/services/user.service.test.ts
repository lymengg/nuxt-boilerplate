import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { ApiResponse, Page } from '~/types/api'
import type { User, CreateUserRequest, UpdateUserRequest } from '~/types/user'
import { userService } from '~/services/user.service'

const mockUser: User = {
  id: 1,
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
  mfaMethod: null,
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

// Services reach the HTTP client through the useApi() composable. Mock that
// project seam (the standard pattern — the app's auto-imports are not
// reachable by vi.mock in the Nuxt test env) and assert the HTTP contract
// the service sends: path, method, query and body.
const { mockApi } = vi.hoisted(() => ({
  mockApi: vi.fn(),
}))

vi.mock('~/composables/useApi', () => ({
  useApi: () => mockApi,
}))

describe('userService', () => {
  beforeEach(() => {
    mockApi.mockReset()
    vi.clearAllMocks()
  })

  describe('list', () => {
    it('calls $api with the users path and query params', async () => {
      mockApi.mockResolvedValue(mockListResponse)

      const result = await userService.list({ page: 0, size: 20 })

      expect(mockApi).toHaveBeenCalledWith('/api/management/users', {
        query: { page: 0, size: 20 },
      })
      expect(result).toEqual(mockListResponse)
    })

    it('passes sort and filter params through', async () => {
      mockApi.mockResolvedValue(mockListResponse)

      await userService.list({ page: 1, size: 50, sort: 'email,asc' })

      expect(mockApi).toHaveBeenCalledWith('/api/management/users', {
        query: { page: 1, size: 50, sort: 'email,asc' },
      })
    })
  })

  describe('get', () => {
    it('calls $api with the user detail path', async () => {
      mockApi.mockResolvedValue(mockUserResponse)

      const result = await userService.get(1)

      expect(mockApi).toHaveBeenCalledWith('/api/management/users/1')
      expect(result).toEqual(mockUserResponse)
    })

    it('accepts a string id', async () => {
      mockApi.mockResolvedValue(mockUserResponse)

      await userService.get('abc')

      expect(mockApi).toHaveBeenCalledWith('/api/management/users/abc')
    })
  })

  describe('create', () => {
    it('calls $api with POST and the request body', async () => {
      const userData: CreateUserRequest = {
        email: 'jane@example.com',
        password: 'Password123!',
        departmentId: 1,
      }
      const response: ApiResponse<User> = {
        success: true,
        message: 'User created',
        data: { ...mockUser, id: 2, email: 'jane@example.com' },
        timestamp: '2024-01-01T00:00:00Z',
      }
      mockApi.mockResolvedValue(response)

      const result = await userService.create(userData)

      expect(mockApi).toHaveBeenCalledWith('/api/management/users', {
        method: 'POST',
        body: userData,
      })
      expect(result).toEqual(response)
    })
  })

  describe('update', () => {
    it('calls $api with PUT and the request body', async () => {
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
      mockApi.mockResolvedValue(response)

      const result = await userService.update(1, updateData)

      expect(mockApi).toHaveBeenCalledWith('/api/management/users/1', {
        method: 'PUT',
        body: updateData,
      })
      expect(result).toEqual(response)
    })
  })

  describe('delete', () => {
    it('calls $api with DELETE', async () => {
      const response: ApiResponse<void> = {
        success: true,
        message: 'User deleted',
        data: null,
        timestamp: '2024-01-01T00:00:00Z',
      }
      mockApi.mockResolvedValue(response)

      const result = await userService.delete(1)

      expect(mockApi).toHaveBeenCalledWith('/api/management/users/1', {
        method: 'DELETE',
      })
      expect(result).toEqual(response)
    })
  })

  describe('setEnabled', () => {
    it('calls $api with POST enable and the enabled flag', async () => {
      const response: ApiResponse<User> = {
        success: true,
        message: 'User enabled',
        data: { ...mockUser, enabled: true },
        timestamp: '2024-01-01T00:00:00Z',
      }
      mockApi.mockResolvedValue(response)

      const result = await userService.setEnabled(1, { enabled: true })

      expect(mockApi).toHaveBeenCalledWith('/api/management/users/1/enable', {
        method: 'POST',
        body: { enabled: true },
      })
      expect(result).toEqual(response)
    })
  })

  describe('assignRole', () => {
    it('calls $api with POST roles and the role name', async () => {
      const response: ApiResponse<User> = {
        success: true,
        message: 'Role assigned',
        data: { ...mockUser, roles: ['EMPLOYEE', 'ADMIN'] },
        timestamp: '2024-01-01T00:00:00Z',
      }
      mockApi.mockResolvedValue(response)

      const result = await userService.assignRole(1, { roleName: 'ADMIN' })

      expect(mockApi).toHaveBeenCalledWith('/api/management/users/1/roles', {
        method: 'POST',
        body: { roleName: 'ADMIN' },
      })
      expect(result).toEqual(response)
    })
  })

  describe('removeRole', () => {
    it('calls $api with DELETE roles and the role name', async () => {
      const response: ApiResponse<User> = {
        success: true,
        message: 'Role removed',
        data: { ...mockUser, roles: [] },
        timestamp: '2024-01-01T00:00:00Z',
      }
      mockApi.mockResolvedValue(response)

      const result = await userService.removeRole(1, { roleName: 'ADMIN' })

      expect(mockApi).toHaveBeenCalledWith('/api/management/users/1/roles', {
        method: 'DELETE',
        body: { roleName: 'ADMIN' },
      })
      expect(result).toEqual(response)
    })
  })
})
