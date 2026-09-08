import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { Department } from '~/types/department'
import ExpenseFilters from '~/components/expenses/ExpenseFilters.vue'

const mockDepartments: Department[] = [
  { id: 1, name: 'Engineering', tenantId: 1, tenantName: 'Acme', managerIds: [], managerUsernames: [] },
  { id: 2, name: 'Design', tenantId: 1, tenantName: 'Acme', managerIds: [], managerUsernames: [] },
]

const { useDepartmentsMock } = vi.hoisted(() => ({
  useDepartmentsMock: vi.fn(),
}))

vi.mock('~/composables/useDepartments', () => ({
  useDepartments: () => useDepartmentsMock(),
}))

describe('ExpenseFilters', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useDepartmentsMock.mockReturnValue({
      allDepartments: ref(mockDepartments),
      fetchAllDepartments: vi.fn(),
    })
  })

  it('fetches departments on mount', async () => {
    const { fetchAllDepartments } = useDepartmentsMock()
    await mountSuspended(ExpenseFilters)

    expect(fetchAllDepartments).toHaveBeenCalledOnce()
  })

  it('emits a filter with the selected status', async () => {
    const wrapper = await mountSuspended(ExpenseFilters)
    const statusSelect = wrapper.findAllComponents({ name: 'Select' })[0]

    await statusSelect.vm.$emit('update:modelValue', 'PENDING')
    await statusSelect.vm.$emit('change')

    expect(wrapper.emitted('filter')).toEqual([[{ status: 'PENDING' }]])
  })

  it('emits a filter with the selected department', async () => {
    const wrapper = await mountSuspended(ExpenseFilters)
    const deptSelect = wrapper.findAllComponents({ name: 'Select' })[1]

    await deptSelect.vm.$emit('update:modelValue', 2)
    await deptSelect.vm.$emit('change')

    expect(wrapper.emitted('filter')).toEqual([[{ departmentId: 2 }]])
  })

  it('emits an empty filter on clear and resets the selects', async () => {
    const wrapper = await mountSuspended(ExpenseFilters)
    const statusSelect = wrapper.findAllComponents({ name: 'Select' })[0]
    await statusSelect.vm.$emit('update:modelValue', 'APPROVED')
    await statusSelect.vm.$emit('change')

    wrapper.findAll('button').find((b: { text(): string }) => b.text().includes('Clear'))!.trigger('click')
    await Promise.resolve()

    expect(wrapper.emitted('filter')?.at(-1)).toEqual([{}])
  })

  it('omits unset filters from the emitted params', async () => {
    const wrapper = await mountSuspended(ExpenseFilters)
    const statusSelect = wrapper.findAllComponents({ name: 'Select' })[0]

    await statusSelect.vm.$emit('update:modelValue', null)
    await statusSelect.vm.$emit('change')

    expect(wrapper.emitted('filter')).toEqual([[{}]])
  })
})
