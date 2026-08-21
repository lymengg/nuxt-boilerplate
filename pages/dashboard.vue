<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p class="text-slate-500">Welcome back, {{ user?.firstName }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card v-for="stat in stats" :key="stat.label">
        <template #content>
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-lg flex items-center justify-center"
              :class="stat.bgClass"
            >
              <i :class="stat.icon" class="text-xl" :style="{ color: stat.color }" />
            </div>
            <div>
              <p class="text-sm text-slate-500">{{ stat.label }}</p>
              <p class="text-2xl font-bold text-slate-900">{{ stat.value }}</p>
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
              class="text-sm text-primary-600 hover:text-primary-700"
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
              class="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
            >
              <div>
                <p class="font-medium text-slate-900">{{ expense.title }}</p>
                <p class="text-sm text-slate-500">{{ expense.submittedByName }}</p>
              </div>
              <div class="text-right">
                <p class="font-medium text-slate-900">
                  {{ formatCurrency(expense.amount, expense.currency) }}
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
              class="text-sm text-primary-600 hover:text-primary-700"
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
              class="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
            >
              <div>
                <p class="font-medium text-slate-900">{{ expense.title }}</p>
                <p class="text-sm text-slate-500">{{ expense.submittedByName }}</p>
              </div>
              <div class="text-right">
                <p class="font-medium text-slate-900">
                  {{ formatCurrency(expense.amount, expense.currency) }}
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
  middleware: 'auth',
})

const { user } = useAuth()
const { can } = useAuthorization()
const { expenses: recentExpenses, loading: loadingExpenses, fetchExpenses } = useExpenses()
const { expenses: pendingExpenses, loading: loadingPending, fetchExpenses: fetchPending, approveExpense, rejectExpense } = useExpenses()

const stats = ref([
  { label: 'Total Expenses', value: '0', icon: 'pi pi-wallet', color: '#3b82f6', bgClass: 'bg-blue-50' },
  { label: 'Pending', value: '0', icon: 'pi pi-clock', color: '#f59e0b', bgClass: 'bg-amber-50' },
  { label: 'Approved', value: '0', icon: 'pi pi-check-circle', color: '#10b981', bgClass: 'bg-emerald-50' },
  { label: 'Rejected', value: '0', icon: 'pi pi-times-circle', color: '#ef4444', bgClass: 'bg-red-50' },
])

onMounted(async () => {
  await Promise.all([
    fetchExpenses({ sort: 'createdAt,desc' }),
    fetchPending({ status: 'PENDING', sort: 'createdAt,desc' }),
  ])
})

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

async function handleApprove(expense: Expense) {
  await approveExpense(expense.id)
  await fetchPending({ status: 'PENDING', sort: 'createdAt,desc' })
}

async function handleReject(expense: Expense) {
  // Would open reject dialog
  await rejectExpense(expense.id, 'Rejected')
  await fetchPending({ status: 'PENDING', sort: 'createdAt,desc' })
}
</script>
