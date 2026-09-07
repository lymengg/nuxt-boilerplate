import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import type { User } from '~/types/user'
import UserRoleDialog from '~/components/users/UserRoleDialog.vue'

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
    assignRole: vi.fn(),
    removeRole: vi.fn(),
    fetchAllRoles: vi.fn(),
    getErrorMessage: vi.fn((e: unknown) => (e instanceof Error ? e.message : 'An unexpected error occurred')),
    allRoles: [] as Array<{ id: number, name: string }>,
  },
}))

vi.mock('~/composables/useUsers', () => ({
  useUsers: () => ({
    assignRole: mocks.assignRole,
    removeRole: mocks.removeRole,
  }),
}))

vi.mock('~/composables/useRoles', () => ({
  useRoles: () => ({
    allRoles: ref(mocks.allRoles),
    fetchAllRoles: mocks.fetchAllRoles,
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

describe('UserRoleDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.allRoles.splice(0, mocks.allRoles.length)
  })

  async function mountDialog(user: User | null | undefined = mockUser) {
    const wrapper = await mountSuspended(UserRoleDialog, {
      props: { user, visible: false },
      global: { stubs: { Dialog: dialogStub } },
    })
    await wrapper.setProps({ visible: true })
    return wrapper
  }

  function findButton(wrapper: VueWrapper, label: string) {
    return wrapper.findAll('button').find(b => b.text().includes(label))!
  }

  it('fetches roles when opened', async () => {
    await mountDialog()

    expect(mocks.fetchAllRoles).toHaveBeenCalledOnce()
  })

  it('renders current roles as tags', async () => {
    const wrapper = await mountDialog()

    expect(wrapper.text()).toContain('EMPLOYEE')
  })

  it('shows no roles assigned message when the user has no roles', async () => {
    const wrapper = await mountDialog({ ...mockUser, roles: [] })

    expect(wrapper.text()).toContain('No roles assigned')
  })

  it('only offers roles the user does not already have', async () => {
    mocks.allRoles.push(
      { id: 1, name: 'EMPLOYEE' },
      { id: 2, name: 'ADMIN' },
      { id: 3, name: 'MANAGER' },
    )

    const wrapper = await mountDialog()
    const select = wrapper.findComponent(Select)

    expect(select.props('options')).toEqual([
      { id: 2, name: 'ADMIN' },
      { id: 3, name: 'MANAGER' },
    ])
  })

  it('adds a role, emits saved and clears the selection', async () => {
    mocks.allRoles.push({ id: 2, name: 'ADMIN' })
    mocks.assignRole.mockResolvedValue({
      success: true,
      message: 'Role assigned',
      data: { ...mockUser, roles: ['EMPLOYEE', 'ADMIN'] },
      timestamp: '2024-01-01T00:00:00Z',
    })

    const wrapper = await mountDialog()
    const select = wrapper.findComponent(Select)

    await select.vm.$emit('update:modelValue', 'ADMIN')
    await findButton(wrapper, 'Add Role').trigger('click')
    await flushPromises()

    expect(mocks.assignRole).toHaveBeenCalledWith(1, 'ADMIN')
    expect(wrapper.emitted('saved')).toBeTruthy()
    expect(select.props('modelValue')).toBeNull()
  })

  it('removes a role and emits saved', async () => {
    mocks.removeRole.mockResolvedValue({
      success: true,
      message: 'Role removed',
      data: { ...mockUser, roles: [] },
      timestamp: '2024-01-01T00:00:00Z',
    })

    const wrapper = await mountDialog()
    const roleTag = wrapper.findAllComponents(Tag)[0]

    await roleTag.vm.$emit('remove')
    await flushPromises()

    expect(mocks.removeRole).toHaveBeenCalledWith(1, 'EMPLOYEE')
    expect(wrapper.emitted('saved')).toBeTruthy()
  })

  it('shows the error message when adding a role fails', async () => {
    mocks.allRoles.push({ id: 2, name: 'ADMIN' })
    mocks.assignRole.mockRejectedValue(new Error('Server error'))

    const wrapper = await mountDialog()
    const select = wrapper.findComponent(Select)

    await select.vm.$emit('update:modelValue', 'ADMIN')
    await findButton(wrapper, 'Add Role').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Server error')
    expect(wrapper.emitted('saved')).toBeFalsy()
  })

  it('shows the error message when removing a role fails', async () => {
    mocks.removeRole.mockRejectedValue(new Error('Server error'))

    const wrapper = await mountDialog()
    const roleTag = wrapper.findAllComponents(Tag)[0]

    await roleTag.vm.$emit('remove')
    await flushPromises()

    expect(wrapper.text()).toContain('Server error')
    expect(wrapper.emitted('saved')).toBeFalsy()
  })

  it('closes the dialog when Close is clicked', async () => {
    const wrapper = await mountDialog()

    await findButton(wrapper, 'Close').trigger('click')

    expect(wrapper.emitted('update:visible')).toEqual([[false]])
  })
})
