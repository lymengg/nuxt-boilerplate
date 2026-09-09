import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { nextTick, ref } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import type { Department } from '~/types/department'
import type { User } from '~/types/user'
import DepartmentForm from '~/components/departments/DepartmentForm.vue'

const mockDepartment: Department = {
  id: 1,
  name: 'Engineering',
  tenantId: 2,
  tenantName: 'Acme',
  managerIds: [5],
  managerEmails: ['jane@example.com'],
}

const mockUser: User = {
  id: 5,
  email: 'jane@example.com',
  firstName: 'Jane',
  lastName: 'Doe',
  enabled: true,
  accountNonLocked: true,
  departmentId: 1,
  departmentName: 'Engineering',
  roles: ['EMPLOYEE'],
  permissions: [],
  mfaEnabled: false,
  mfaMethod: null,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const okResponse = { success: true, message: 'ok', data: mockDepartment, timestamp: '' }

const { useDepartmentsMock, useTenantsMock, useUsersMock } = vi.hoisted(() => ({
  useDepartmentsMock: vi.fn(),
  useTenantsMock: vi.fn(),
  useUsersMock: vi.fn(),
}))

vi.mock('~/composables/useDepartments', () => ({ useDepartments: () => useDepartmentsMock() }))
vi.mock('~/composables/useTenants', () => ({ useTenants: () => useTenantsMock() }))
vi.mock('~/composables/useUsers', () => ({ useUsers: () => useUsersMock() }))

const dialogStub = {
  inheritAttrs: false,
  template: '<div><h1>{{ $attrs.header }}</h1><slot /><slot name="footer" /></div>',
}

function setupMocks() {
  useDepartmentsMock.mockReturnValue({
    createDepartment: vi.fn().mockResolvedValue(okResponse),
    updateDepartment: vi.fn().mockResolvedValue(okResponse),
  })
  useTenantsMock.mockReturnValue({
    allTenants: ref([{ id: 2, name: 'Acme', status: 'ACTIVE', createdAt: '' }]),
    fetchAllTenants: vi.fn(),
  })
  useUsersMock.mockReturnValue({
    users: ref([mockUser]),
    fetchUsers: vi.fn(),
  })
}

async function mountForm(department?: Department) {
  const wrapper = await mountSuspended(DepartmentForm, {
    props: { visible: false, department },
    global: { stubs: { Dialog: dialogStub } },
  })
  await wrapper.setProps({ visible: true })
  await nextTick()
  await flushPromises()
  await new Promise(resolve => setTimeout(resolve, 20))
  return wrapper
}

async function submit(wrapper: Awaited<ReturnType<typeof mountForm>>) {
  await wrapper.find('form').trigger('submit')
  await flushPromises()
  await new Promise(resolve => setTimeout(resolve, 20))
  await flushPromises()
  await nextTick()
}

describe('DepartmentForm', () => {
  let mounted: Awaited<ReturnType<typeof mountForm>> | undefined

  beforeEach(() => {
    vi.clearAllMocks()
    setupMocks()
  })

  afterEach(() => {
    mounted?.unmount()
    mounted = undefined
  })

  it('fetches tenants on open and users after a tenant selection', async () => {
    mounted = await mountForm()

    expect(useTenantsMock().fetchAllTenants).toHaveBeenCalled()
    // fetchUsers runs when a tenant is chosen (or in edit mode).
    expect(useUsersMock().fetchUsers).not.toHaveBeenCalled()

    const tenantSelect = mounted.findAllComponents({ name: 'Select' }).find(s => s.attributes('id') === 'tenant')!
    await tenantSelect.vm.$emit('update:modelValue', 2)
    await flushPromises()
    await new Promise(resolve => setTimeout(resolve, 20))

    expect(useUsersMock().fetchUsers).toHaveBeenCalled()
  })

  it('creates a department with tenant and managers', async () => {
    const wrapper = await mountForm()
    mounted = wrapper

    // Tenant first: the tenant change resets managers (and clears other
    // fields), so it must happen before filling the name.
    const tenantSelect = wrapper.findAllComponents({ name: 'Select' }).find(s => s.attributes('id') === 'tenant')!
    await tenantSelect.vm.$emit('update:modelValue', 2)
    await flushPromises()
    await new Promise(resolve => setTimeout(resolve, 20))

    await wrapper.find('#name').setValue('Design')
    // Pick a manager (users of that tenant).
    const managers = wrapper.findComponent({ name: 'MultiSelect' })
    await managers.vm.$emit('update:modelValue', [5])
    await submit(wrapper)

    const { createDepartment } = useDepartmentsMock()
    expect(createDepartment).toHaveBeenCalledWith({ name: 'Design', tenantId: 2, managerIds: [5] })
    expect(wrapper.emitted('saved')).toHaveLength(1)
  })

  it('updates a department without tenant in edit mode', async () => {
    const wrapper = await mountForm(mockDepartment)
    mounted = wrapper

    await wrapper.find('#name').setValue('Renamed')
    await submit(wrapper)

    const { updateDepartment } = useDepartmentsMock()
    expect(updateDepartment).toHaveBeenCalledWith(1, { name: 'Renamed', managerIds: [5] })
    expect(wrapper.emitted('saved')).toHaveLength(1)
  })

  it('does not submit when the name is missing', async () => {
    const wrapper = await mountForm()
    mounted = wrapper

    await submit(wrapper)

    const { createDepartment } = useDepartmentsMock()
    expect(createDepartment).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Name is required')
    expect(wrapper.text()).toContain('Tenant is required')
  })

  it('shows a general error when the create call fails', async () => {
    const { createDepartment } = useDepartmentsMock()
    createDepartment.mockRejectedValue(new Error('backend rejected'))
    const wrapper = await mountForm()
    mounted = wrapper

    const tenantSelect = wrapper.findAllComponents({ name: 'Select' }).find(s => s.attributes('id') === 'tenant')!
    await tenantSelect.vm.$emit('update:modelValue', 2)
    await flushPromises()
    await new Promise(resolve => setTimeout(resolve, 20))
    await wrapper.find('#name').setValue('Design')
    await submit(wrapper)

    expect(wrapper.text()).toContain('backend rejected')
    expect(wrapper.emitted('saved')).toBeUndefined()
  })
})
