import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ref, type ComponentPublicInstance } from 'vue'
import type { VueWrapper } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Password from 'primevue/password'
import type { Tenant } from '~/types/tenant'
import type { Role } from '~/types/role'
import type { Department } from '~/types/department'
import CreateUserForm from '~/components/users/CreateUserForm.vue'

const mockUser = {
  id: 1,
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  enabled: true,
  roles: ['EMPLOYEE'],
  mfaEnabled: false,
  mfaMethod: 'NONE',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const { mocks } = vi.hoisted(() => ({
  mocks: {
    createUser: vi.fn(),
    fetchAllTenants: vi.fn(),
    fetchAllRoles: vi.fn(),
    fetchAllDepartments: vi.fn(),
    getErrorMessage: vi.fn((e: unknown) => (e instanceof Error ? e.message : 'An unexpected error occurred')),
    hasRole: vi.fn(() => false),
    allTenants: [] as Tenant[],
    allRoles: [] as Role[],
    allDepartments: [] as Department[],
  },
}))

vi.mock('~/composables/useUsers', () => ({
  useUsers: () => ({
    createUser: mocks.createUser,
  }),
}))

vi.mock('~/composables/useTenants', () => ({
  useTenants: () => ({
    allTenants: ref(mocks.allTenants),
    fetchAllTenants: mocks.fetchAllTenants,
  }),
}))

vi.mock('~/composables/useRoles', () => ({
  useRoles: () => ({
    allRoles: ref(mocks.allRoles),
    fetchAllRoles: mocks.fetchAllRoles,
  }),
}))

vi.mock('~/composables/useDepartments', () => ({
  useDepartments: () => ({
    allDepartments: ref(mocks.allDepartments),
    fetchAllDepartments: mocks.fetchAllDepartments,
  }),
}))

vi.mock('~/composables/useAuthorization', () => ({
  useAuthorization: () => ({
    hasRole: mocks.hasRole,
  }),
}))

vi.mock('~/composables/useApiError', () => ({
  useApiError: () => ({
    getErrorMessage: mocks.getErrorMessage,
  }),
}))

const dialogStub = {
  template: '<div><slot /><slot name="footer" /></div>',
}

describe('CreateUserForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.hasRole.mockReset()
    mocks.hasRole.mockReturnValue(false)
    mocks.allTenants.splice(0, mocks.allTenants.length)
    mocks.allRoles.splice(0, mocks.allRoles.length)
    mocks.allDepartments.splice(0, mocks.allDepartments.length)
  })

  async function mountForm() {
    const wrapper = await mountSuspended(CreateUserForm, {
      props: { visible: false },
      global: { stubs: { Dialog: dialogStub } },
    })
    await wrapper.setProps({ visible: true })
    return wrapper
  }

  function findButton(wrapper: VueWrapper, label: string) {
    return wrapper.findAll('button').find(b => b.text().includes(label))!
  }

  function findSelect(wrapper: VueWrapper, id: string) {
    return wrapper.findComponent(`#${id}`) as VueWrapper<ComponentPublicInstance<Record<string, unknown>>>
  }

  it('fetches dropdown data when opened', async () => {
    await mountForm()

    expect(mocks.fetchAllTenants).toHaveBeenCalledOnce()
    expect(mocks.fetchAllRoles).toHaveBeenCalledOnce()
    expect(mocks.fetchAllDepartments).toHaveBeenCalledOnce()
  })

  it('renders create fields', async () => {
    const wrapper = await mountForm()

    expect(wrapper.find('#email').exists()).toBe(true)
    expect(wrapper.find('#password').exists()).toBe(true)
    expect(wrapper.find('#roleName').exists()).toBe(true)
    expect(wrapper.find('#department').exists()).toBe(true)
    expect(wrapper.find('#tenant').exists()).toBe(false)
  })

  it('shows the tenant select for super admins', async () => {
    mocks.hasRole.mockReturnValue(true)

    const wrapper = await mountForm()

    expect(wrapper.find('#tenant').exists()).toBe(true)
  })

  it('clears only the department when the tenant changes', async () => {
    mocks.hasRole.mockReturnValue(true)
    mocks.createUser.mockResolvedValue({
      success: true,
      message: 'User created',
      data: mockUser,
      timestamp: '2024-01-01T00:00:00Z',
    })
    mocks.allTenants.push(
      { id: 1, name: 'Tenant A', status: 'ACTIVE', createdAt: '2024-01-01T00:00:00Z' },
      { id: 2, name: 'Tenant B', status: 'ACTIVE', createdAt: '2024-01-01T00:00:00Z' },
    )
    mocks.allDepartments.push(
      { id: 1, name: 'Dept A', tenantId: 1, tenantName: 'Tenant A', managerIds: [], managerEmails: [] },
      { id: 2, name: 'Dept B', tenantId: 2, tenantName: 'Tenant B', managerIds: [], managerEmails: [] },
    )

    const wrapper = await mountForm()

    await wrapper.find('#email').setValue('jane@example.com')
    await wrapper.findComponent(Password).setValue('Password123!')
    await wrapper.find('#firstName').setValue('Jane')
    await wrapper.find('#lastName').setValue('Doe')

    const tenantSelect = findSelect(wrapper, 'tenant')
    await tenantSelect.vm.$emit('update:modelValue', 2)

    expect(findSelect(wrapper, 'department').props('modelValue')).toBeNull()
    expect(findSelect(wrapper, 'department').props('options')).toEqual([
      { id: 2, name: 'Dept B', tenantId: 2, tenantName: 'Tenant B', managerIds: [], managerEmails: [] },
    ])

    expect((wrapper.find('#email').element as HTMLInputElement).value).toBe('jane@example.com')
    expect((wrapper.find('#firstName').element as HTMLInputElement).value).toBe('Jane')
    expect((wrapper.find('#lastName').element as HTMLInputElement).value).toBe('Doe')

    await findSelect(wrapper, 'department').vm.$emit('update:modelValue', 2)
    await findButton(wrapper, 'Create').trigger('click')

    await vi.waitFor(() => {
      expect(mocks.createUser).toHaveBeenCalled()
    })
    expect(mocks.createUser).toHaveBeenCalledWith(expect.objectContaining({
      email: 'jane@example.com',
      password: 'Password123!',
      firstName: 'Jane',
      lastName: 'Doe',
      roleName: 'EMPLOYEE',
      tenantId: 2,
      departmentId: 2,
    }))
  })

  it('shows validation errors when submitting an empty form', async () => {
    const wrapper = await mountForm()

    await findButton(wrapper, 'Create').trigger('click')

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('Email is required')
    })
    expect(wrapper.text()).toContain('Password is required')
    expect(wrapper.text()).toContain('Department is required')
    expect(mocks.createUser).not.toHaveBeenCalled()
  })

  it('rejects an invalid email format', async () => {
    const wrapper = await mountForm()

    await wrapper.find('#email').setValue('not-an-email')
    await findButton(wrapper, 'Create').trigger('click')

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('Please enter a valid email address')
    })
    expect(mocks.createUser).not.toHaveBeenCalled()
  })

  it('rejects a password without a special character', async () => {
    const wrapper = await mountForm()

    await wrapper.find('#email').setValue('jane@example.com')
    await wrapper.findComponent(Password).setValue('Password123')
    await findSelect(wrapper, 'department').vm.$emit('update:modelValue', 1)
    await findButton(wrapper, 'Create').trigger('click')

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    })
    expect(mocks.createUser).not.toHaveBeenCalled()
  })

  it('preserves entered values when validation fails', async () => {
    const wrapper = await mountForm()

    await wrapper.find('#email').setValue('jane@example.com')
    await wrapper.findComponent(Password).setValue('Password123!')

    await findButton(wrapper, 'Create').trigger('click')

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('Department is required')
    })
    expect((wrapper.find('#email').element as HTMLInputElement).value).toBe('jane@example.com')
    expect(mocks.createUser).not.toHaveBeenCalled()
  })

  it('hides department and tenant for PLATFORM_ADMIN and omits them from payload', async () => {
    mocks.hasRole.mockReturnValue(true)
    mocks.createUser.mockResolvedValue({
      success: true,
      message: 'User created',
      data: { ...mockUser, id: 2, email: 'admin@example.com', roles: ['PLATFORM_ADMIN'] },
      timestamp: '2024-01-01T00:00:00Z',
    })
    mocks.allRoles.push({ id: 1, name: 'PLATFORM_ADMIN', title: 'Platform Admin', description: null, permissions: [] })

    const wrapper = await mountForm()

    await wrapper.find('#email').setValue('admin@example.com')
    await wrapper.findComponent(Password).setValue('Password123!')

    const roleSelect = findSelect(wrapper, 'roleName')
    await roleSelect.vm.$emit('update:modelValue', 'PLATFORM_ADMIN')
    await findButton(wrapper, 'Create').trigger('click')

    await vi.waitFor(() => {
      expect(mocks.createUser).toHaveBeenCalled()
    })
    expect(wrapper.find('#department').exists()).toBe(false)
    expect(wrapper.find('#tenant').exists()).toBe(false)
    const [call] = mocks.createUser.mock.calls[0] as [Record<string, unknown>]
    expect(call).toEqual(expect.objectContaining({
      email: 'admin@example.com',
      password: 'Password123!',
      roleName: 'PLATFORM_ADMIN',
    }))
    expect(call).not.toHaveProperty('departmentId')
    expect(call).not.toHaveProperty('tenantId')
    expect(wrapper.emitted('saved')).toBeTruthy()
    expect(wrapper.emitted('update:visible')).toEqual([[false]])
  })

  it('creates a user with the mapped payload and emits saved', async () => {
    mocks.createUser.mockResolvedValue({
      success: true,
      message: 'User created',
      data: mockUser,
      timestamp: '2024-01-01T00:00:00Z',
    })

    const wrapper = await mountForm()

    await wrapper.find('#email').setValue('jane@example.com')
    await wrapper.findComponent(Password).setValue('Password123!')
    await wrapper.find('#firstName').setValue('Jane')
    await wrapper.find('#lastName').setValue('Doe')
    await findSelect(wrapper, 'department').vm.$emit('update:modelValue', 1)

    await findButton(wrapper, 'Create').trigger('click')

    await vi.waitFor(() => {
      expect(mocks.createUser).toHaveBeenCalled()
    })
    expect(mocks.createUser).toHaveBeenCalledWith({
      email: 'jane@example.com',
      password: 'Password123!',
      firstName: 'Jane',
      lastName: 'Doe',
      roleName: 'EMPLOYEE',
      tenantId: undefined,
      departmentId: 1,
    })
    expect(wrapper.emitted('saved')).toBeTruthy()
    expect(wrapper.emitted('update:visible')).toEqual([[false]])
  })

  it('shows the error message when creating a user fails', async () => {
    mocks.createUser.mockRejectedValue(new Error('Server error'))

    const wrapper = await mountForm()

    await wrapper.find('#email').setValue('jane@example.com')
    await wrapper.findComponent(Password).setValue('Password123!')
    await findSelect(wrapper, 'department').vm.$emit('update:modelValue', 1)

    await findButton(wrapper, 'Create').trigger('click')

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('Server error')
    })
    expect(wrapper.emitted('saved')).toBeFalsy()
  })

  it('closes the dialog when Cancel is clicked', async () => {
    const wrapper = await mountForm()

    await findButton(wrapper, 'Cancel').trigger('click')

    expect(wrapper.emitted('update:visible')).toEqual([[false]])
  })
})
