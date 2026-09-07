import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import type { VueWrapper } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Password from 'primevue/password'
import type { User } from '~/types/user'
import type { Tenant } from '~/types/tenant'
import type { Role } from '~/types/role'
import type { Department } from '~/types/department'
import UserForm from '~/components/users/UserForm.vue'

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

const { mocks } = vi.hoisted(() => ({
  mocks: {
    createUser: vi.fn(),
    updateUser: vi.fn(),
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
    updateUser: mocks.updateUser,
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

// PrimeVue Dialog teleports to body; render its slots inline so assertions
// see the dialog content.
const dialogStub = {
  template: '<div><slot /><slot name="footer" /></div>',
}

describe('UserForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.hasRole.mockReset()
    mocks.hasRole.mockReturnValue(false)
    mocks.allTenants.splice(0, mocks.allTenants.length)
    mocks.allRoles.splice(0, mocks.allRoles.length)
    mocks.allDepartments.splice(0, mocks.allDepartments.length)
  })

  async function mountForm(user?: User) {
    const wrapper = await mountSuspended(UserForm, {
      props: { user, visible: false },
      global: { stubs: { Dialog: dialogStub } },
    })
    await wrapper.setProps({ visible: true })
    return wrapper
  }

  function findButton(wrapper: VueWrapper, label: string) {
    return wrapper.findAll('button').find(b => b.text().includes(label))!
  }

  function findSelect(wrapper: VueWrapper, id: string) {
    return wrapper.findComponent(`#${id}`) as VueWrapper<any>
  }

  it('fetches dropdown data when opened', async () => {
    await mountForm()

    expect(mocks.fetchAllTenants).toHaveBeenCalledOnce()
    expect(mocks.fetchAllRoles).toHaveBeenCalledOnce()
    expect(mocks.fetchAllDepartments).toHaveBeenCalledOnce()
  })

  it('renders create fields in create mode', async () => {
    const wrapper = await mountForm()

    expect(wrapper.find('#username').exists()).toBe(true)
    expect(wrapper.find('#email').exists()).toBe(true)
    expect(wrapper.find('#password').exists()).toBe(true)
    expect(wrapper.find('#roleName').exists()).toBe(true)
    expect(wrapper.find('#department').exists()).toBe(true)
    // Regular admins cannot pick a tenant.
    expect(wrapper.find('#tenant').exists()).toBe(false)
  })

  it('shows the tenant select for super admins', async () => {
    mocks.hasRole.mockReturnValue(true)

    const wrapper = await mountForm()

    expect(wrapper.find('#tenant').exists()).toBe(true)
  })

  it('clears the department and filters options when the tenant changes', async () => {
    mocks.hasRole.mockReturnValue(true)
    mocks.allTenants.push(
      { id: 1, name: 'Tenant A', status: 'ACTIVE', createdAt: '2024-01-01T00:00:00Z' },
      { id: 2, name: 'Tenant B', status: 'ACTIVE', createdAt: '2024-01-01T00:00:00Z' },
    )
    mocks.allDepartments.push(
      { id: 1, name: 'Dept A', tenantId: 1, tenantName: 'Tenant A', managerIds: [], managerUsernames: [] },
      { id: 2, name: 'Dept B', tenantId: 2, tenantName: 'Tenant B', managerIds: [], managerUsernames: [] },
    )

    const wrapper = await mountForm()
    const tenantSelect = findSelect(wrapper, 'tenant')

    await tenantSelect.vm.$emit('update:modelValue', 2)

    expect(findSelect(wrapper, 'department').props('modelValue')).toBeNull()
    expect(findSelect(wrapper, 'department').props('options')).toEqual([
      { id: 2, name: 'Dept B', tenantId: 2, tenantName: 'Tenant B', managerIds: [], managerUsernames: [] },
    ])
  })

  it('hides create fields and pre-fills values in edit mode', async () => {
    const wrapper = await mountForm(mockUser)

    expect(wrapper.find('#username').exists()).toBe(false)
    expect(wrapper.find('#email').exists()).toBe(false)
    expect(wrapper.find('#password').exists()).toBe(false)

    expect((wrapper.find('#firstName').element as HTMLInputElement).value).toBe('John')
    expect((wrapper.find('#lastName').element as HTMLInputElement).value).toBe('Doe')
    expect(findSelect(wrapper, 'department').props('modelValue')).toBe(1)
  })

  it('shows validation errors when submitting an empty create form', async () => {
    const wrapper = await mountForm()

    await findButton(wrapper, 'Create').trigger('click')

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('Username is required')
    })
    expect(wrapper.text()).toContain('Email is required')
    expect(wrapper.text()).toContain('Password is required')
    expect(wrapper.text()).toContain('Department is required')
    expect(mocks.createUser).not.toHaveBeenCalled()
  })

  it('preserves entered values when validation fails', async () => {
    const wrapper = await mountForm()

    await wrapper.find('#username').setValue('jane.doe')
    await wrapper.find('#email').setValue('jane@example.com')
    await wrapper.findComponent(Password).setValue('Password123')

    await findButton(wrapper, 'Create').trigger('click')

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('Department is required')
    })
    expect((wrapper.find('#username').element as HTMLInputElement).value).toBe('jane.doe')
    expect((wrapper.find('#email').element as HTMLInputElement).value).toBe('jane@example.com')
    expect(mocks.createUser).not.toHaveBeenCalled()
  })

  it('creates a user with the mapped payload and emits saved', async () => {
    mocks.createUser.mockResolvedValue({
      success: true,
      message: 'User created',
      data: mockUser,
      timestamp: '2024-01-01T00:00:00Z',
    })

    const wrapper = await mountForm()

    await wrapper.find('#username').setValue('jane.doe')
    await wrapper.find('#email').setValue('jane@example.com')
    await wrapper.findComponent(Password).setValue('Password123')
    await wrapper.find('#firstName').setValue('Jane')
    await wrapper.find('#lastName').setValue('Doe')
    await findSelect(wrapper, 'department').vm.$emit('update:modelValue', 1)

    await findButton(wrapper, 'Create').trigger('click')

    await vi.waitFor(() => {
      expect(mocks.createUser).toHaveBeenCalled()
    })
    expect(mocks.createUser).toHaveBeenCalledWith({
      username: 'jane.doe',
      email: 'jane@example.com',
      password: 'Password123',
      firstName: 'Jane',
      lastName: 'Doe',
      roleName: 'EMPLOYEE',
      tenantId: undefined,
      departmentId: 1,
    })
    expect(wrapper.emitted('saved')).toBeTruthy()
    expect(wrapper.emitted('update:visible')).toEqual([[false]])
  })

  it('updates a user with the mapped payload in edit mode', async () => {
    mocks.updateUser.mockResolvedValue({
      success: true,
      message: 'User updated',
      data: mockUser,
      timestamp: '2024-01-01T00:00:00Z',
    })

    const wrapper = await mountForm(mockUser)

    await wrapper.find('#firstName').setValue('Jane')

    await findButton(wrapper, 'Update').trigger('click')

    await vi.waitFor(() => {
      expect(mocks.updateUser).toHaveBeenCalled()
    })
    expect(mocks.updateUser).toHaveBeenCalledWith(1, {
      firstName: 'Jane',
      lastName: 'Doe',
      departmentId: 1,
    })
    expect(wrapper.emitted('saved')).toBeTruthy()
  })

  it('shows the error message when creating a user fails', async () => {
    mocks.createUser.mockRejectedValue(new Error('Server error'))

    const wrapper = await mountForm()

    await wrapper.find('#username').setValue('jane.doe')
    await wrapper.find('#email').setValue('jane@example.com')
    await wrapper.findComponent(Password).setValue('Password123')
    await findSelect(wrapper, 'department').vm.$emit('update:modelValue', 1)

    await findButton(wrapper, 'Create').trigger('click')

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('Server error')
    })
    expect(wrapper.emitted('saved')).toBeFalsy()
  })
})
