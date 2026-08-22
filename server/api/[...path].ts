import type { ApiResponse, Page } from '~/types/api'
import {
  auditLogs,
  departments,
  expenses,
  getAuthUser,
  mockSession,
  nextId,
  roles,
  tenants,
  users,
  PERMISSIONS,
} from '../utils/mockDb'

type Query = Record<string, unknown>

function ok<T>(data: T): ApiResponse<T> {
  return { success: true, message: 'OK', data, timestamp: new Date().toISOString() }
}

function fail(status: number, message: string): never {
  throw createError({
    statusCode: status,
    statusMessage: message,
    data: { success: false, message, data: null, timestamp: new Date().toISOString() } satisfies ApiResponse<null>,
  })
}

function paginate<T>(items: T[], query: Query): Page<T> {
  const page = Math.max(0, Number.parseInt(String(query.page ?? '0')) || 0)
  const size = Math.max(1, Number.parseInt(String(query.size ?? '20')) || 20)
  const totalElements = items.length
  const totalPages = Math.ceil(totalElements / size)
  const content = items.slice(page * size, (page + 1) * size)
  return {
    content,
    totalElements,
    totalPages,
    size,
    number: page,
    first: page === 0,
    last: totalElements === 0 || page >= totalPages - 1,
    empty: content.length === 0,
  }
}

function applySort<T extends Record<string, unknown>>(items: T[], sort?: unknown): T[] {
  const raw = String(sort ?? '')
  if (!raw)
    return items
  const [field, dir = 'asc'] = raw.split(',')
  return [...items].sort((a, b) => {
    const av = a[field!]
    const bv = b[field!]
    let res: number
    if (typeof av === 'number' && typeof bv === 'number') {
      res = av - bv
    }
    else if (field === 'createdAt' || field === 'updatedAt') {
      res = new Date(String(av)).getTime() - new Date(String(bv)).getTime()
    }
    else {
      res = String(av ?? '').localeCompare(String(bv ?? ''))
    }
    return dir === 'desc' ? -res : res
  })
}

function boolParam(value: unknown): boolean | undefined {
  if (value === 'true')
    return true
  if (value === 'false')
    return false
  return undefined
}

function matchesSearch(item: Record<string, unknown>, search: string, fields: string[]): boolean {
  if (!search)
    return true
  const haystack = fields.map(f => String(item[f] ?? '')).join(' ').toLowerCase()
  return haystack.includes(search.toLowerCase())
}

async function latency() {
  await new Promise(resolve => setTimeout(resolve, 120 + Math.round(Math.random() * 250)))
}

function addAudit(action: string, resourceType: string, resourceId: string, details: Record<string, unknown> = {}) {
  const actor = getAuthUser()
  auditLogs.unshift({
    id: nextId('a'),
    action,
    resourceType,
    resourceId,
    actorId: actor.id,
    actorEmail: actor.email,
    tenantId: actor.tenantId,
    tenantName: actor.tenantName,
    details,
    ipAddress: '127.0.0.1',
    userAgent: 'Mock Client',
    result: 'SUCCESS',
    createdAt: new Date().toISOString(),
  })
}

export default defineEventHandler(async (event): Promise<ApiResponse<unknown>> => {
  await latency()

  const method = event.method
  const path = event.path.split('?')[0].replace(/\/+$/, '')
  const parts = path.split('/').filter(Boolean)
  // parts[0] === 'api'
  const [, resource, id, subresource] = parts
  const query = getQuery(event) as Query

  /* ---------------------------- Auth ---------------------------- */

  if (resource === 'auth') {
    if (path === '/api/auth/login' && method === 'POST') {
      const body = await readBody<{ email?: string, password?: string }>(event) ?? {}
      if (!body.email || !body.password) {
        fail(400, 'Email and password are required')
      }
      if (body.password.toLowerCase().startsWith('mfa')) {
        mockSession.pendingMfaEmail = body.email
        return ok({ accessToken: '', requiresMfa: true, user: getAuthUser() }) as ApiResponse<{ accessToken: string, requiresMfa: boolean, user: ReturnType<typeof getAuthUser> }>
      }
      mockSession.loggedIn = true
      mockSession.pendingMfaEmail = null
      return ok({ accessToken: `mock-token-${Date.now()}`, requiresMfa: false, user: getAuthUser() })
    }

    if (path === '/api/auth/mfa/verify' && method === 'POST') {
      const body = await readBody<{ token?: string }>(event) ?? {}
      if (!/^\d{6}$/.test(body.token ?? '')) {
        fail(400, 'Verification code must be 6 digits')
      }
      mockSession.loggedIn = true
      mockSession.pendingMfaEmail = null
      return ok({ accessToken: `mock-token-${Date.now()}`, user: getAuthUser() })
    }

    if (path === '/api/auth/logout' && method === 'POST') {
      mockSession.loggedIn = false
      return ok(null)
    }

    if (path === '/api/auth/me' && method === 'GET') {
      if (!mockSession.loggedIn) {
        fail(401, 'Not authenticated')
      }
      return ok(getAuthUser())
    }

    if (path === '/api/auth/refresh' && method === 'POST') {
      if (!mockSession.loggedIn) {
        fail(401, 'Not authenticated')
      }
      return ok({ accessToken: `mock-token-${Date.now()}`, user: getAuthUser() })
    }

    fail(404, `Unknown auth route: ${method} ${path}`)
  }

  /* ------------------------- Auth guard ------------------------- */

  if (!mockSession.loggedIn) {
    fail(401, 'Not authenticated')
  }

  /* ---------------------------- Users --------------------------- */

  if (resource === 'users') {
    if (!id && method === 'GET') {
      let list = [...users]
      list = list.filter(u => matchesSearch(u as unknown as Record<string, unknown>, String(query.search ?? ''), ['firstName', 'lastName', 'email']))
      const enabled = boolParam(query.enabled)
      if (enabled !== undefined) {
        list = list.filter(u => u.enabled === enabled)
      }
      return ok(paginate(applySort(list as unknown as Record<string, unknown>[], query.sort), query))
    }

    if (!id && method === 'POST') {
      const body = await readBody<{ email: string, firstName: string, lastName: string, tenantId: string, departmentId?: string, roleIds: string[] }>(event)
      if (users.some(u => u.email === body.email)) {
        fail(409, 'A user with this email already exists')
      }
      const tenant = tenants.find(t => t.id === body.tenantId)
      const department = departments.find(d => d.id === body.departmentId)
      const now = new Date().toISOString()
      const user = {
        id: nextId('u'),
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        enabled: true,
        mfaEnabled: false,
        tenantId: body.tenantId,
        tenantName: tenant?.name ?? '',
        departmentId: body.departmentId ?? null,
        departmentName: department?.name ?? null,
        roles: body.roleIds.map(rid => ({ id: rid, name: roles.find(r => r.id === rid)?.name ?? rid, description: '' })),
        createdAt: now,
        updatedAt: now,
      }
      users.push(user)
      addAudit('USER_CREATE', 'USER', user.id, { email: user.email })
      return ok(user)
    }

    const user = users.find(u => u.id === id)
    if (!user) {
      fail(404, 'User not found')
    }

    if (!subresource && method === 'GET')
      return ok(user)

    if (!subresource && method === 'PUT') {
      const body = await readBody<{ firstName?: string, lastName?: string, departmentId?: string | null }>(event)
      if (body.firstName !== undefined)
        user.firstName = body.firstName
      if (body.lastName !== undefined)
        user.lastName = body.lastName
      if (body.departmentId !== undefined) {
        user.departmentId = body.departmentId
        user.departmentName = departments.find(d => d.id === body.departmentId)?.name ?? null
      }
      user.updatedAt = new Date().toISOString()
      addAudit('USER_UPDATE', 'USER', user.id)
      return ok(user)
    }

    if (!subresource && method === 'DELETE') {
      users.splice(users.indexOf(user), 1)
      addAudit('USER_DELETE', 'USER', user.id)
      return ok(null)
    }

    if (subresource === 'enable' && method === 'POST') {
      user.enabled = true
      addAudit('USER_ENABLE', 'USER', user.id)
      return ok(user)
    }

    if (subresource === 'disable' && method === 'POST') {
      user.enabled = false
      addAudit('USER_DISABLE', 'USER', user.id)
      return ok(user)
    }

    if (subresource === 'roles' && method === 'PUT') {
      const body = await readBody<{ roleIds: string[] }>(event)
      user.roles = body.roleIds.map(rid => ({ id: rid, name: roles.find(r => r.id === rid)?.name ?? rid, description: '' }))
      user.updatedAt = new Date().toISOString()
      addAudit('ROLE_ASSIGN_PERMISSION', 'USER', user.id, { roles: user.roles.map(r => r.name) })
      return ok(user)
    }
  }

  /* ---------------------------- Roles --------------------------- */

  if (resource === 'roles') {
    if (id === 'all' && method === 'GET')
      return ok([...roles])

    if (!id && method === 'GET') {
      let list = [...roles]
      list = list.filter(r => matchesSearch(r as unknown as Record<string, unknown>, String(query.search ?? ''), ['name', 'description']))
      return ok(paginate(applySort(list as unknown as Record<string, unknown>[], query.sort), query))
    }

    if (!id && method === 'POST') {
      const body = await readBody<{ name: string, description: string, permissionIds: string[] }>(event)
      const now = new Date().toISOString()
      const roleItem = {
        id: nextId('r'),
        name: body.name,
        description: body.description,
        permissions: PERMISSIONS.filter(p => body.permissionIds.includes(p.id)),
        createdAt: now,
        updatedAt: now,
      }
      roles.push(roleItem)
      addAudit('ROLE_CREATE', 'ROLE', roleItem.id, { name: roleItem.name })
      return ok(roleItem)
    }

    const roleItem = roles.find(r => r.id === id)
    if (!roleItem) {
      fail(404, 'Role not found')
    }

    if (!subresource && method === 'GET')
      return ok(roleItem)

    if (!subresource && method === 'PUT') {
      const body = await readBody<{ name?: string, description?: string, permissionIds?: string[] }>(event)
      if (body.name !== undefined)
        roleItem.name = body.name
      if (body.description !== undefined)
        roleItem.description = body.description
      if (body.permissionIds !== undefined) {
        roleItem.permissions = PERMISSIONS.filter(p => body.permissionIds!.includes(p.id))
        for (const u of users) {
          for (const ur of u.roles) {
            if (ur.id === roleItem.id)
              ur.name = roleItem.name
          }
        }
      }
      roleItem.updatedAt = new Date().toISOString()
      addAudit('ROLE_UPDATE', 'ROLE', roleItem.id)
      return ok(roleItem)
    }

    if (!subresource && method === 'DELETE') {
      roles.splice(roles.indexOf(roleItem), 1)
      addAudit('ROLE_DELETE', 'ROLE', roleItem.id)
      return ok(null)
    }

    if (subresource === 'permissions' && method === 'PUT') {
      const body = await readBody<{ permissionIds: string[] }>(event)
      roleItem.permissions = PERMISSIONS.filter(p => body.permissionIds.includes(p.id))
      roleItem.updatedAt = new Date().toISOString()
      addAudit('ROLE_ASSIGN_PERMISSION', 'ROLE', roleItem.id)
      return ok(roleItem)
    }
  }

  /* --------------------------- Tenants -------------------------- */

  if (resource === 'tenants') {
    if (id === 'all' && method === 'GET')
      return ok([...tenants])

    if (!id && method === 'GET') {
      let list = [...tenants]
      list = list.filter(t => matchesSearch(t as unknown as Record<string, unknown>, String(query.search ?? ''), ['name', 'domain']))
      const enabled = boolParam(query.enabled)
      if (enabled !== undefined) {
        list = list.filter(t => t.enabled === enabled)
      }
      return ok(paginate(applySort(list as unknown as Record<string, unknown>[], query.sort), query))
    }

    if (!id && method === 'POST') {
      const body = await readBody<{ name: string, domain: string }>(event)
      const now = new Date().toISOString()
      const tenant = { id: nextId('t'), name: body.name, domain: body.domain, enabled: true, createdAt: now, updatedAt: now }
      tenants.push(tenant)
      addAudit('TENANT_CREATE', 'TENANT', tenant.id, { name: tenant.name })
      return ok(tenant)
    }

    const tenant = tenants.find(t => t.id === id)
    if (!tenant) {
      fail(404, 'Tenant not found')
    }

    if (!subresource && method === 'GET')
      return ok(tenant)

    if (!subresource && method === 'PUT') {
      const body = await readBody<{ name?: string, domain?: string, enabled?: boolean }>(event)
      Object.assign(tenant, body, { updatedAt: new Date().toISOString() })
      addAudit('TENANT_UPDATE', 'TENANT', tenant.id)
      return ok(tenant)
    }

    if (!subresource && method === 'DELETE') {
      tenants.splice(tenants.indexOf(tenant), 1)
      addAudit('TENANT_DELETE', 'TENANT', tenant.id)
      return ok(null)
    }
  }

  /* ------------------------- Departments ------------------------ */

  if (resource === 'departments') {
    if (id === 'all' && method === 'GET')
      return ok([...departments])

    if (!id && method === 'GET') {
      let list = [...departments]
      list = list.filter(d => matchesSearch(d as unknown as Record<string, unknown>, String(query.search ?? ''), ['name', 'description']))
      const enabled = boolParam(query.enabled)
      if (enabled !== undefined) {
        list = list.filter(d => d.enabled === enabled)
      }
      if (query.tenantId) {
        list = list.filter(d => d.tenantId === query.tenantId)
      }
      return ok(paginate(applySort(list as unknown as Record<string, unknown>[], query.sort), query))
    }

    if (!id && method === 'POST') {
      const body = await readBody<{ name: string, description: string, tenantId: string }>(event)
      const tenant = tenants.find(t => t.id === body.tenantId)
      const now = new Date().toISOString()
      const department = { id: nextId('d'), name: body.name, description: body.description, tenantId: body.tenantId, tenantName: tenant?.name ?? '', enabled: true, createdAt: now, updatedAt: now }
      departments.push(department)
      addAudit('DEPARTMENT_CREATE', 'DEPARTMENT', department.id, { name: department.name })
      return ok(department)
    }

    const department = departments.find(d => d.id === id)
    if (!department) {
      fail(404, 'Department not found')
    }

    if (!subresource && method === 'GET')
      return ok(department)

    if (!subresource && method === 'PUT') {
      const body = await readBody<{ name?: string, description?: string, enabled?: boolean }>(event)
      Object.assign(department, body, { updatedAt: new Date().toISOString() })
      addAudit('DEPARTMENT_UPDATE', 'DEPARTMENT', department.id)
      return ok(department)
    }

    if (!subresource && method === 'DELETE') {
      departments.splice(departments.indexOf(department), 1)
      addAudit('DEPARTMENT_DELETE', 'DEPARTMENT', department.id)
      return ok(null)
    }
  }

  /* --------------------------- Expenses ------------------------- */

  if (resource === 'expenses') {
    if (!id && method === 'GET') {
      let list = [...expenses]
      list = list.filter(e => matchesSearch(e as unknown as Record<string, unknown>, String(query.search ?? ''), ['title', 'description']))
      if (query.status)
        list = list.filter(e => e.status === query.status)
      if (query.category)
        list = list.filter(e => e.category === query.category)
      if (query.departmentId)
        list = list.filter(e => e.departmentId === query.departmentId)
      return ok(paginate(applySort(list as unknown as Record<string, unknown>[], query.sort), query))
    }

    if (!id && method === 'POST') {
      const parts2 = await readMultipartFormData(event) ?? []
      const field = (name: string) => parts2.find(p => p.name === name)?.data.toString('utf-8') ?? ''
      const authUser = getAuthUser()
      const submitter = users.find(u => u.id === authUser.id)!
      const department = departments.find(d => d.id === field('departmentId'))
      const now = new Date().toISOString()
      const item = {
        id: nextId('e'),
        title: field('title'),
        description: field('description'),
        amount: Number.parseFloat(field('amount')) || 0,
        currency: field('currency') || 'USD',
        category: field('category'),
        status: 'PENDING' as const,
        submittedBy: submitter.id,
        submittedByName: `${submitter.firstName} ${submitter.lastName}`,
        approvedBy: null,
        approvedByName: null,
        processedBy: null,
        processedByName: null,
        tenantId: submitter.tenantId,
        tenantName: submitter.tenantName,
        departmentId: department?.id ?? '',
        departmentName: department?.name ?? '',
        receiptUrl: null,
        rejectionReason: null,
        createdAt: now,
        updatedAt: now,
      }
      expenses.unshift(item)
      addAudit('EXPENSE_CREATE', 'EXPENSE', item.id, { amount: item.amount, currency: item.currency })
      return ok(item)
    }

    const item = expenses.find(e => e.id === id)
    if (!item) {
      fail(404, 'Expense not found')
    }

    if (!subresource && method === 'GET')
      return ok(item)

    if (!subresource && method === 'PUT') {
      const body = await readBody<Record<string, unknown>>(event)
      if (body.departmentId) {
        item.departmentName = departments.find(d => d.id === body.departmentId)?.name ?? item.departmentName
      }
      Object.assign(item, body, { updatedAt: new Date().toISOString() })
      addAudit('EXPENSE_UPDATE', 'EXPENSE', item.id)
      return ok(item)
    }

    if (!subresource && method === 'DELETE') {
      expenses.splice(expenses.indexOf(item), 1)
      addAudit('EXPENSE_DELETE', 'EXPENSE', item.id)
      return ok(null)
    }

    const authUser = getAuthUser()
    const approver = users.find(u => u.id === authUser.id)!

    if (subresource === 'approve' && method === 'POST') {
      item.status = 'APPROVED'
      item.approvedBy = approver.id
      item.approvedByName = `${approver.firstName} ${approver.lastName}`
      item.updatedAt = new Date().toISOString()
      addAudit('EXPENSE_APPROVE', 'EXPENSE', item.id, { amount: item.amount })
      return ok(item)
    }

    if (subresource === 'reject' && method === 'POST') {
      const body = await readBody<{ reason?: string }>(event) ?? {}
      item.status = 'REJECTED'
      item.rejectionReason = body.reason ?? 'Rejected'
      item.approvedBy = approver.id
      item.approvedByName = `${approver.firstName} ${approver.lastName}`
      item.updatedAt = new Date().toISOString()
      addAudit('EXPENSE_REJECT', 'EXPENSE', item.id, { reason: item.rejectionReason })
      return ok(item)
    }

    if (subresource === 'process' && method === 'POST') {
      item.status = 'PROCESSED'
      item.processedBy = approver.id
      item.processedByName = `${approver.firstName} ${approver.lastName}`
      item.updatedAt = new Date().toISOString()
      addAudit('EXPENSE_PROCESS', 'EXPENSE', item.id, { amount: item.amount })
      return ok(item)
    }

    if (subresource === 'cancel' && method === 'POST') {
      item.status = 'CANCELLED'
      item.updatedAt = new Date().toISOString()
      addAudit('EXPENSE_CANCEL', 'EXPENSE', item.id)
      return ok(item)
    }
  }

  /* -------------------------- Audit logs ------------------------ */

  if (resource === 'audit-logs') {
    if (!id && method === 'GET') {
      let list = [...auditLogs]
      if (query.action)
        list = list.filter(l => l.action === query.action)
      if (query.resourceType)
        list = list.filter(l => l.resourceType === query.resourceType)
      if (query.result)
        list = list.filter(l => l.result === query.result)
      if (query.actorId)
        list = list.filter(l => l.actorId === query.actorId)
      return ok(paginate(applySort(list as unknown as Record<string, unknown>[], query.sort), query))
    }

    const log = auditLogs.find(l => l.id === id)
    if (!log) {
      fail(404, 'Audit log not found')
    }
    return ok(log)
  }

  fail(404, `Unknown route: ${method} ${path}`)
})
