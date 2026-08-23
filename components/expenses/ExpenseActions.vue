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
      aria-label="Edit"
      @click="$emit('edit')"
    />
  </div>
</template>

<script setup lang="ts">
import type { Expense } from '~/types/expense'

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

// The backend requires EXPENSE_UPDATE to cancel an expense.
const canCancel = computed(() =>
  props.expense.status === 'PENDING' && can('EXPENSE_UPDATE'),
)

const canEdit = computed(() =>
  props.expense.status === 'PENDING' && can('EXPENSE_UPDATE'),
)
</script>
