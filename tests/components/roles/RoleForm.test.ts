import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import type { Role } from '~/types/role'
import RoleForm from '~/components/roles/RoleForm.vue'

const mockRole: Role = {
  id: 1,
  name: 'EXPENSE_MANAGER',
  title: 'Expense Manager',
  description: 'Manages expenses',
  permissions: ['EXPENSE_READ'],
}

const okResponse = { success: true, message: 'ok', data: mockRole, timestamp: '' }

const { useRolesMock } = vi.hoisted(() => ({
  useRolesMock: vi.fn(),
}))

vi.mock('~/composables/useRoles', () => ({ useRoles: () => useRolesMock() }))

const dialogStub = {
  inheritAttrs: false,
  template: '<div><h1>{{ $attrs.header }}</h1><slot /><slot name="footer" /></div>',
}

function setupMocks() {
  useRolesMock.mockReturnValue({
    createRole: vi.fn().mockResolvedValue(okResponse),
    updateRole: vi.fn().mockResolvedValue(okResponse),
  })
}

async function mountForm(role?: Role) {
  const wrapper = await mountSuspended(RoleForm, {
    props: { visible: false, role },
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

describe('RoleForm', () => {
  let mounted: Awaited<ReturnType<typeof mountForm>> | undefined

  beforeEach(() => {
    vi.clearAllMocks()
    setupMocks()
  })

  afterEach(() => {
    mounted?.unmount()
    mounted = undefined
  })

  it('creates a role with the full body', async () => {
    const wrapper = await mountForm()
    mounted = wrapper

    await wrapper.find('#name').setValue('AUDITOR')
    await wrapper.find('#title').setValue('Auditor')
    await submit(wrapper)

    const { createRole } = useRolesMock()
    expect(createRole).toHaveBeenCalledWith({ name: 'AUDITOR', title: 'Auditor', description: '' })
    expect(wrapper.emitted('saved')).toHaveLength(1)
  })

  it('updates an existing role in edit mode', async () => {
    const wrapper = await mountForm(mockRole)
    mounted = wrapper

    await wrapper.find('#name').setValue('SENIOR_EXPENSE_MANAGER')
    await submit(wrapper)

    const { updateRole } = useRolesMock()
    expect(updateRole).toHaveBeenCalledWith(1, {
      name: 'SENIOR_EXPENSE_MANAGER',
      title: 'Expense Manager',
      description: 'Manages expenses',
    })
    expect(wrapper.emitted('saved')).toHaveLength(1)
  })

  it('rejects names with invalid characters', async () => {
    const wrapper = await mountForm()
    mounted = wrapper

    await wrapper.find('#name').setValue('BAD NAME!')
    await submit(wrapper)

    const { createRole } = useRolesMock()
    expect(createRole).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Name may only contain letters, numbers and underscores')
  })

  it('does not submit when the name is missing', async () => {
    const wrapper = await mountForm()
    mounted = wrapper

    await submit(wrapper)

    const { createRole } = useRolesMock()
    expect(createRole).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Name is required')
  })

  it('shows a general error when the create call fails', async () => {
    const { createRole } = useRolesMock()
    createRole.mockRejectedValue(new Error('backend rejected'))
    const wrapper = await mountForm()
    mounted = wrapper

    await wrapper.find('#name').setValue('AUDITOR')
    await submit(wrapper)

    expect(wrapper.text()).toContain('backend rejected')
    expect(wrapper.emitted('saved')).toBeUndefined()
  })
})
