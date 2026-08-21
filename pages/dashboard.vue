<template>
  <NuxtLayout name="dashboard">
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Welcome back, {{ userName }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card v-for="stat in stats" :key="stat.label" class="shadow-sm">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-surface-500">{{ stat.label }}</p>
                <p class="text-2xl font-semibold text-surface-900 mt-1">{{ stat.value }}</p>
              </div>
              <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', stat.bgClass]">
                <span :class="['text-lg', stat.iconClass]">{{ stat.icon }}</span>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card class="shadow-sm">
          <template #title>
            <div class="flex items-center justify-between">
              <span class="text-base font-semibold">Recent Expenses</span>
              <NuxtLink to="/expenses" class="text-sm text-primary-600 hover:text-primary-700">View All</NuxtLink>
            </div>
          </template>
          <template #content>
            <div v-if="isLoading" class="space-y-3">
              <div v-for="i in 3" :key="i" class="flex items-center gap-3">
                <Skeleton shape="circle" size="2rem" />
                <div class="flex-1">
                  <Skeleton width="60%" height="1rem" />
                  <Skeleton width="40%" height="0.75rem" class="mt-1" />
                </div>
              </div>
            </div>
            <div v-else-if="recentExpenses.length === 0" class="text-center py-8">
              <p class="text-sm text-surface-500">No recent expenses</p>
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="expense in recentExpenses"
                :key="expense.id"
                class="flex items-center justify-between p-3 rounded-lg hover:bg-surface-50"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-surface-100 rounded-full flex items-center justify-center">
                    <span class="text-xs font-medium text-surface-600">
                      {{ expense.category.substring(0, 2) }}
                    </span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-surface-900">{{ expense.title }}</p>
                    <p class="text-xs text-surface-500">{{ expense.submittedAt }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-surface-900">{{ formatCurrency(expense.amount, expense.currency) }}</p>
                  <ExpenseStatusTag :status="expense.status" />
                </div>
              </div>
            </div>
          </template>
        </Card>

        <Card class="shadow-sm">
          <template #title>
            <span class="text-base font-semibold">Quick Actions</span>
          </template>
          <template #content>
            <div class="space-y-3">
              <NuxtLink to="/expenses" class="block">
                <Button
                  label="Submit New Expense"
                  icon="pi pi-plus"
                  class="w-full"
                  severity="secondary"
                />
              </NuxtLink>
              <NuxtLink v-if="can('USER_CREATE')" to="/management/users" class="block">
                <Button
                  label="Manage Users"
                  icon="pi pi-users"
                  class="w-full"
                  severity="secondary"
                  outlined
                />
              </NuxtLink>
              <NuxtLink v-if="can('ROLE_CREATE')" to="/management/roles" class="block">
                <Button
                  label="Manage Roles"
                  icon="pi pi-shield"
                  class="w-full"
                  severity="secondary"
                  outlined
                />
              </NuxtLink>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Card from 'primevue/card'
import Skeleton from 'primevue/skeleton'
import type { Expense } from '~/types'
import { expenseService } from '~/services/expense.service'

definePageMeta({
  layout: false,
  middleware: ['auth'],
})

const { user } = useAuth()
const { can } = useAuthorization()

const userName = computed(() => {
  if (!user.value) return ''
  return user.value.firstName
})

const stats = ref([
  { label: 'Total Expenses', value: '—', icon: '📋', bgClass: 'bg-blue-50', iconClass: 'text-blue-600' },
  { label: 'Pending Approval', value: '—', icon: '⏳', bgClass: 'bg-amber-50', iconClass: 'text-amber-600' },
  { label: 'Approved', value: '—', icon: '✓', bgClass: 'bg-green-50', iconClass: 'text-green-600' },
  { label: 'Total Amount', value: '—', icon: '💰', bgClass: 'bg-purple-50', iconClass: 'text-purple-600' },
])

const recentExpenses = ref<Expense[]>([])
const isLoading = ref(true)

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

onMounted(async () => {
  try {
    const response = await expenseService.list({ page: 0, size: 5, sort: 'createdAt', direction: 'desc' })
    if (response.success && response.data) {
      recentExpenses.value = response.data.content
    }
  } catch {
    // Dashboard data loading failed silently
  } finally {
    isLoading.value = false
  }
})
</script>
