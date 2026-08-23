<template>
  <div>
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-slate-900">Dashboard</h1>
      <p class="text-slate-500">Welcome back, {{ user?.firstName }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card v-for="stat in stats" :key="stat.label">
        <template #content>
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-slate-500">{{ stat.label }}</p>
              <p class="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900">{{ stat.value }}</p>
            </div>
            <div
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              :class="stat.bgClass"
            >
              <i :class="stat.icon" class="text-lg" :style="{ color: stat.color }" />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <template #title>
          <div class="flex items-center justify-between">
            <span>Recent Expenses</span>
            <NuxtLink
              v-if="can('EXPENSE_READ')"
              to="/expenses"
              class="group inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
            >
              View all
            </NuxtLink>
          </div>
        </template>
        <template #content>
          <div v-if="loadingExpenses" class="flex justify-center py-8">
            <ProgressSpinner />
          </div>
          <div v-else-if="recentExpenses.length === 0" class="text-center py-8 text-slate-500">
            No recent expenses
          </div>
          <div v-else class="flex flex-col gap-3">
            <div
              v-for="expense in recentExpenses"
              :key="expense.id"
              class="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-sm"
            >
              <div>
                <p class="font-medium text-slate-900">{{ expense.title }}</p>
                <p class="text-sm text-slate-500">{{ expense.ownerUsername }}</p>
              </div>
              <div class="text-right">
                <p class="font-medium text-slate-900">
                  {{ formatCurrency(expense.amount) }}
                </p>
                <ExpensesExpenseStatusTag :status="expense.status" />
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Card>
        <template #title>
          <div class="flex items-center justify-between">
            <span>Pending Approvals</span>
            <NuxtLink
              v-if="can('EXPENSE_APPROVE')"
              to="/expenses?status=PENDING"
              class="group inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
            >
              View all
            </NuxtLink>
          </div>
        </template>
        <template #content>
          <div v-if="loadingPending" class="flex justify-center py-8">
            <ProgressSpinner />
          </div>
          <div v-else-if="pendingExpenses.length === 0" class="text-center py-8 text-slate-500">
            No pending approvals
          </div>
          <div v-else class="flex flex-col gap-3">
            <div
              v-for="expense in pendingExpenses"
              :key="expense.id"
              class="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-sm"
            >
              <div>
                <p class="font-medium text-slate-900">{{ expense.title }}</p>
                <p class="text-sm text-slate-500">{{ expense.ownerUsername }}</p>
              </div>
              <div class="text-right">
                <p class="font-medium text-slate-900">
                  {{ formatCurrency(expense.amount) }}
                </p>
                <ExpensesExpenseActions
                  :expense="expense"
                  @approve="handleApprove(expense)"
                  @reject="handleReject(expense)"
                />
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Expense } from '~/types/expense'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { formatCurrency } = useFormat()
const { user } = storeToRefs(useAuthStore())
const { can } = useAuthorization()
const {
  expenses: recentExpenses,
  loading: loadingExpenses,
  pagination: recentPagination,
  fetchExpenses,
} = useExpenses()
const {
  expenses: pendingExpenses,
  loading: loadingPending,
  pagination: pendingPagination,
  fetchExpenses: fetchPending,
  approveExpense,
  rejectExpense,
} = useExpenses()
const { pagination: approvedPagination, fetchExpenses: fetchApproved } = useExpenses()
const { pagination: rejectedPagination, fetchExpenses: fetchRejected } = useExpenses()

const stats = ref([
  { label: 'Total Expenses', value: '0', icon: 'pi pi-wallet', color: '#3b82f6', bgClass: 'bg-blue-50' },
  { label: 'Pending', value: '0', icon: 'pi pi-clock', color: '#f59e0b', bgClass: 'bg-amber-50' },
  { label: 'Approved', value: '0', icon: 'pi pi-check-circle', color: '#10b981', bgClass: 'bg-emerald-50' },
  { label: 'Rejected', value: '0', icon: 'pi pi-times-circle', color: '#ef4444', bgClass: 'bg-red-50' },
])

onMounted(async () => {
  await Promise.all([
    fetchExpenses({ sort: 'submissionDate,desc' }),
    fetchPending({ status: 'PENDING', sort: 'submissionDate,desc' }),
    fetchApproved({ status: 'APPROVED', size: 1 }),
    fetchRejected({ status: 'REJECTED', size: 1 }),
  ])

  stats.value = [
    { ...stats.value[0]!, value: String(recentPagination.state.totalElements) },
    { ...stats.value[1]!, value: String(pendingPagination.state.totalElements) },
    { ...stats.value[2]!, value: String(approvedPagination.state.totalElements) },
    { ...stats.value[3]!, value: String(rejectedPagination.state.totalElements) },
  ]
})

async function handleApprove(expense: Expense) {
  await approveExpense(expense.id)
  await fetchPending({ status: 'PENDING', sort: 'submissionDate,desc' })
}

async function handleReject(expense: Expense) {
  await rejectExpense(expense.id)
  await fetchPending({ status: 'PENDING', sort: 'submissionDate,desc' })
}
</script>
