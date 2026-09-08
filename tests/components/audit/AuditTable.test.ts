import { describe, expect, it, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Paginator from 'primevue/paginator'
import type { AuditLog } from '~/types/audit'
import type { PaginationState } from '~/types/api'
import AuditTable from '~/components/audit/AuditTable.vue'

const mockLog: AuditLog = {
  id: 1,
  actorId: 1,
  actorUsername: 'john.doe',
  tenantId: 1,
  action: 'EXPENSE_CREATE',
  resourceType: 'EXPENSE',
  resourceId: '42',
  details: 'Created an expense',
  timestamp: '2024-01-01T09:30:00Z',
}

const pagination: { state: PaginationState } = {
  state: { page: 0, size: 20, sort: 'timestamp,desc', totalElements: 1, totalPages: 1 },
}

describe('AuditTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders audit rows with actor, action, resource and details', async () => {
    const wrapper = await mountSuspended(AuditTable, {
      props: { auditLogs: [mockLog], loading: false, pagination },
    })

    expect(wrapper.text()).toContain('john.doe')
    expect(wrapper.text()).toContain('EXPENSE_CREATE')
    expect(wrapper.text()).toContain('EXPENSE')
    expect(wrapper.text()).toContain('42')
    expect(wrapper.text()).toContain('Created an expense')
  })

  it('shows dashes when resourceId or details are missing', async () => {
    const wrapper = await mountSuspended(AuditTable, {
      props: {
        auditLogs: [{ ...mockLog, resourceId: null, details: null }],
        loading: false,
        pagination,
      },
    })

    expect(wrapper.text()).toContain('—')
  })

  it('maps action severities: delete/failed danger, create/approve success, update/info', async () => {
    const cases = [
      { action: 'USER_DELETE', expectedSeverity: 'danger' },
      { action: 'LOGIN_FAILED', expectedSeverity: 'danger' },
      { action: 'EXPENSE_CREATE', expectedSeverity: 'success' },
      { action: 'EXPENSE_APPROVE', expectedSeverity: 'success' },
      { action: 'USER_UPDATE', expectedSeverity: 'info' },
      { action: 'USER_ENABLE', expectedSeverity: 'info' },
      { action: 'ROLE_ASSIGN_PERMISSION', expectedSeverity: 'info' },
      { action: 'SOMETHING_ELSE', expectedSeverity: 'secondary' },
    ]

    for (const { action, expectedSeverity } of cases) {
      const wrapper = await mountSuspended(AuditTable, {
        props: { auditLogs: [{ ...mockLog, action }], loading: false, pagination },
      })
      const tag = wrapper.findAllComponents({ name: 'Tag' }).find(t => t.text().includes(action))
      expect(tag, `no tag found for ${action}`).toBeDefined()
      expect(tag?.props('severity')).toBe(expectedSeverity)
    }
  })

  it('renders the empty state', async () => {
    const wrapper = await mountSuspended(AuditTable, {
      props: { auditLogs: [], loading: false, pagination },
    })

    expect(wrapper.text()).toContain('No audit logs found')
  })

  it('emits page and sizeChange from the paginator', async () => {
    const wrapper = await mountSuspended(AuditTable, {
      props: { auditLogs: [mockLog], loading: false, pagination },
    })

    wrapper.findComponent(Paginator).vm.$emit('page', { page: 2, rows: 20 })
    await nextTick()
    expect(wrapper.emitted('page')).toEqual([[2]])

    wrapper.findComponent(Paginator).vm.$emit('page', { page: 0, rows: 10 })
    await nextTick()
    expect(wrapper.emitted('sizeChange')).toEqual([[10]])
  })
})
