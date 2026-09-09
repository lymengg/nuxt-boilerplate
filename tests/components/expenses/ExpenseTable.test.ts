import { describe, expect, it, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { setActivePinia } from 'pinia'
import Paginator from 'primevue/paginator'
import type { Expense } from '~/types/expense'
import type { PaginationState } from '~/types/api'
import { useAuthStore } from '~/stores/auth'
import ExpenseTable from '~/components/expenses/ExpenseTable.vue'

const mockExpense: Expense = {
  id: 1,
  title: 'Client lunch',
  description: '',
  amount: 25.5,
  category: 'Travel',
  status: 'PENDING',
  ownerId: 1,
  ownerEmail: 'john@example.com',
  departmentId: 1,
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

const pagination: { state: PaginationState } = {
  state: { page: 0, size: 20, sort: 'submissionDate,desc', totalElements: 1, totalPages: 1 },
}

describe('ExpenseTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // The per-row ExpenseActions child is permission-gated.
    setActivePinia(useNuxtApp().$pinia)
    useAuthStore().user = {
      email: 'manager@example.com',
      firstName: 'M',
      lastName: 'G',
      roles: ['DEPARTMENT_MANAGER'],
      enabled: true,
      mfaEnabled: false,
      mfaMethod: 'NONE',
      permissions: ['EXPENSE_APPROVE', 'EXPENSE_REJECT', 'EXPENSE_PROCESS', 'EXPENSE_UPDATE'],
    }
  })

  it('renders expense rows with formatted amount and status', async () => {
    const wrapper = await mountSuspended(ExpenseTable, {
      props: { expenses: [mockExpense], loading: false, pagination },
    })

    expect(wrapper.text()).toContain('Client lunch')
    expect(wrapper.text()).toContain('$25.50')
    expect(wrapper.text()).toContain('Travel')
    expect(wrapper.text()).toContain('Pending')
    expect(wrapper.text()).toContain('john@example.com')
    expect(wrapper.text()).toContain('2024')
  })

  it('renders the empty state', async () => {
    const wrapper = await mountSuspended(ExpenseTable, {
      props: { expenses: [], loading: false, pagination },
    })

    expect(wrapper.text()).toContain('No expenses found')
  })

  it('forwards row actions from the ExpenseActions child', async () => {
    const wrapper = await mountSuspended(ExpenseTable, {
      props: { expenses: [mockExpense], loading: false, pagination },
    })

    const approveButton = wrapper.findAll('button').find(b => b.text().includes('Approve'))!
    await approveButton.trigger('click')

    expect(wrapper.emitted('approve')).toEqual([[mockExpense]])
  })

  it('emits page and sizeChange from the paginator', async () => {
    const wrapper = await mountSuspended(ExpenseTable, {
      props: { expenses: [mockExpense], loading: false, pagination },
    })

    wrapper.findComponent(Paginator).vm.$emit('page', { page: 1, rows: 20 })
    await nextTick()
    expect(wrapper.emitted('page')).toEqual([[1]])

    wrapper.findComponent(Paginator).vm.$emit('page', { page: 0, rows: 50 })
    await nextTick()
    expect(wrapper.emitted('sizeChange')).toEqual([[50]])
  })
})
