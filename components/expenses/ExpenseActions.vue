<template>
  <div class="flex flex-wrap gap-2">
    <Button
      v-if="canApprove"
      label="Approve"
      icon="pi pi-check"
      severity="success"
      size="small"
      :loading="loading"
      @click="$emit('approve')"
    />
    <Button
      v-if="canReject"
      label="Reject"
      icon="pi pi-times"
      severity="danger"
      size="small"
      :loading="loading"
      @click="$emit('reject')"
    />
    <Button
      v-if="canProcess"
      label="Process"
      icon="pi pi-send"
      severity="info"
      size="small"
      :loading="loading"
      @click="$emit('process')"
    />
    <Button
      v-if="canCancel"
      label="Cancel"
      icon="pi pi-ban"
      severity="secondary"
      size="small"
      :loading="loading"
      @click="$emit('cancel')"
    />
    <Button
      v-if="canEdit"
      icon="pi pi-pencil"
      severity="secondary"
      size="small"
      text
      @click="$emit('edit')"
      aria-label="Edit"
    />
    <Button
      v-if="canDelete"
      icon="pi pi-trash"
      severity="danger"
      size="small"
      text
      @click="$emit('delete')"
      aria-label="Delete"
    />
  </div>
</template>

<script setup lang="ts">
import type { Expense, ExpenseStatus } from '~/types/expense'

const props = defineProps<{
  expense: Expense
  loading?: boolean
}>()

defineEmits<{
  approve: []
  reject: []
  process: []
  cancel: []
  edit: []
  delete: []
}>()

const { can } = useAuthorization()

const canApprove = computed(() =>
  props.expense.status === 'PENDING' && can('EXPENSE_APPROVE'),
)

const canReject = computed(() =>
  props.expense.status === 'PENDING' && can('EXPENSE_REJECT'),
)

const canProcess = computed(() =>
  props.expense.status === 'APPROVED' && can('EXPENSE_PROCESS'),
)

const canCancel = computed(() =>
  ['PENDING', 'APPROVED'].includes(props.expense.status) && can('EXPENSE_DELETE'),
)

const canEdit = computed(() =>
  props.expense.status === 'PENDING' && can('EXPENSE_UPDATE'),
)

const canDelete = computed(() =>
  props.expense.status === 'PENDING' && can('EXPENSE_DELETE'),
)
</script>
