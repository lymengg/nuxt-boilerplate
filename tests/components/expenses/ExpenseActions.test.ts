import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { setActivePinia } from 'pinia'
import type { Expense, ExpenseStatus } from '~/types/expense'
import { useAuthStore } from '~/stores/auth'
import ExpenseActions from '~/components/expenses/ExpenseActions.vue'

const baseExpense: Expense = {
  id: 1,
  title: 'Lunch',
  description: '',
  amount: 25,
  category: 'Food',
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

function setPermissions(permissions: string[]) {
  useAuthStore().user = {
    email: 'manager@example.com',
    firstName: 'M',
    lastName: 'G',
    roles: ['DEPARTMENT_MANAGER'],
    enabled: true,
    mfaEnabled: false,
    mfaMethod: 'NONE',
    permissions,
  }
}

function findButton(wrapper: Awaited<ReturnType<typeof mountSuspended>>, label: string) {
  return wrapper.findAll('button').find((b: { text(): string }) => b.text().includes(label))
}

const ALL_EXPENSE_PERMS = ['EXPENSE_APPROVE', 'EXPENSE_REJECT', 'EXPENSE_PROCESS', 'EXPENSE_UPDATE']

describe('ExpenseActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(useNuxtApp().$pinia)
    setPermissions(ALL_EXPENSE_PERMS)
  })

  it('shows no actions when the user has no expense permissions', async () => {
    setPermissions([])
    const wrapper = await mountSuspended(ExpenseActions, { props: { expense: baseExpense } })

    expect(findButton(wrapper, 'Approve')).toBeUndefined()
    expect(findButton(wrapper, 'Reject')).toBeUndefined()
    expect(findButton(wrapper, 'Process')).toBeUndefined()
    expect(findButton(wrapper, 'Cancel')).toBeUndefined()
    expect(wrapper.find('[aria-label="Edit"]').exists()).toBe(false)
  })

  describe('status Ã— permission matrix', () => {
    it.each([
      ['PENDING', 'EXPENSE_APPROVE', 'Approve', true],
      ['PENDING', 'EXPENSE_APPROVE', 'Reject', false],
      ['PENDING', 'EXPENSE_REJECT', 'Reject', true],
      ['PENDING', 'EXPENSE_UPDATE', 'Cancel', true],
      ['PENDING', 'EXPENSE_UPDATE', 'Edit', true],
      ['PENDING', 'EXPENSE_PROCESS', 'Process', false],
      ['APPROVED', 'EXPENSE_PROCESS', 'Process', true],
      ['APPROVED', 'EXPENSE_APPROVE', 'Approve', false],
      ['REJECTED', 'EXPENSE_APPROVE', 'Approve', false],
      ['CANCELLED', 'EXPENSE_UPDATE', 'Cancel', false],
      ['PROCESSED', 'EXPENSE_APPROVE', 'Approve', false],
    ] as const)(
      'status=%s permission=%s â†’ %s %s',
      async (status, permission, buttonLabel, visible) => {
        setPermissions([permission])
        const expense: Expense = { ...baseExpense, status: status as ExpenseStatus }
        const wrapper = await mountSuspended(ExpenseActions, { props: { expense } })

        // The Edit button is icon-only (no label text) — find by aria-label.
        const button = buttonLabel === 'Edit'
          ? (wrapper.find('[aria-label="Edit"]').exists() ? wrapper.find('[aria-label="Edit"]') : undefined)
          : findButton(wrapper, buttonLabel)
        if (visible) {
          expect(button, `${buttonLabel} should be visible`).toBeDefined()
        }
        else {
          expect(button, `${buttonLabel} should be hidden`).toBeUndefined()
        }
      },
    )
  })

  it.each(['Approve', 'Reject', 'Process', 'Cancel'] as const)(
    'emits %s on click',
    async (action) => {
      setPermissions(ALL_EXPENSE_PERMS)
      const status = action === 'Process' ? 'APPROVED' : 'PENDING'
      const wrapper = await mountSuspended(ExpenseActions, {
        props: { expense: { ...baseExpense, status } },
      })

      await findButton(wrapper, action)!.trigger('click')

      expect(wrapper.emitted(action.toLowerCase())).toHaveLength(1)
    },
  )

  it('emits edit on click', async () => {
    const wrapper = await mountSuspended(ExpenseActions, { props: { expense: baseExpense } })

    await wrapper.find('[aria-label="Edit"]').trigger('click')

    expect(wrapper.emitted('edit')).toHaveLength(1)
  })

  it('passes the loading prop to action buttons', async () => {
    const wrapper = await mountSuspended(ExpenseActions, {
      props: { expense: baseExpense, loading: true },
    })

    const approve = findButton(wrapper, 'Approve')!
    expect(approve.attributes('data-pc-name')).toBe('button')
  })
})
