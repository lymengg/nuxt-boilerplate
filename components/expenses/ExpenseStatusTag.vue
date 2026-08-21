<template>
  <span :class="['status-badge', statusClass]">{{ label }}</span>
</template>

<script setup lang="ts">
import type { ExpenseStatus } from '~/types'
import { EXPENSE_STATUSES } from '~/types'

const props = defineProps<{
  status: ExpenseStatus
}>()

const statusConfig = computed(() => EXPENSE_STATUSES[props.status])
const label = computed(() => statusConfig.value.label)

const statusClass = computed(() => {
  const map: Record<string, string> = {
    PENDING: 'status-pending',
    APPROVED: 'status-approved',
    PROCESSED: 'status-processed',
    REJECTED: 'status-rejected',
    CANCELLED: 'status-cancelled',
  }
  return map[props.status] || 'status-cancelled'
})
</script>
