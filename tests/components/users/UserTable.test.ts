import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Paginator from 'primevue/paginator'
import type { User } from '~/types/user'
import type { PaginationState } from '~/types/api'
import UserTable from '~/components/users/UserTable.vue'

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

const mockUsers: User[] = [mockUser]

const pagination: { state: PaginationState } = {
  state: { page: 0, size: 20, sort: 'createdAt,desc', totalElements: 1, totalPages: 1 },
}

describe('UserTable', () => {
  it('renders user rows with username, email, name, status and roles', async () => {
    const wrapper = await mountSuspended(UserTable, {
      props: { users: mockUsers, loading: false, pagination },
    })

    expect(wrapper.text()).toContain('john.doe')
    expect(wrapper.text()).toContain('john@example.com')
    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('Active')
    expect(wrapper.text()).toContain('EMPLOYEE')
  })

  it('renders empty state when there are no users', async () => {
    const wrapper = await mountSuspended(UserTable, {
      props: { users: [], loading: false, pagination },
    })

    expect(wrapper.text()).toContain('No users found')
  })

  it('emits edit with the user', async () => {
    const wrapper = await mountSuspended(UserTable, {
      props: { users: mockUsers, loading: false, pagination },
    })

    await wrapper.find('[aria-label="Edit"]').trigger('click')

    expect(wrapper.emitted('edit')).toEqual([[mockUser]])
  })

  it('emits toggleEnabled with the user', async () => {
    const wrapper = await mountSuspended(UserTable, {
      props: { users: mockUsers, loading: false, pagination },
    })

    await wrapper.find('[aria-label="Disable"]').trigger('click')

    expect(wrapper.emitted('toggleEnabled')).toEqual([[mockUser]])
  })

  it('emits assignRole with the user', async () => {
    const wrapper = await mountSuspended(UserTable, {
      props: { users: mockUsers, loading: false, pagination },
    })

    await wrapper.find('[aria-label="Assign Role"]').trigger('click')

    expect(wrapper.emitted('assignRole')).toEqual([[mockUser]])
  })

  it('emits page on paginator page change', async () => {
    const wrapper = await mountSuspended(UserTable, {
      props: { users: mockUsers, loading: false, pagination },
    })

    wrapper.findComponent(Paginator).vm.$emit('page', { page: 1, rows: 20 })
    await nextTick()

    expect(wrapper.emitted('page')).toEqual([[1]])
  })

  it('emits sizeChange when rows per page changes', async () => {
    const wrapper = await mountSuspended(UserTable, {
      props: { users: mockUsers, loading: false, pagination },
    })

    wrapper.findComponent(Paginator).vm.$emit('page', { page: 0, rows: 50 })
    await nextTick()

    expect(wrapper.emitted('sizeChange')).toEqual([[50]])
  })
})
