import type { AuditLog } from '~/types/audit'
import type { AuthUser } from '~/types/auth'
import type { Department } from '~/types/department'
import type { Expense, ExpenseStatus } from '~/types/expense'
import type { Permission, Role } from '~/types/role'
import type { Tenant } from '~/types/tenant'
import type { User, UserRole } from '~/types/user'

function daysAgo(days: number, hours = 0): string {
  return new Date(Date.now() - days * 86_400_000 - hours * 3_600_000).toISOString()
}

export const PERMISSIONS: Permission[] = [
  { id: 'USER_CREATE', name: 'Create', description: 'Create new users', group: 'Users' },
  { id: 'USER_READ', name: 'Read', description: 'View user details', group: 'Users' },
  { id: 'USER_UPDATE', name: 'Update', description: 'Edit user information', group: 'Users' },
  { id: 'USER_DELETE', name: 'Delete', description: 'Delete users', group: 'Users' },
  { id: 'USER_ENABLE_DISABLE', name: 'Enable/Disable', description: 'Enable or disable user accounts', group: 'Users' },
  { id: 'ROLE_CREATE', name: 'Create', description: 'Create new roles', group: 'Roles' },
  { id: 'ROLE_READ', name: 'Read', description: 'View role details', group: 'Roles' },
  { id: 'ROLE_UPDATE', name: 'Update', description: 'Edit role information', group: 'Roles' },
  { id: 'ROLE_DELETE', name: 'Delete', description: 'Delete roles', group: 'Roles' },
  { id: 'ROLE_ASSIGN_PERMISSION', name: 'Assign Permissions', description: 'Assign permissions to roles', group: 'Roles' },
  { id: 'TENANT_CREATE', name: 'Create', description: 'Create new tenants', group: 'Tenants' },
  { id: 'TENANT_READ', name: 'Read', description: 'View tenant details', group: 'Tenants' },
  { id: 'TENANT_UPDATE', name: 'Update', description: 'Edit tenant information', group: 'Tenants' },
  { id: 'TENANT_DELETE', name: 'Delete', description: 'Delete tenants', group: 'Tenants' },
  { id: 'DEPARTMENT_CREATE', name: 'Create', description: 'Create new departments', group: 'Departments' },
  { id: 'DEPARTMENT_READ', name: 'Read', description: 'View department details', group: 'Departments' },
  { id: 'DEPARTMENT_UPDATE', name: 'Update', description: 'Edit department information', group: 'Departments' },
  { id: 'DEPARTMENT_DELETE', name: 'Delete', description: 'Delete departments', group: 'Departments' },
  { id: 'EXPENSE_CREATE', name: 'Create', description: 'Create new expenses', group: 'Expenses' },
  { id: 'EXPENSE_READ', name: 'Read', description: 'View expense details', group: 'Expenses' },
  { id: 'EXPENSE_UPDATE', name: 'Update', description: 'Edit expense information', group: 'Expenses' },
  { id: 'EXPENSE_DELETE', name: 'Delete', description: 'Delete expenses', group: 'Expenses' },
  { id: 'EXPENSE_APPROVE', name: 'Approve', description: 'Approve expenses', group: 'Expenses' },
  { id: 'EXPENSE_REJECT', name: 'Reject', description: 'Reject expenses', group: 'Expenses' },
  { id: 'EXPENSE_PROCESS', name: 'Process', description: 'Process approved expenses', group: 'Expenses' },
  { id: 'MFA_ENABLE', name: 'Enable', description: 'Enable MFA for users', group: 'MFA' },
  { id: 'MFA_DISABLE', name: 'Disable', description: 'Disable MFA for users', group: 'MFA' },
  { id: 'AUDIT_LOG_READ', name: 'Read', description: 'View audit logs', group: 'Audit' },
]

const ALL_PERMISSION_IDS = PERMISSIONS.map(p => p.id)

export const tenants: Tenant[] = [
  { id: 't1', name: 'Acme Corporation', domain: 'acme.com', enabled: true, createdAt: daysAgo(420), updatedAt: daysAgo(32) },
  { id: 't2', name: 'Globex Industries', domain: 'globex.io', enabled: true, createdAt: daysAgo(300), updatedAt: daysAgo(18) },
  { id: 't3', name: 'Initech Solutions', domain: 'initech.dev', enabled: false, createdAt: daysAgo(210), updatedAt: daysAgo(9) },
]

export const departments: Department[] = [
  { id: 'd1', name: 'Engineering', description: 'Product engineering and platform teams', tenantId: 't1', tenantName: 'Acme Corporation', enabled: true, createdAt: daysAgo(400), updatedAt: daysAgo(40) },
  { id: 'd2', name: 'Finance', description: 'Accounting, treasury and payroll', tenantId: 't1', tenantName: 'Acme Corporation', enabled: true, createdAt: daysAgo(395), updatedAt: daysAgo(35) },
  { id: 'd3', name: 'Marketing', description: 'Brand, growth and communications', tenantId: 't1', tenantName: 'Acme Corporation', enabled: true, createdAt: daysAgo(380), updatedAt: daysAgo(28) },
  { id: 'd4', name: 'Human Resources', description: 'People operations and recruiting', tenantId: 't1', tenantName: 'Acme Corporation', enabled: true, createdAt: daysAgo(370), updatedAt: daysAgo(21) },
  { id: 'd5', name: 'Sales', description: 'Direct sales and partnerships', tenantId: 't1', tenantName: 'Acme Corporation', enabled: true, createdAt: daysAgo(360), updatedAt: daysAgo(14) },
  { id: 'd6', name: 'Operations', description: 'Logistics and supply chain', tenantId: 't2', tenantName: 'Globex Industries', enabled: false, createdAt: daysAgo(290), updatedAt: daysAgo(11) },
]

function role(id: string, name: string, description: string, permissionIds: string[]): Role {
  return {
    id,
    name,
    description,
    permissions: PERMISSIONS.filter(p => permissionIds.includes(p.id)),
    createdAt: daysAgo(410),
    updatedAt: daysAgo(25),
  }
}

export const roles: Role[] = [
  role('r1', 'Administrator', 'Full system access', ALL_PERMISSION_IDS),
  role('r2', 'Finance Manager', 'Approves and processes expenses', ['EXPENSE_READ', 'EXPENSE_APPROVE', 'EXPENSE_REJECT', 'EXPENSE_PROCESS', 'DEPARTMENT_READ', 'USER_READ']),
  role('r3', 'Employee', 'Submits expenses', ['EXPENSE_CREATE', 'EXPENSE_READ']),
  role('r4', 'Auditor', 'Read-only access to expenses and audit logs', ['EXPENSE_READ', 'AUDIT_LOG_READ']),
]

function userRole(id: string): UserRole {
  const r = roles.find(r => r.id === id)!
  return { id: r.id, name: r.name, description: r.description }
}

export const users: User[] = [
  { id: 'u1', email: 'alice.johnson@acme.com', firstName: 'Alice', lastName: 'Johnson', enabled: true, mfaEnabled: true, tenantId: 't1', tenantName: 'Acme Corporation', departmentId: 'd1', departmentName: 'Engineering', roles: [userRole('r1')], createdAt: daysAgo(380), updatedAt: daysAgo(5) },
  { id: 'u2', email: 'bob.smith@acme.com', firstName: 'Bob', lastName: 'Smith', enabled: true, mfaEnabled: false, tenantId: 't1', tenantName: 'Acme Corporation', departmentId: 'd1', departmentName: 'Engineering', roles: [userRole('r3')], createdAt: daysAgo(320), updatedAt: daysAgo(12) },
  { id: 'u3', email: 'carol.diaz@acme.com', firstName: 'Carol', lastName: 'Diaz', enabled: true, mfaEnabled: true, tenantId: 't1', tenantName: 'Acme Corporation', departmentId: 'd2', departmentName: 'Finance', roles: [userRole('r2')], createdAt: daysAgo(280), updatedAt: daysAgo(8) },
  { id: 'u4', email: 'david.lee@acme.com', firstName: 'David', lastName: 'Lee', enabled: true, mfaEnabled: false, tenantId: 't1', tenantName: 'Acme Corporation', departmentId: 'd3', departmentName: 'Marketing', roles: [userRole('r3')], createdAt: daysAgo(240), updatedAt: daysAgo(20) },
  { id: 'u5', email: 'emma.wilson@acme.com', firstName: 'Emma', lastName: 'Wilson', enabled: false, mfaEnabled: false, tenantId: 't1', tenantName: 'Acme Corporation', departmentId: 'd4', departmentName: 'Human Resources', roles: [userRole('r3')], createdAt: daysAgo(200), updatedAt: daysAgo(15) },
  { id: 'u6', email: 'frank.moore@acme.com', firstName: 'Frank', lastName: 'Moore', enabled: true, mfaEnabled: false, tenantId: 't1', tenantName: 'Acme Corporation', departmentId: 'd5', departmentName: 'Sales', roles: [userRole('r2')], createdAt: daysAgo(160), updatedAt: daysAgo(6) },
  { id: 'u7', email: 'grace.kim@globex.io', firstName: 'Grace', lastName: 'Kim', enabled: true, mfaEnabled: true, tenantId: 't2', tenantName: 'Globex Industries', departmentId: 'd6', departmentName: 'Operations', roles: [userRole('r1')], createdAt: daysAgo(140), updatedAt: daysAgo(3) },
  { id: 'u8', email: 'henry.patel@globex.io', firstName: 'Henry', lastName: 'Patel', enabled: true, mfaEnabled: false, tenantId: 't2', tenantName: 'Globex Industries', departmentId: 'd6', departmentName: 'Operations', roles: [userRole('r3')], createdAt: daysAgo(120), updatedAt: daysAgo(17) },
  { id: 'u9', email: 'iris.chen@acme.com', firstName: 'Iris', lastName: 'Chen', enabled: true, mfaEnabled: false, tenantId: 't1', tenantName: 'Acme Corporation', departmentId: 'd2', departmentName: 'Finance', roles: [userRole('r4')], createdAt: daysAgo(90), updatedAt: daysAgo(9) },
  { id: 'u10', email: 'jack.brown@acme.com', firstName: 'Jack', lastName: 'Brown', enabled: false, mfaEnabled: false, tenantId: 't1', tenantName: 'Acme Corporation', departmentId: 'd1', departmentName: 'Engineering', roles: [userRole('r3')], createdAt: daysAgo(75), updatedAt: daysAgo(30) },
]

function expense(
  id: string,
  title: string,
  description: string,
  amount: number,
  currency: string,
  category: string,
  status: ExpenseStatus,
  submitterId: string,
  departmentId: string,
  createdDaysAgo: number,
  approverId?: string,
  rejectionReason?: string,
): Expense {
  const submitter = users.find(u => u.id === submitterId)!
  const department = departments.find(d => d.id === departmentId)!
  const approver = approverId ? users.find(u => u.id === approverId)! : null
  return {
    id,
    title,
    description,
    amount,
    currency,
    category,
    status,
    submittedBy: submitter.id,
    submittedByName: `${submitter.firstName} ${submitter.lastName}`,
    approvedBy: approver?.id ?? null,
    approvedByName: approver ? `${approver.firstName} ${approver.lastName}` : null,
    processedBy: status === 'PROCESSED' ? (approver?.id ?? null) : null,
    processedByName: status === 'PROCESSED' && approver ? `${approver.firstName} ${approver.lastName}` : null,
    tenantId: submitter.tenantId,
    tenantName: submitter.tenantName,
    departmentId: department.id,
    departmentName: department.name,
    receiptUrl: null,
    rejectionReason: rejectionReason ?? null,
    createdAt: daysAgo(createdDaysAgo),
    updatedAt: daysAgo(Math.max(0, createdDaysAgo - 1)),
  }
}

export const expenses: Expense[] = [
  expense('e01', 'Client dinner – Q3 review', 'Dinner with the Meridian account team at Ruth\'s Chris.', 248.50, 'USD', 'Meals', 'PENDING', 'u2', 'd1', 1),
  expense('e02', 'Flight to Berlin – sales conference', 'Round-trip economy flight SFO–BER for the annual sales conference.', 1180.00, 'USD', 'Travel', 'PENDING', 'u6', 'd5', 2),
  expense('e03', 'JetBrains license renewal', 'All Products Pack for 12 developers, annual renewal.', 3599.00, 'USD', 'Software', 'PENDING', 'u2', 'd1', 3),
  expense('e04', 'Team offsite catering', 'Catering for the marketing offsite (24 people).', 620.75, 'USD', 'Meals', 'PENDING', 'u4', 'd3', 4),
  expense('e05', 'Ergonomic chair replacement', 'Herman Miller Aeron for workstation 4B.', 1240.00, 'USD', 'Office Supplies', 'PENDING', 'u8', 'd6', 5),
  expense('e06', 'Hotel – Paris trade show', '3 nights at Hôtel Marianne near the venue.', 745.20, 'EUR', 'Travel', 'APPROVED', 'u6', 'd5', 8, 'u3'),
  expense('e07', 'AWS monthly invoice', 'Cloud infrastructure costs for June.', 4820.33, 'USD', 'Services', 'APPROVED', 'u2', 'd1', 12, 'u3'),
  expense('e08', 'Design conference tickets', 'Two passes for Config 2026.', 900.00, 'USD', 'Training', 'APPROVED', 'u4', 'd3', 15, 'u1'),
  expense('e09', 'Monitor arms & cables', 'Desk setup accessories for new hires.', 310.45, 'USD', 'Hardware', 'APPROVED', 'u10', 'd1', 18, 'u1'),
  expense('e10', 'Notion workspace subscription', 'Annual business plan, 40 seats.', 1920.00, 'USD', 'Software', 'PROCESSED', 'u4', 'd3', 25, 'u3'),
  expense('e11', 'Client lunch – deal closing', 'Celebration lunch after closing the Hartwell deal.', 189.90, 'USD', 'Meals', 'PROCESSED', 'u6', 'd5', 30, 'u3'),
  expense('e12', 'MacBook Pro 16" M4', 'New laptop for backend engineering.', 3499.00, 'EUR', 'Hardware', 'PROCESSED', 'u7', 'd6', 35, 'u7'),
  expense('e13', 'Uber rides – client visits', 'Rideshare for three on-site client visits.', 96.25, 'USD', 'Travel', 'REJECTED', 'u5', 'd4', 10, 'u3', 'Missing itemized receipts for two trips.'),
  expense('e14', 'LinkedIn Recruiter seats', 'Two recruiter seats, quarterly billing.', 1700.00, 'USD', 'Services', 'REJECTED', 'u5', 'd4', 20, 'u1', 'Budget already allocated to the existing contract.'),
  expense('e15', 'Bookstore – technical references', 'Three books for the team knowledge library.', 84.60, 'GBP', 'Other', 'CANCELLED', 'u9', 'd2', 22),
  expense('e16', 'Webinar hosting platform', 'Annual plan for customer webinars.', 498.00, 'USD', 'Software', 'CANCELLED', 'u4', 'd3', 26),
]

export const auditLogs: AuditLog[] = [
  { id: 'a01', action: 'LOGIN', resourceType: 'AUTH', resourceId: 'u1', actorId: 'u1', actorEmail: 'alice.johnson@acme.com', tenantId: 't1', tenantName: 'Acme Corporation', details: { method: 'PASSWORD' }, ipAddress: '82.14.203.55', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', result: 'SUCCESS', createdAt: daysAgo(0, 3) },
  { id: 'a02', action: 'LOGIN_FAILED', resourceType: 'AUTH', resourceId: 'u5', actorId: 'u5', actorEmail: 'emma.wilson@acme.com', tenantId: 't1', tenantName: 'Acme Corporation', details: { reason: 'ACCOUNT_DISABLED' }, ipAddress: '198.51.100.7', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5)', result: 'FAILURE', createdAt: daysAgo(0, 9) },
  { id: 'a03', action: 'EXPENSE_APPROVE', resourceType: 'EXPENSE', resourceId: 'e07', actorId: 'u3', actorEmail: 'carol.diaz@acme.com', tenantId: 't1', tenantName: 'Acme Corporation', details: { amount: 4820.33, currency: 'USD' }, ipAddress: '82.14.203.88', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', result: 'SUCCESS', createdAt: daysAgo(1, 2) },
  { id: 'a04', action: 'EXPENSE_REJECT', resourceType: 'EXPENSE', resourceId: 'e13', actorId: 'u3', actorEmail: 'carol.diaz@acme.com', tenantId: 't1', tenantName: 'Acme Corporation', details: { reason: 'Missing itemized receipts for two trips.' }, ipAddress: '82.14.203.88', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', result: 'SUCCESS', createdAt: daysAgo(1, 5) },
  { id: 'a05', action: 'USER_CREATE', resourceType: 'USER', resourceId: 'u10', actorId: 'u1', actorEmail: 'alice.johnson@acme.com', tenantId: 't1', tenantName: 'Acme Corporation', details: { email: 'jack.brown@acme.com', roles: ['Employee'] }, ipAddress: '82.14.203.55', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', result: 'SUCCESS', createdAt: daysAgo(2, 1) },
  { id: 'a06', action: 'USER_DISABLE', resourceType: 'USER', resourceId: 'u10', actorId: 'u1', actorEmail: 'alice.johnson@acme.com', tenantId: 't1', tenantName: 'Acme Corporation', details: {}, ipAddress: '82.14.203.55', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', result: 'SUCCESS', createdAt: daysAgo(2, 4) },
  { id: 'a07', action: 'EXPENSE_CREATE', resourceType: 'EXPENSE', resourceId: 'e05', actorId: 'u8', actorEmail: 'henry.patel@globex.io', tenantId: 't2', tenantName: 'Globex Industries', details: { amount: 1240.00, category: 'Office Supplies' }, ipAddress: '203.0.113.42', userAgent: 'Mozilla/5.0 (X11; Linux x86_64)', result: 'SUCCESS', createdAt: daysAgo(3, 6) },
  { id: 'a08', action: 'ROLE_ASSIGN_PERMISSION', resourceType: 'ROLE', resourceId: 'r2', actorId: 'u1', actorEmail: 'alice.johnson@acme.com', tenantId: 't1', tenantName: 'Acme Corporation', details: { added: ['EXPENSE_PROCESS'] }, ipAddress: '82.14.203.55', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', result: 'SUCCESS', createdAt: daysAgo(4, 2) },
  { id: 'a09', action: 'DEPARTMENT_CREATE', resourceType: 'DEPARTMENT', resourceId: 'd5', actorId: 'u1', actorEmail: 'alice.johnson@acme.com', tenantId: 't1', tenantName: 'Acme Corporation', details: { name: 'Sales' }, ipAddress: '82.14.203.55', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', result: 'SUCCESS', createdAt: daysAgo(5, 3) },
  { id: 'a10', action: 'MFA_VERIFY', resourceType: 'AUTH', resourceId: 'u7', actorId: 'u7', actorEmail: 'grace.kim@globex.io', tenantId: 't2', tenantName: 'Globex Industries', details: {}, ipAddress: '203.0.113.19', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5)', result: 'SUCCESS', createdAt: daysAgo(6, 7) },
  { id: 'a11', action: 'TENANT_UPDATE', resourceType: 'TENANT', resourceId: 't3', actorId: 'u1', actorEmail: 'alice.johnson@acme.com', tenantId: 't3', tenantName: 'Initech Solutions', details: { enabled: false }, ipAddress: '82.14.203.55', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', result: 'SUCCESS', createdAt: daysAgo(7, 1) },
  { id: 'a12', action: 'LOGOUT', resourceType: 'AUTH', resourceId: 'u3', actorId: 'u3', actorEmail: 'carol.diaz@acme.com', tenantId: 't1', tenantName: 'Acme Corporation', details: {}, ipAddress: '82.14.203.88', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', result: 'SUCCESS', createdAt: daysAgo(7, 8) },
  { id: 'a13', action: 'EXPENSE_PROCESS', resourceType: 'EXPENSE', resourceId: 'e12', actorId: 'u7', actorEmail: 'grace.kim@globex.io', tenantId: 't2', tenantName: 'Globex Industries', details: { amount: 3499.00, currency: 'EUR' }, ipAddress: '203.0.113.19', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5)', result: 'FAILURE', createdAt: daysAgo(8, 4) },
  { id: 'a14', action: 'EXPENSE_CANCEL', resourceType: 'EXPENSE', resourceId: 'e16', actorId: 'u4', actorEmail: 'david.lee@acme.com', tenantId: 't1', tenantName: 'Acme Corporation', details: {}, ipAddress: '82.14.203.71', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5)', result: 'SUCCESS', createdAt: daysAgo(9, 2) },
  { id: 'a15', action: 'LOGIN', resourceType: 'AUTH', resourceId: 'u9', actorId: 'u9', actorEmail: 'iris.chen@acme.com', tenantId: 't1', tenantName: 'Acme Corporation', details: { method: 'PASSWORD' }, ipAddress: '212.47.99.10', userAgent: 'Mozilla/5.0 (Android 15; Pixel 8)', result: 'SUCCESS', createdAt: daysAgo(10, 5) },
]

/**
 * In-memory session. Survives while the dev/prod server process runs —
 * good enough to review styling flows without a real backend.
 */
export const mockSession = {
  loggedIn: false,
  pendingMfaEmail: null as string | null,
}

export function getAuthUser(): AuthUser {
  const u = users[0]!
  return {
    id: u.id,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    tenantId: u.tenantId,
    tenantName: u.tenantName,
    roles: u.roles.map(r => r.name.toUpperCase().replace(/\s+/g, '_')),
    permissions: [...ALL_PERMISSION_IDS],
  }
}

let counter = 100
export function nextId(prefix: string): string {
  counter += 1
  return `${prefix}${counter}`
}
