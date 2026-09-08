import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import type { Tenant } from '~/types/tenant'
import TenantForm from '~/components/tenants/TenantForm.vue'

const mockTenant: Tenant = {
  id: 1,
  name: 'Acme Corp',
  status: 'INACTIVE',
  createdAt: '2024-01-01T00:00:00Z',
}

const okResponse = { success: true, message: 'ok', data: mockTenant, timestamp: '' }

const { useTenantsMock } = vi.hoisted(() => ({
  useTenantsMock: vi.fn(),
}))

vi.mock('~/composables/useTenants', () => ({ useTenants: () => useTenantsMock() }))

const dialogStub = {
  inheritAttrs: false,
  template: '<div><h1>{{ $attrs.header }}</h1><slot /><slot name="footer" /></div>',
}

function setupMocks() {
  useTenantsMock.mockReturnValue({
    createTenant: vi.fn().mockResolvedValue(okResponse),
    updateTenant: vi.fn().mockResolvedValue(okResponse),
  })
}

async function mountForm(tenant?: Tenant) {
  const wrapper = await mountSuspended(TenantForm, {
    props: { visible: false, tenant },
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

describe('TenantForm', () => {
  let mounted: Awaited<ReturnType<typeof mountForm>> | undefined

  beforeEach(() => {
    vi.clearAllMocks()
    setupMocks()
  })

  afterEach(() => {
    mounted?.unmount()
    mounted = undefined
  })

  it('creates a tenant with the default ACTIVE status', async () => {
    const wrapper = await mountForm()
    mounted = wrapper

    await wrapper.find('#name').setValue('New Corp')
    await submit(wrapper)

    const { createTenant } = useTenantsMock()
    expect(createTenant).toHaveBeenCalledWith({ name: 'New Corp', status: 'ACTIVE' })
    expect(wrapper.emitted('saved')).toHaveLength(1)
  })

  it('updates an existing tenant in edit mode', async () => {
    const wrapper = await mountForm(mockTenant)
    mounted = wrapper

    await submit(wrapper)

    const { updateTenant } = useTenantsMock()
    expect(updateTenant).toHaveBeenCalledWith(1, { name: 'Acme Corp', status: 'INACTIVE' })
    expect(wrapper.emitted('saved')).toHaveLength(1)
  })

  it('defaults the status to ACTIVE in create mode', async () => {
    const wrapper = await mountForm()
    mounted = wrapper

    const statusSelect = wrapper.findAllComponents({ name: 'Select' }).find(s => s.attributes('id') === 'status')!
    expect(statusSelect.props('modelValue')).toBe('ACTIVE')
  })

  it('does not submit when the name is missing', async () => {
    const wrapper = await mountForm()
    mounted = wrapper

    await submit(wrapper)

    const { createTenant } = useTenantsMock()
    expect(createTenant).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Name is required')
  })

  it('shows a general error when the create call fails', async () => {
    const { createTenant } = useTenantsMock()
    createTenant.mockRejectedValue(new Error('backend rejected'))
    const wrapper = await mountForm()
    mounted = wrapper

    await wrapper.find('#name').setValue('New Corp')
    await submit(wrapper)

    expect(wrapper.text()).toContain('backend rejected')
    expect(wrapper.emitted('saved')).toBeUndefined()
  })
})
