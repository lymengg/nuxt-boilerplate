<template>
  <NuxtLayout name="dashboard">
    <div class="page-container">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="page-title">Expenses</h1>
          <p class="page-subtitle">Manage and track expense requests</p>
        </div>
        <Button label="New Expense" icon="pi pi-plus" @click="showCreateDialog = true" />
      </div>

      <div class="filter-bar">
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText v-model="filters.search" placeholder="Search expenses..." @keyup.enter="handleSearch" />
        </IconField>
        <Select
          v-model="filters.status"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="All Statuses"
          class="w-48"
          showClear
          @change="handleStatusChange"
        />
        <Select
          v-model="filters.category"
          :options="categoryOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="All Categories"
          class="w-48"
          showClear
          @change="handleCategoryChange"
        />
        <Button label="Reset" severity="secondary" text @click="resetFilters" />
      </div>

      <div class="table-container">
        <DataTable
          :value="expenses"
          :loading="isLoading"
          lazy
          paginator
          :first="pagination.page.value * pagination.size.value"
          :rows="pagination.size.value"
          :totalRecords="pagination.totalElements.value"
          @page="onPage"
          @sort="onSort"
          sortMode="single"
          :sortField="pagination.sort.value"
          :sortOrder="pagination.direction.value === 'asc' ? 1 : -1"
          stripedRows
          responsiveLayout="scroll"
        >
          <template #empty>
            <div class="text-center py-8">
              <p class="text-surface-500">No expenses found</p>
            </div>
          </template>

          <Column field="title" header="Title" sortable>
            <template #body="{ data }">
              <div>
                <p class="font-medium text-surface-900">{{ data.title }}</p>
                <p class="text-xs text-surface-500 mt-0.5">{{ data.category }}</p>
              </div>
            </template>
          </Column>

          <Column field="amount" header="Amount" sortable>
            <template #body="{ data }">
              <span class="font-medium">{{ formatCurrency(data.amount, data.currency) }}</span>
            </template>
          </Column>

          <Column field="status" header="Status" sortable>
            <template #body="{ data }">
              <ExpenseStatusTag :status="data.status" />
            </template>
          </Column>

          <Column field="submittedBy" header="Submitted By">
            <template #body="{ data }">
              <span class="text-sm">{{ data.submittedBy.firstName }} {{ data.submittedBy.lastName }}</span>
            </template>
          </Column>

          <Column field="createdAt" header="Date" sortable>
            <template #body="{ data }">
              <span class="text-sm text-surface-600">{{ formatDate(data.createdAt) }}</span>
            </template>
          </Column>

          <Column header="Actions" style="width: 120px">
            <template #body="{ data }">
              <div class="flex items-center gap-1">
                <Button
                  icon="pi pi-eye"
                  severity="secondary"
                  text
                  rounded
                  size="small"
                  @click="viewExpense(data)"
                  aria-label="View expense"
                />
                <Button
                  v-if="can('EXPENSE_APPROVE') && data.status === 'PENDING'"
                  icon="pi pi-check"
                  severity="success"
                  text
                  rounded
                  size="small"
                  @click="approveExpense(data)"
                  aria-label="Approve expense"
                />
                <Button
                  v-if="can('EXPENSE_APPROVE') && data.status === 'PENDING'"
                  icon="pi pi-times"
                  severity="danger"
                  text
                  rounded
                  size="small"
                  @click="rejectExpense(data)"
                  aria-label="Reject expense"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>

      <Dialog
        v-model:visible="showCreateDialog"
        header="New Expense"
        modal
        :style="{ width: '500px' }"
      >
        <ExpenseForm
          @submit="handleCreate"
          @cancel="showCreateDialog = false"
        />
      </Dialog>

      <Dialog
        v-model:visible="showRejectDialog"
        header="Reject Expense"
        modal
        :style="{ width: '400px' }"
      >
        <div class="space-y-4">
          <div class="form-field">
            <label for="rejectReason" class="form-label">Reason for Rejection</label>
            <Textarea
              id="rejectReason"
              v-model="rejectReason"
              rows="3"
              class="w-full"
              placeholder="Provide a reason for rejection..."
            />
          </div>
        </div>
        <template #footer>
          <Button label="Cancel" severity="secondary" text @click="showRejectDialog = false" />
          <Button label="Reject" severity="danger" :disabled="!rejectReason" @click="confirmReject" />
        </template>
      </Dialog>

      <Toast />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import { EXPENSE_CATEGORIES, EXPENSE_STATUSES } from '~/types'
import type { Expense, ExpenseStatus } from '~/types'
import { expenseService } from '~/services/expense.service'

definePageMeta({
  layout: false,
  middleware: ['auth'],
})

const { expenses, isLoading, pagination, fetchExpenses } = useExpenses()
const { can } = useAuthorization()
const toast = useToast()

const showCreateDialog = ref(false)
const showRejectDialog = ref(false)
const rejectReason = ref('')
const selectedExpense = ref<Expense | null>(null)

const filters = reactive({
  search: '',
  status: null as ExpenseStatus | null,
  category: null as string | null,
})

const statusOptions = Object.entries(EXPENSE_STATUSES).map(([value, { label }]) => ({
  label,
  value,
}))

const categoryOptions = EXPENSE_CATEGORIES.map((c) => ({
  label: c,
  value: c,
}))

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function resetFilters() {
  filters.search = ''
  filters.status = null
  filters.category = null
  fetchExpenses()
}

function handleSearch() {
  fetchExpenses({
    search: filters.search || undefined,
    status: filters.status || undefined,
    category: filters.category || undefined,
  })
}

function handleStatusChange() {
  fetchExpenses({
    search: filters.search || undefined,
    status: filters.status || undefined,
    category: filters.category || undefined,
  })
}

function handleCategoryChange() {
  fetchExpenses({
    search: filters.search || undefined,
    status: filters.status || undefined,
    category: filters.category || undefined,
  })
}

function onPage(event: { page: number }) {
  pagination.setPage(event.page)
  fetchExpenses({
    search: filters.search || undefined,
    status: filters.status || undefined,
    category: filters.category || undefined,
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onSort(event: any) {
  const field = typeof event.sortField === 'string' ? event.sortField : undefined
  if (field) {
    pagination.setSort(field, event.sortOrder === 1 ? 'asc' : 'desc')
    fetchExpenses({
      search: filters.search || undefined,
      status: filters.status || undefined,
      category: filters.category || undefined,
    })
  }
}

function viewExpense(expense: Expense) {
  navigateTo(`/expenses/${expense.id}`)
}

function approveExpense(expense: Expense) {
  selectedExpense.value = expense
  confirmExpenseAction(expense.id, 'approve')
}

function rejectExpense(expense: Expense) {
  selectedExpense.value = expense
  rejectReason.value = ''
  showRejectDialog.value = true
}

async function confirmExpenseAction(id: string, action: 'approve' | 'reject') {
  try {
    if (action === 'approve') {
      await expenseService.approve(id)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Expense approved', life: 3000 })
    } else {
      await expenseService.reject(id, { reason: rejectReason.value })
      toast.add({ severity: 'success', summary: 'Success', detail: 'Expense rejected', life: 3000 })
      showRejectDialog.value = false
    }
    fetchExpenses({
      search: filters.search || undefined,
      status: filters.status || undefined,
      category: filters.category || undefined,
    })
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to process expense', life: 3000 })
  }
}

async function confirmReject() {
  if (!selectedExpense.value || !rejectReason.value) return
  await confirmExpenseAction(selectedExpense.value.id, 'reject')
}

async function handleCreate(data: unknown) {
  try {
    await expenseService.create(data as Parameters<typeof expenseService.create>[0])
    toast.add({ severity: 'success', summary: 'Success', detail: 'Expense created', life: 3000 })
    showCreateDialog.value = false
    fetchExpenses({
      search: filters.search || undefined,
      status: filters.status || undefined,
      category: filters.category || undefined,
    })
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create expense', life: 3000 })
  }
}

onMounted(() => {
  fetchExpenses()
})
</script>
