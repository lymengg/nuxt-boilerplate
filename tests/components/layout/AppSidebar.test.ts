import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { setActivePinia } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { derivePermissions } from '~/utils/permissions'
import AppSidebar from '~/components/layout/AppSidebar.vue'

function setUser(roles: string[]) {
  useAuthStore().user = {
    username: 'john.doe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    roles,
    enabled: true,
    mfaEnabled: false,
    mfaMethod: 'NONE',
    permissions: derivePermissions(roles),
  }
}

/** All menu labels with their required permission (mirrors AppSidebar). */
const MENU: Array<{ label: string, permission?: string }> = [
  { label: 'Dashboard' },
  { label: 'Expenses', permission: 'EXPENSE_READ' },
  { label: 'Users', permission: 'USER_READ' },
  { label: 'Roles', permission: 'ROLE_READ' },
  { label: 'Tenants', permission: 'TENANT_READ' },
  { label: 'Departments', permission: 'DEPARTMENT_READ' },
  { label: 'Audit Logs', permission: 'AUDIT_LOG_READ' },
]

function visibleLabels(wrapper: Awaited<ReturnType<typeof mountSuspended>>): string[] {
  return MENU.map(m => m.label).filter(label => wrapper.text().includes(label))
}

describe('AppSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Desktop mode (aside visible, mobile drawer hidden).
    vi.stubGlobal('matchMedia', vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })))
    setActivePinia(useNuxtApp().$pinia)
    useAuthStore().user = null
  })

  it('shows only Dashboard for unauthenticated users', async () => {
    const wrapper = await mountSuspended(AppSidebar, { props: { open: true } })

    expect(visibleLabels(wrapper)).toEqual(['Dashboard'])
  })

  it('filters the menu by role permissions', async () => {
    setUser(['EMPLOYEE'])
    const wrapper = await mountSuspended(AppSidebar, { props: { open: true } })

    expect(visibleLabels(wrapper)).toEqual(['Dashboard', 'Expenses'])
  })

  it('shows the full menu for PLATFORM_ADMIN', async () => {
    setUser(['PLATFORM_ADMIN'])
    const wrapper = await mountSuspended(AppSidebar, { props: { open: true } })

    expect(visibleLabels(wrapper)).toEqual(MENU.map(m => m.label))
  })

  it('shows user management items for USER_MANAGER', async () => {
    setUser(['USER_MANAGER'])
    const wrapper = await mountSuspended(AppSidebar, { props: { open: true } })

    expect(visibleLabels(wrapper)).toEqual(['Dashboard', 'Users'])
  })

  it('shows audit + read access for AUDITOR but not admin actions', async () => {
    setUser(['AUDITOR'])
    const wrapper = await mountSuspended(AppSidebar, { props: { open: true } })

    const labels = visibleLabels(wrapper)
    expect(labels).toContain('Audit Logs')
    expect(labels).toContain('Expenses')
    // AUDITOR has USER_READ, so Users is visible — but no admin actions.
    expect(labels).toContain('Users')
    expect(labels).not.toContain('Roles')
    expect(labels).not.toContain('Tenants')
  })

  it('emits close when a mobile drawer link is clicked', async () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })))
    setUser(['EMPLOYEE'])
    // PrimeVue's Drawer teleports to <body>; render its slot inline so the
    // drawer links (which emit close) are inside the wrapper.
    const wrapper = await mountSuspended(AppSidebar, {
      props: { open: true },
      global: { stubs: { Drawer: { template: '<div><slot /></div>' } } },
    })

    const expensesLink = wrapper.findAll('a').find(a => a.text().includes('Expenses'))!
    await expensesLink.trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
