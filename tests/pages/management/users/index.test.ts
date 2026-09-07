import { describe, expect, it, vi, beforeEach } from 'vitest'
import { nextTick, ref } from 'vue'
import type { VueWrapper } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Paginator from 'primevue/paginator'
import type { User } from '~/types/user'
import UsersPage from '~/pages/management/users/index.vue'

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
    users: [] as User[],
    fetchUsers: vi.fn(),
    setEnabled: vi.fn(),
    can: vi.fn(() => true),
    confirmRequire: vi.fn(),
    toastAdd: vi.fn(),
    pagination: {
      state: { page: 0, size: 20, sort: 'createdAt,desc', totalElements: 0, totalPages: 0 },
      onPageChange: vi.fn(),
      onSizeChange: vi.fn(),
    },
  },
}))

vi.mock('~/composables/useUsers', () => ({
  useUsers: () => ({
    users: ref(mocks.users),
    loading: ref(false),
    pagination: mocks.pagination,
    fetchUsers: mocks.fetchUsers,
    setEnabled: mocks.setEnabled,
  }),
}))

vi.mock('~/composables/useAuthorization', () => ({
  useAuthorization: () => ({
    can: mocks.can,
  }),
}))

vi.mock('primevue/useconfirm', () => ({
  PrimeVueConfirmSymbol: Symbol('PrimeVueConfirm'),
  useConfirm: () => ({ require: mocks.confirmRequire }),
}))

vi.mock('primevue/usetoast', () => ({
  PrimeVueToastSymbol: Symbol('PrimeVueToast'),
  useToast: () => ({ add: mocks.toastAdd }),
}))

// The dialogs are covered by their own component tests; stub them here so
// this test focuses on the page wiring (table events -> handlers -> services).
const userFormStub = {
  props: ['user', 'visible'],
  template: '<div data-test="user-form" :data-user="user ? user.id : \'\'" :data-visible="visible" />',
}

const userRoleDialogStub = {
  props: ['user', 'visible'],
  template: '<div data-test="user-role-dialog" :data-user="user ? user.id : \'\'" :data-visible="visible" />',
}

describe('users management page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.users.splice(0, mocks.users.length)
    mocks.can.mockReset()
    mocks.can.mockReturnValue(true)
  })

  async function mountPage() {
    return mountSuspended(UsersPage, {
      global: {
        stubs: {
          UserForm: userFormStub,
          UserRoleDialog: userRoleDialogStub,
          ConfirmDialog: true,
          Toast: true,
        },
      },
    })
  }

  function findButton(wrapper: VueWrapper, label: string) {
    return wrapper.findAll('button').find(b => b.text().includes(label))!
  }

  it('fetches users on mount', async () => {
    await mountPage()

    expect(mocks.fetchUsers).toHaveBeenCalledOnce()
  })

  it('renders users from the composable', async () => {
    mocks.users.push(mockUser)

    const wrapper = await mountPage()

    expect(wrapper.text()).toContain('john.doe')
    expect(wrapper.text()).toContain('john@example.com')
    expect(wrapper.text()).toContain('John Doe')
  })

  it('shows the New User button with USER_CREATE permission', async () => {
    const wrapper = await mountPage()

    expect(wrapper.text()).toContain('New User')
  })

  it('hides the New User button without USER_CREATE permission', async () => {
    mocks.can.mockReturnValue(false)

    const wrapper = await mountPage()

    expect(wrapper.text()).not.toContain('New User')
  })

  it('opens the create dialog from the New User button', async () => {
    const wrapper = await mountPage()

    await findButton(wrapper, 'New User').trigger('click')
    await nextTick()

    const createForm = wrapper.findAll('[data-test="user-form"]')[0]
    expect(createForm.attributes('data-user')).toBe('')
    expect(createForm.attributes('data-visible')).toBe('true')
  })

  it('closes the dialog and refetches users when the form is saved', async () => {
    mocks.users.push(mockUser)

    const wrapper = await mountPage()
    await findButton(wrapper, 'New User').trigger('click')
    await nextTick()

    const createForm = wrapper.findComponent(userFormStub)
    expect(createForm.attributes('data-visible')).toBe('true')

    await createForm.vm.$emit('saved')
    await nextTick()

    expect(createForm.attributes('data-visible')).toBe('false')
    expect(mocks.fetchUsers).toHaveBeenCalledTimes(2)
  })

  it('opens the edit dialog with the selected user', async () => {
    mocks.users.push(mockUser)

    const wrapper = await mountPage()
    await wrapper.find('[aria-label="Edit"]').trigger('click')
    await nextTick()

    const editForm = wrapper.findAll('[data-test="user-form"]')[1]
    expect(editForm.attributes('data-user')).toBe('1')
    expect(editForm.attributes('data-visible')).toBe('true')
  })

  it('confirms before disabling a user and calls setEnabled on accept', async () => {
    mocks.users.push(mockUser)
    mocks.setEnabled.mockResolvedValue({
      success: true,
      message: 'Disabled',
      data: { ...mockUser, enabled: false },
      timestamp: '2024-01-01T00:00:00Z',
    })

    const wrapper = await mountPage()
    await wrapper.find('[aria-label="Disable"]').trigger('click')

    expect(mocks.confirmRequire).toHaveBeenCalled()
    const config = mocks.confirmRequire.mock.calls[0][0]
    await config.accept()

    expect(mocks.setEnabled).toHaveBeenCalledWith(1, false)
    expect(mocks.toastAdd).toHaveBeenCalled()
  })

  it('refetches users on pagination change', async () => {
    mocks.users.push(mockUser)

    const wrapper = await mountPage()
    wrapper.findComponent(Paginator).vm.$emit('page', { page: 1, rows: 20 })
    await nextTick()

    expect(mocks.pagination.onPageChange).toHaveBeenCalledWith(1)
    expect(mocks.fetchUsers).toHaveBeenCalledTimes(2)
  })

  it('refetches users on page size change', async () => {
    mocks.users.push(mockUser)

    const wrapper = await mountPage()
    wrapper.findComponent(Paginator).vm.$emit('page', { page: 0, rows: 50 })
    await nextTick()

    expect(mocks.pagination.onSizeChange).toHaveBeenCalledWith(50)
    expect(mocks.fetchUsers).toHaveBeenCalledTimes(2)
  })

  it('opens the role dialog with the selected user', async () => {
    mocks.users.push(mockUser)

    const wrapper = await mountPage()
    await wrapper.find('[aria-label="Assign Role"]').trigger('click')
    await nextTick()

    const roleDialog = wrapper.find('[data-test="user-role-dialog"]')
    expect(roleDialog.attributes('data-user')).toBe('1')
    expect(roleDialog.attributes('data-visible')).toBe('true')
  })
})
