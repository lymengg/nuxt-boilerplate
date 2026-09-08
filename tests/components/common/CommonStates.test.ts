import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import EmptyState from '~/components/common/EmptyState.vue'
import ErrorState from '~/components/common/ErrorState.vue'
import LoadingState from '~/components/common/LoadingState.vue'

describe('EmptyState', () => {
  it('renders the default message', async () => {
    const wrapper = await mountSuspended(EmptyState)
    expect(wrapper.text()).toContain('No data available')
  })

  it('renders a custom message', async () => {
    const wrapper = await mountSuspended(EmptyState, { props: { message: 'No expenses' } })
    expect(wrapper.text()).toContain('No expenses')
  })
})

describe('ErrorState', () => {
  it('renders the error message', async () => {
    const wrapper = await mountSuspended(ErrorState, { props: { error: 'Something broke' } })
    expect(wrapper.text()).toContain('Something broke')
  })

  it('does not render when the error is empty', async () => {
    const wrapper = await mountSuspended(ErrorState, { props: { error: '' } })
    expect(wrapper.text()).not.toContain('Something')
  })

  it('emits close when the closable message is closed', async () => {
    const wrapper = await mountSuspended(ErrorState, {
      props: { error: 'Boom', closable: true },
    })

    wrapper.findComponent({ name: 'Message' }).vm.$emit('close')

    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})

describe('LoadingState', () => {
  it('renders a progress spinner', async () => {
    const wrapper = await mountSuspended(LoadingState)
    expect(wrapper.findComponent({ name: 'ProgressSpinner' }).exists()).toBe(true)
  })
})
