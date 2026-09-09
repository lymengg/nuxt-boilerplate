import { describe, expect, it, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { setActivePinia } from 'pinia'
import Paginator from 'primevue/paginator'
import type { Tenant } from '~/types/tenant'
import type { PaginationState } from '~/types/api'
import { useAuthStore } from '~/stores/auth'
import TenantTable from '~/components/tenants/TenantTable.vue'

const mockTenant: Tenant = {
  id: 1,
  name: 'Acme Corp',
  status: 'ACTIVE',
  createdAt: '2024-01-01T00:00:00Z',
}

const pagination: { state: PaginationState } = {
  state: { page: 0, size: 20, sort: 'createdAt,desc', totalElements: 1, totalPages: 1 },
}

function setPermissions(permissions: string[]) {
  useAuthStore().user = {
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    roles: ['PLATFORM_ADMIN'],
    enabled: true,
    mfaEnabled: false,
    mfaMethod: 'NONE',
    permissions,
  }
}

describe('TenantTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(useNuxtApp().$pinia)
    setPermissions(['TENANT_UPDATE', 'TENANT_DELETE'])
  })

  it('renders tenant rows with name, status label and created date', async () => {
    const wrapper = await mountSuspended(TenantTable, {
      props: { tenants: [mockTenant], loading: false, pagination },
    })

    expect(wrapper.text()).toContain('Acme Corp')
    expect(wrapper.text()).toContain('Active')
    expect(wrapper.text()).toContain('2024')
  })

  it('maps status labels and severities for all statuses', async () => {
    for (const status of ['ACTIVE', 'INACTIVE', 'SUSPENDED'] as const) {
      const wrapper = await mountSuspended(TenantTable, {
        props: { tenants: [{ ...mockTenant, status }], loading: false, pagination },
      })
      const expectedLabel = status === 'ACTIVE' ? 'Active' : status === 'INACTIVE' ? 'Inactive' : 'Suspended'
      expect(wrapper.text()).toContain(expectedLabel)
    }
  })

  it('renders the empty state', async () => {
    const wrapper = await mountSuspended(TenantTable, {
      props: { tenants: [], loading: false, pagination },
    })

    expect(wrapper.text()).toContain('No tenants found')
  })

  describe('permission-gated actions', () => {
    it('hides actions without TENANT_UPDATE/TENANT_DELETE', async () => {
      setPermissions([])
      const wrapper = await mountSuspended(TenantTable, {
        props: { tenants: [mockTenant], loading: false, pagination },
      })

      expect(wrapper.find('[aria-label="Edit"]').exists()).toBe(false)
      expect(wrapper.find('[aria-label="Delete"]').exists()).toBe(false)
    })

    it('shows Edit only with TENANT_UPDATE and Delete only with TENANT_DELETE', async () => {
      setPermissions(['TENANT_UPDATE'])
      let wrapper = await mountSuspended(TenantTable, {
        props: { tenants: [mockTenant], loading: false, pagination },
      })
      expect(wrapper.find('[aria-label="Edit"]').exists()).toBe(true)
      expect(wrapper.find('[aria-label="Delete"]').exists()).toBe(false)

      setPermissions(['TENANT_DELETE'])
      wrapper = await mountSuspended(TenantTable, {
        props: { tenants: [mockTenant], loading: false, pagination },
      })
      expect(wrapper.find('[aria-label="Edit"]').exists()).toBe(false)
      expect(wrapper.find('[aria-label="Delete"]').exists()).toBe(true)
    })
  })

  it('emits edit and delete with the tenant', async () => {
    const wrapper = await mountSuspended(TenantTable, {
      props: { tenants: [mockTenant], loading: false, pagination },
    })

    await wrapper.find('[aria-label="Edit"]').trigger('click')
    await wrapper.find('[aria-label="Delete"]').trigger('click')

    expect(wrapper.emitted('edit')).toEqual([[mockTenant]])
    expect(wrapper.emitted('delete')).toEqual([[mockTenant]])
  })

  it('emits page and sizeChange from the paginator', async () => {
    const wrapper = await mountSuspended(TenantTable, {
      props: { tenants: [mockTenant], loading: false, pagination },
    })

    wrapper.findComponent(Paginator).vm.$emit('page', { page: 1, rows: 20 })
    await nextTick()
    expect(wrapper.emitted('page')).toEqual([[1]])

    wrapper.findComponent(Paginator).vm.$emit('page', { page: 0, rows: 50 })
    await nextTick()
    expect(wrapper.emitted('sizeChange')).toEqual([[50]])
  })
})
