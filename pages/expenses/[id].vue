<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold text-slate-900">Expense Details</h1>
        <p class="text-slate-500">{{ expense?.title }}</p>
      </div>
      <Button
        label="Back to Expenses"
        icon="pi pi-arrow-left"
        severity="secondary"
        text
        @click="navigateTo('/expenses')"
      />
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <ProgressSpinner />
    </div>

    <div v-else-if="!expense" class="text-center py-12">
      <Message severity="error">Expense not found</Message>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <Card>
          <template #title>Expense Information</template>
          <template #content>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-slate-500">Title</p>
                <p class="font-medium">{{ expense.title }}</p>
              </div>
              <div>
                <p class="text-sm text-slate-500">Status</p>
                <ExpensesExpenseStatusTag :status="expense.status" />
              </div>
              <div>
                <p class="text-sm text-slate-500">Amount</p>
                <p class="font-medium">{{ formatCurrency(expense.amount, expense.currency) }}</p>
              </div>
              <div>
                <p class="text-sm text-slate-500">Category</p>
                <p class="font-medium">{{ expense.category }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-sm text-slate-500">Description</p>
                <p class="font-medium">{{ expense.description || 'No description' }}</p>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <div>
        <Card>
          <template #title>Details</template>
          <template #content>
            <div class="flex flex-col gap-3">
              <div>
                <p class="text-sm text-slate-500">Submitted By</p>
                <p class="font-medium">{{ expense.submittedByName }}</p>
              </div>
              <div>
                <p class="text-sm text-slate-500">Department</p>
                <p class="font-medium">{{ expense.departmentName }}</p>
              </div>
              <div>
                <p class="text-sm text-slate-500">Created</p>
                <p class="font-medium">{{ formatDate(expense.createdAt) }}</p>
              </div>
              <div v-if="expense.approvedByName">
                <p class="text-sm text-slate-500">Approved By</p>
                <p class="font-medium">{{ expense.approvedByName }}</p>
              </div>
              <div v-if="expense.rejectionReason">
                <p class="text-sm text-slate-500">Rejection Reason</p>
                <p class="font-medium text-red-600">{{ expense.rejectionReason }}</p>
              </div>
            </div>
          </template>
        </Card>

        <Card class="mt-6">
          <template #title>Actions</template>
          <template #content>
            <ExpensesExpenseActions
              :expense="expense"
              @approve="handleApprove"
              @reject="handleReject"
              @process="handleProcess"
              @cancel="handleCancel"
              @edit="handleEdit"
              @delete="handleDelete"
            />
          </template>
        </Card>
      </div>
    </div>

    <ExpensesExpenseForm
      v-model:visible="showEditDialog"
      :expense="expense"
      @saved="onSaved"
    />

    <ConfirmDialog />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import type { Expense } from '~/types/expense'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const route = useRoute()
const { formatCurrency, formatDate } = useFormat()
const { getExpense, approveExpense, rejectExpense, processExpense, cancelExpense, deleteExpense } = useExpenses()
const confirm = useConfirm()
const toast = useToast()

const expense = ref<Expense | undefined>(undefined)
const loading = ref(true)
const showEditDialog = ref(false)

onMounted(async () => {
  const id = route.params.id as string
  const result = await getExpense(id)
  expense.value = result ?? undefined
  loading.value = false
})

function handleEdit() {
  showEditDialog.value = true
}

async function handleApprove() {
  if (!expense.value) return
  confirm.require({
    message: 'Are you sure you want to approve this expense?',
    header: 'Approve Expense',
    icon: 'pi pi-check-circle',
    acceptClass: 'p-button-success',
    accept: async () => {
      await approveExpense(expense.value!.id)
      expense.value = (await getExpense(expense.value!.id)) ?? undefined
      toast.add({ severity: 'success', summary: 'Approved', detail: 'Expense approved successfully', life: 3000 })
    },
  })
}

async function handleReject() {
  if (!expense.value) return
  confirm.require({
    message: 'Are you sure you want to reject this expense?',
    header: 'Reject Expense',
    icon: 'pi pi-times-circle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await rejectExpense(expense.value!.id, 'Rejected by manager')
      expense.value = (await getExpense(expense.value!.id)) ?? undefined
      toast.add({ severity: 'warn', summary: 'Rejected', detail: 'Expense rejected', life: 3000 })
    },
  })
}

async function handleProcess() {
  if (!expense.value) return
  confirm.require({
    message: 'Are you sure you want to process this expense?',
    header: 'Process Expense',
    icon: 'pi pi-send',
    accept: async () => {
      await processExpense(expense.value!.id)
      expense.value = (await getExpense(expense.value!.id)) ?? undefined
      toast.add({ severity: 'success', summary: 'Processed', detail: 'Expense processed successfully', life: 3000 })
    },
  })
}

async function handleCancel() {
  if (!expense.value) return
  confirm.require({
    message: 'Are you sure you want to cancel this expense?',
    header: 'Cancel Expense',
    icon: 'pi pi-ban',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await cancelExpense(expense.value!.id)
      expense.value = (await getExpense(expense.value!.id)) ?? undefined
      toast.add({ severity: 'info', summary: 'Cancelled', detail: 'Expense cancelled', life: 3000 })
    },
  })
}

async function handleDelete() {
  if (!expense.value) return
  confirm.require({
    message: 'Are you sure you want to delete this expense? This action cannot be undone.',
    header: 'Delete Expense',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await deleteExpense(expense.value!.id)
      navigateTo('/expenses')
      toast.add({ severity: 'success', summary: 'Deleted', detail: 'Expense deleted successfully', life: 3000 })
    },
  })
}

function onSaved() {
  showEditDialog.value = false
}
</script>
