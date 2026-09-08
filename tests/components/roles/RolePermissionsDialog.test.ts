import { describe, expect, it, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import type { Role } from '~/types/role'
import RolePermissionsDialog from '~/components/roles/RolePermissionsDialog.vue'

const mockRole: Role = {
  id: 1,
  name: 'EXPENSE_MANAGER',
  title: 'Expense Manager',
  description: '',
  permissions: ['EXPENSE_READ', 'EXPENSE_APPROVE'],
}

const { useRolesMock } = vi.hoisted(() => ({
  useRolesMock: vi.fn(),
}))

vi.mock('~/composables/useRoles', () => ({ useRoles: () => useRolesMock() }))

// PrimeVue's Dialog teleports its content to <body> — stub it so the
// checkboxes and footer buttons stay in the wrapper DOM.
const dialogStub = {
  template: '<div><slot /><slot name="footer" /></div>',
}

function setupMocks() {
  useRolesMock.mockReturnValue({
    addPermission: vi.fn().mockResolvedValue({ success: true }),
    removePermission: vi.fn().mockResolvedValue({ success: true }),
  })
}

/** Mounts hidden, then opens so the visible watcher runs. */
async function mountDialog(role: Role | null = mockRole) {
  const wrapper = await mountSuspended(RolePermissionsDialog, {
    props: { visible: false, role },
    global: { stubs: { Dialog: dialogStub } },
  })
  await wrapper.setProps({ visible: true })
  await nextTick()
  await flushPromises()
  return wrapper
}

function checkboxFor(wrapper: Awaited<ReturnType<typeof mountDialog>>, permissionId: string) {
  return wrapper.findAllComponents({ name: 'Checkbox' }).find(c => c.props('inputId') === permissionId)!
}

async function save(wrapper: Awaited<ReturnType<typeof mountDialog>>) {
  const saveButton = wrapper.findAll('button').find(b => b.text().includes('Save'))!
  await saveButton.trigger('click')
  await flushPromises()
}

describe('RolePermissionsDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupMocks()
  })

  it('preselects the role permissions when opened', async () => {
    const wrapper = await mountDialog()

    expect(checkboxFor(wrapper, 'EXPENSE_READ').props('modelValue')).toBe(true)
    expect(checkboxFor(wrapper, 'EXPENSE_APPROVE').props('modelValue')).toBe(true)
    expect(checkboxFor(wrapper, 'EXPENSE_REJECT').props('modelValue')).toBe(false)
  })

  it('renders the permission groups catalog', async () => {
    const wrapper = await mountDialog()

    expect(wrapper.text()).toContain('Users')
    expect(wrapper.text()).toContain('Expenses')
    expect(wrapper.text()).toContain('Read Audit Logs')
  })

  it('saves only the diff — adding newly selected and removing deselected permissions', async () => {
    const wrapper = await mountDialog()

    // Add EXPENSE_REJECT, remove EXPENSE_APPROVE.
    await checkboxFor(wrapper, 'EXPENSE_REJECT').vm.$emit('update:modelValue', true)
    await checkboxFor(wrapper, 'EXPENSE_APPROVE').vm.$emit('update:modelValue', false)
    await save(wrapper)

    const { addPermission, removePermission } = useRolesMock()
    expect(addPermission).toHaveBeenCalledWith(1, 'EXPENSE_REJECT')
    expect(removePermission).toHaveBeenCalledWith(1, 'EXPENSE_APPROVE')
    expect(wrapper.emitted('saved')).toHaveLength(1)
  })

  it('makes no service calls when nothing changed', async () => {
    const wrapper = await mountDialog()
    await save(wrapper)

    const { addPermission, removePermission } = useRolesMock()
    expect(addPermission).not.toHaveBeenCalled()
    expect(removePermission).not.toHaveBeenCalled()
    expect(wrapper.emitted('saved')).toHaveLength(1)
  })

  it('shows an error and stays open when a permission call fails', async () => {
    const { addPermission } = useRolesMock()
    addPermission.mockRejectedValue(new Error('backend rejected'))
    const wrapper = await mountDialog()

    await checkboxFor(wrapper, 'EXPENSE_REJECT').vm.$emit('update:modelValue', true)
    await save(wrapper)

    expect(wrapper.text()).toContain('backend rejected')
    expect(wrapper.emitted('saved')).toBeUndefined()
  })
})
