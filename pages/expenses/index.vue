<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Expenses</h1>
        <p class="text-slate-500">Manage and track expenses</p>
      </div>
      <Button
        v-if="can('EXPENSE_CREATE')"
        label="New Expense"
        icon="pi pi-plus"
        @click="showCreateDialog = true"
      />
    </div>

    <Card>
      <template #content>
        <ExpensesExpenseFilters @filter="handleFilter" />

        <ExpensesExpenseTable
          :expenses="expenses"
          :loading="loading"
          :pagination="pagination"
          @approve="handleApprove"
          @reject="handleReject"
          @process="handleProcess"
          @cancel="handleCancel"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </template>
    </Card>

    <ExpensesExpenseForm
      v-model:visible="showCreateDialog"
      @saved="onSaved"
    />

    <ExpensesExpenseForm
      v-model:visible="showEditDialog"
      :expense="selectedExpense"
      @saved="onSaved"
    />

    <ConfirmDialog />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import type { Expense } from '~/types/expense'

definePageMeta({
  middleware: 'auth',
})

const { can } = useAuthorization()
const { expenses, loading, pagination, fetchExpenses, approveExpense, rejectExpense, processExpense, cancelExpense, deleteExpense } = useExpenses()
const confirm = useConfirm()
const toast = useToast()

const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const selectedExpense = ref<Expense | undefined>(undefined)

const currentFilters = ref<Record<string, unknown>>({})

onMounted(() => {
  fetchExpenses()
})

function handleFilter(filters: Parameters<typeof fetchExpenses>[0]) {
  currentFilters.value = filters as Record<string, unknown>
  pagination.reset()
  fetchExpenses(filters)
}

function handleEdit(expense: Expense) {
  selectedExpense.value = expense
  showEditDialog.value = true
}

function handleApprove(expense: Expense) {
  confirm.require({
    message: `Are you sure you want to approve "${expense.title}"?`,
    header: 'Approve Expense',
    icon: 'pi pi-check-circle',
    acceptClass: 'p-button-success',
    accept: async () => {
      await approveExpense(expense.id)
      toast.add({ severity: 'success', summary: 'Approved', detail: 'Expense approved successfully', life: 3000 })
    },
  })
}

function handleReject(expense: Expense) {
  confirm.require({
    message: `Are you sure you want to reject "${expense.title}"?`,
    header: 'Reject Expense',
    icon: 'pi pi-times-circle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await rejectExpense(expense.id, 'Rejected by manager')
      toast.add({ severity: 'warn', summary: 'Rejected', detail: 'Expense rejected', life: 3000 })
    },
  })
}

function handleProcess(expense: Expense) {
  confirm.require({
    message: `Are you sure you want to process "${expense.title}"?`,
    header: 'Process Expense',
    icon: 'pi pi-send',
    accept: async () => {
      await processExpense(expense.id)
      toast.add({ severity: 'success', summary: 'Processed', detail: 'Expense processed successfully', life: 3000 })
    },
  })
}

function handleCancel(expense: Expense) {
  confirm.require({
    message: `Are you sure you want to cancel "${expense.title}"?`,
    header: 'Cancel Expense',
    icon: 'pi pi-ban',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await cancelExpense(expense.id)
      toast.add({ severity: 'info', summary: 'Cancelled', detail: 'Expense cancelled', life: 3000 })
    },
  })
}

function handleDelete(expense: Expense) {
  confirm.require({
    message: `Are you sure you want to delete "${expense.title}"? This action cannot be undone.`,
    header: 'Delete Expense',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await deleteExpense(expense.id)
      toast.add({ severity: 'success', summary: 'Deleted', detail: 'Expense deleted successfully', life: 3000 })
    },
  })
}

function onSaved() {
  showCreateDialog.value = false
  showEditDialog.value = false
  selectedExpense.value = undefined
  fetchExpenses(currentFilters.value as Parameters<typeof fetchExpenses>[0])
}
</script>
