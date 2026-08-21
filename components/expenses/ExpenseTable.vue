<template>
  <div>
    <DataTable
      :value="expenses"
      :loading="loading"
      stripedRows
      responsiveLayout="scroll"
      :rows="pagination.state.size"
      :first="pagination.state.page * pagination.state.size"
      @page="onPage"
      dataKey="id"
    >
      <template #empty>
        <CommonEmptyState message="No expenses found" />
      </template>

      <Column field="title" header="Title" sortable>
        <template #body="{ data }">
          <div class="font-medium text-slate-900">{{ data.title }}</div>
        </template>
      </Column>

      <Column field="amount" header="Amount" sortable>
        <template #body="{ data }">
          {{ formatCurrency(data.amount, data.currency) }}
        </template>
      </Column>

      <Column field="category" header="Category" sortable />

      <Column field="status" header="Status" sortable>
        <template #body="{ data }">
          <ExpensesExpenseStatusTag :status="data.status" />
        </template>
      </Column>

      <Column field="submittedByName" header="Submitted By" sortable />

      <Column field="createdAt" header="Date" sortable>
        <template #body="{ data }">
          {{ formatDate(data.createdAt) }}
        </template>
      </Column>

      <Column header="Actions" style="width: 200px">
        <template #body="{ data }">
          <ExpensesExpenseActions
            :expense="data"
            @approve="$emit('approve', data)"
            @reject="$emit('reject', data)"
            @process="$emit('process', data)"
            @cancel="$emit('cancel', data)"
            @edit="$emit('edit', data)"
            @delete="$emit('delete', data)"
          />
        </template>
      </Column>
    </DataTable>

    <Paginator
      :rows="pagination.state.size"
      :totalRecords="pagination.state.totalElements"
      :first="pagination.state.page * pagination.state.size"
      :rowsPerPageOptions="[10, 20, 50]"
      @page="onPage"
      class="mt-4"
    />
  </div>
</template>

<script setup lang="ts">
import type { Expense } from '~/types/expense'
import type { PaginationState } from '~/types/api'

defineProps<{
  expenses: Expense[]
  loading: boolean
  pagination: { state: PaginationState }
}>()

defineEmits<{
  approve: [expense: Expense]
  reject: [expense: Expense]
  process: [expense: Expense]
  cancel: [expense: Expense]
  edit: [expense: Expense]
  delete: [expense: Expense]
  page: [page: number]
  sizeChange: [size: number]
}>()

function onPage(event: { page: number, rows: number }) {
  // Emit page change
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>
