import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { nextTick, ref } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import type { Expense } from '~/types/expense'
import ExpenseForm from '~/components/expenses/ExpenseForm.vue'

const mockExpense: Expense = {
  id: 7,
  title: 'Client lunch',
  description: 'Business meeting',
  amount: 25.5,
  category: 'Travel',
  status: 'PENDING',
  ownerId: 1,
  ownerEmail: 'john@example.com',
  departmentId: 3,
  departmentName: 'Engineering',
  submissionDate: '2024-01-01T00:00:00Z',
  decisionDate: null,
  processedDate: null,
  tenantId: 1,
  tenantName: 'Acme',
  approvedById: null,
  approvedByEmail: null,
  rejectedById: null,
  rejectedByEmail: null,
  processedById: null,
  processedByEmail: null,
  updatedAt: '2024-01-01T00:00:00Z',
}

const okResponse = { success: true, message: 'ok', data: mockExpense, timestamp: '' }

const { useExpensesMock, useDepartmentsMock } = vi.hoisted(() => ({
  useExpensesMock: vi.fn(),
  useDepartmentsMock: vi.fn(),
}))

vi.mock('~/composables/useExpenses', () => ({ useExpenses: () => useExpensesMock() }))
vi.mock('~/composables/useDepartments', () => ({ useDepartments: () => useDepartmentsMock() }))

// PrimeVue's Dialog teleports its content to <body>, outside the wrapper —
// stub it so the form and footer buttons stay in the DOM.
const dialogStub = {
  inheritAttrs: false,
  template: '<div><h1>{{ $attrs.header }}</h1><slot /><slot name="footer" /></div>',
}

function setupMocks() {
  useExpensesMock.mockReturnValue({
    createExpense: vi.fn().mockResolvedValue(okResponse),
    updateExpense: vi.fn().mockResolvedValue(okResponse),
  })
  useDepartmentsMock.mockReturnValue({
    allDepartments: ref([]),
    fetchAllDepartments: vi.fn(),
  })
}

/** Mounts the form hidden, then opens it so the visible watcher runs. */
async function mountForm(expense?: Expense) {
  const wrapper = await mountSuspended(ExpenseForm, {
    props: { visible: false, expense },
    global: { stubs: { Dialog: dialogStub } },
  })
  await wrapper.setProps({ visible: true })
  await nextTick()
  await flushPromises()
  // vee-validate registers Field components asynchronously; a macrotask lets
  // that settle so validation sees every field (microtasks are not enough).
  await new Promise(resolve => setTimeout(resolve, 20))
  return wrapper
}

async function fillTitle(wrapper: Awaited<ReturnType<typeof mountForm>>, value: string) {
  await wrapper.find('#title').setValue(value)
  await flushPromises()
}

async function selectCategory(wrapper: Awaited<ReturnType<typeof mountForm>>, value: string) {
  const categorySelect = wrapper.findAllComponents({ name: 'Select' }).find(s => s.attributes('id') === 'category')!
  await categorySelect.vm.$emit('update:modelValue', value)
  await flushPromises()
}

async function setAmount(wrapper: Awaited<ReturnType<typeof mountForm>>, value: number) {
  await wrapper.findComponent({ name: 'InputNumber' }).vm.$emit('update:modelValue', value)
  await flushPromises()
}

async function submit(wrapper: Awaited<ReturnType<typeof mountForm>>) {
  // The form binds @submit.prevent="onSubmit" (vee-validate handleSubmit).
  await wrapper.find('form').trigger('submit')
  await flushPromises()
  // handleSubmit runs async validation + the onSubmit callback; give both a
  // macrotask so error messages / generalError render.
  await new Promise(resolve => setTimeout(resolve, 20))
  await flushPromises()
  await nextTick()
}

describe('ExpenseForm', () => {
  let mounted: Awaited<ReturnType<typeof mountForm>> | undefined

  beforeEach(() => {
    vi.clearAllMocks()
    setupMocks()
  })

  afterEach(() => {
    // Unmount between tests: vee-validate keeps per-instance form context,
    // and a lingering mounted instance leaks state into the next mount.
    mounted?.unmount()
    mounted = undefined
  })

  it('creates an expense with the full payload in create mode', async () => {
    const wrapper = await mountForm()
    mounted = wrapper

    await fillTitle(wrapper, 'Team lunch')
    await selectCategory(wrapper, 'Meals')
    await setAmount(wrapper, 30)
    await submit(wrapper)

    const { createExpense } = useExpensesMock()
    expect(createExpense).toHaveBeenCalledWith({
      title: 'Team lunch',
      description: '',
      amount: 30,
      category: 'Meals',
      departmentId: null,
    })
    expect(wrapper.emitted('saved')).toHaveLength(1)
  })

  it('sends an update payload WITHOUT departmentId in edit mode', async () => {
    const wrapper = await mountForm(mockExpense)
    mounted = wrapper

    await fillTitle(wrapper, 'Renamed lunch')
    await submit(wrapper)

    const { updateExpense } = useExpensesMock()
    expect(updateExpense).toHaveBeenCalledWith(7, {
      title: 'Renamed lunch',
      description: 'Business meeting',
      amount: 25.5,
      category: 'Travel',
    })
    expect(wrapper.emitted('saved')).toHaveLength(1)
  })

  it('prefills the form with the expense values in edit mode', async () => {
    const wrapper = await mountForm(mockExpense)
    mounted = wrapper

    expect((wrapper.find('#title').element as HTMLInputElement).value).toBe('Client lunch')
    expect(wrapper.text()).toContain('Edit Expense')
  })

  it('does not submit when validation fails', async () => {
    const wrapper = await mountForm()
    mounted = wrapper

    await submit(wrapper)

    const { createExpense } = useExpensesMock()
    expect(createExpense).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Title is required')
    expect(wrapper.text()).toContain('Amount is required')
    // An empty category fails the oneOf check before required.
    expect(wrapper.text()).toContain('Invalid category')
  })

  it('shows a general error when the create call fails', async () => {
    const { createExpense } = useExpensesMock()
    createExpense.mockRejectedValue(new Error('backend rejected'))
    const wrapper = await mountForm()
    mounted = wrapper

    await fillTitle(wrapper, 'Lunch')
    await selectCategory(wrapper, 'Meals')
    await setAmount(wrapper, 10)
    await submit(wrapper)

    expect(wrapper.text()).toContain('backend rejected')
    expect(wrapper.emitted('saved')).toBeUndefined()
  })

  it('fetches departments when opened', async () => {
    const { fetchAllDepartments } = useDepartmentsMock()
    mounted = await mountForm()

    expect(fetchAllDepartments).toHaveBeenCalled()
  })
})
