import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { EXPENSE_STATUS_CONFIG } from '~/types/expense'
import ExpenseStatusTag from '~/components/expenses/ExpenseStatusTag.vue'

describe('ExpenseStatusTag', () => {
  it.each(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'PROCESSED'] as const)(
    'renders the label and severity for %s',
    async (status) => {
      const config = EXPENSE_STATUS_CONFIG[status]
      const wrapper = await mountSuspended(ExpenseStatusTag, { props: { status } })

      expect(wrapper.text()).toContain(config.label)
      const tag = wrapper.findComponent({ name: 'Tag' })
      expect(tag.exists()).toBe(true)
    },
  )

  it('falls back to PENDING for an unknown status', async () => {
    const wrapper = await mountSuspended(ExpenseStatusTag, {
      props: { status: 'UNKNOWN' as never },
    })

    expect(wrapper.text()).toContain(EXPENSE_STATUS_CONFIG.PENDING.label)
  })
})
