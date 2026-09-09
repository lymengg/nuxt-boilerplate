import { describe, expect, it, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { setActivePinia } from 'pinia'
import Paginator from 'primevue/paginator'
import type { Department } from '~/types/department'
import type { PaginationState } from '~/types/api'
import { useAuthStore } from '~/stores/auth'
import DepartmentTable from '~/components/departments/DepartmentTable.vue'

const mockDepartment: Department = {
  id: 1,
  name: 'Engineering',
  tenantId: 1,
  tenantName: 'Acme Corp',
  managerIds: [1],
  managerEmails: ['john@example.com'],
}

const pagination: { state: PaginationState } = {
  state: { page: 0, size: 20, sort: 'name,asc', totalElements: 1, totalPages: 1 },
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

describe('DepartmentTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(useNuxtApp().$pinia)
    setPermissions(['DEPARTMENT_UPDATE', 'DEPARTMENT_DELETE'])
  })

  it('renders departments with name, tenant and manager tags', async () => {
    const wrapper = await mountSuspended(DepartmentTable, {
      props: { departments: [mockDepartment], loading: false, pagination },
    })

    expect(wrapper.text()).toContain('Engineering')
    expect(wrapper.text()).toContain('Acme Corp')
    expect(wrapper.text()).toContain('john@example.com')
  })

  it('shows a dash for departments without managers', async () => {
    const wrapper = await mountSuspended(DepartmentTable, {
      props: { departments: [{ ...mockDepartment, managerEmails: [] }], loading: false, pagination },
    })

    expect(wrapper.text()).toContain('—')
  })

  it('renders the empty state', async () => {
    const wrapper = await mountSuspended(DepartmentTable, {
      props: { departments: [], loading: false, pagination },
    })

    expect(wrapper.text()).toContain('No departments found')
  })

  describe('permission-gated actions', () => {
    it('hides actions without DEPARTMENT_UPDATE/DEPARTMENT_DELETE', async () => {
      setPermissions([])
      const wrapper = await mountSuspended(DepartmentTable, {
        props: { departments: [mockDepartment], loading: false, pagination },
      })

      expect(wrapper.find('[aria-label="Edit"]').exists()).toBe(false)
      expect(wrapper.find('[aria-label="Delete"]').exists()).toBe(false)
    })

    it('shows Edit only with DEPARTMENT_UPDATE and Delete only with DEPARTMENT_DELETE', async () => {
      setPermissions(['DEPARTMENT_UPDATE'])
      let wrapper = await mountSuspended(DepartmentTable, {
        props: { departments: [mockDepartment], loading: false, pagination },
      })
      expect(wrapper.find('[aria-label="Edit"]').exists()).toBe(true)
      expect(wrapper.find('[aria-label="Delete"]').exists()).toBe(false)

      setPermissions(['DEPARTMENT_DELETE'])
      wrapper = await mountSuspended(DepartmentTable, {
        props: { departments: [mockDepartment], loading: false, pagination },
      })
      expect(wrapper.find('[aria-label="Edit"]').exists()).toBe(false)
      expect(wrapper.find('[aria-label="Delete"]').exists()).toBe(true)
    })
  })

  it('emits edit and delete with the department', async () => {
    const wrapper = await mountSuspended(DepartmentTable, {
      props: { departments: [mockDepartment], loading: false, pagination },
    })

    await wrapper.find('[aria-label="Edit"]').trigger('click')
    await wrapper.find('[aria-label="Delete"]').trigger('click')

    expect(wrapper.emitted('edit')).toEqual([[mockDepartment]])
    expect(wrapper.emitted('delete')).toEqual([[mockDepartment]])
  })

  it('emits page and sizeChange from the paginator', async () => {
    const wrapper = await mountSuspended(DepartmentTable, {
      props: { departments: [mockDepartment], loading: false, pagination },
    })

    wrapper.findComponent(Paginator).vm.$emit('page', { page: 1, rows: 20 })
    await nextTick()
    expect(wrapper.emitted('page')).toEqual([[1]])

    wrapper.findComponent(Paginator).vm.$emit('page', { page: 0, rows: 50 })
    await nextTick()
    expect(wrapper.emitted('sizeChange')).toEqual([[50]])
  })
})
