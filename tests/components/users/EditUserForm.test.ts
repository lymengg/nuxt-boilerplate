import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ref, type ComponentPublicInstance } from 'vue'
import type { VueWrapper } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { User } from '~/types/user'
import type { Department } from '~/types/department'
import EditUserForm from '~/components/users/EditUserForm.vue'

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

const { mocks } = vi.hoisted(() => ({
  mocks: {
    updateUser: vi.fn(),
    fetchAllDepartments: vi.fn(),
    getErrorMessage: vi.fn((e: unknown) => (e instanceof Error ? e.message : 'An unexpected error occurred')),
    allDepartments: [] as Department[],
  },
}))

vi.mock('~/composables/useUsers', () => ({
  useUsers: () => ({
    updateUser: mocks.updateUser,
  }),
}))

vi.mock('~/composables/useDepartments', () => ({
  useDepartments: () => ({
    allDepartments: ref(mocks.allDepartments),
    fetchAllDepartments: mocks.fetchAllDepartments,
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

describe('EditUserForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.allDepartments.splice(0, mocks.allDepartments.length)
  })

  async function mountForm(user: User) {
    const wrapper = await mountSuspended(EditUserForm, {
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
    return wrapper.findComponent(`#${id}`) as VueWrapper<ComponentPublicInstance<Record<string, unknown>>>
  }

  it('fetches departments and pre-fills values when opened', async () => {
    const wrapper = await mountForm(mockUser)

    expect(mocks.fetchAllDepartments).toHaveBeenCalledOnce()

    expect(wrapper.find('#email').exists()).toBe(false)
    expect(wrapper.find('#password').exists()).toBe(false)

    expect((wrapper.find('#firstName').element as HTMLInputElement).value).toBe('John')
    expect((wrapper.find('#lastName').element as HTMLInputElement).value).toBe('Doe')
    expect(findSelect(wrapper, 'department').props('modelValue')).toBe(1)
  })

  it('updates a user with the mapped payload', async () => {
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
    expect(wrapper.emitted('update:visible')).toEqual([[false]])
  })

  it('hides the department field and omits departmentId when editing a platform admin', async () => {
    mocks.updateUser.mockResolvedValue({
      success: true,
      message: 'User updated',
      data: mockUser,
      timestamp: '2024-01-01T00:00:00Z',
    })

    const wrapper = await mountForm({
      ...mockUser,
      roles: ['PLATFORM_ADMIN'],
      departmentId: null,
      departmentName: null,
    })

    expect(wrapper.find('#department').exists()).toBe(false)

    await wrapper.find('#firstName').setValue('Jane')
    await findButton(wrapper, 'Update').trigger('click')

    await vi.waitFor(() => {
      expect(mocks.updateUser).toHaveBeenCalled()
    })
    expect(mocks.updateUser).toHaveBeenCalledWith(1, {
      firstName: 'Jane',
      lastName: 'Doe',
    })
  })

  it('shows the error message when updating a user fails', async () => {
    mocks.updateUser.mockRejectedValue(new Error('Update rejected'))

    const wrapper = await mountForm(mockUser)

    await wrapper.find('#firstName').setValue('Jane')
    await findButton(wrapper, 'Update').trigger('click')

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('Update rejected')
    })
    expect(wrapper.emitted('saved')).toBeFalsy()
  })

  it('closes the dialog when Cancel is clicked', async () => {
    const wrapper = await mountForm(mockUser)

    await findButton(wrapper, 'Cancel').trigger('click')

    expect(wrapper.emitted('update:visible')).toEqual([[false]])
  })
})
