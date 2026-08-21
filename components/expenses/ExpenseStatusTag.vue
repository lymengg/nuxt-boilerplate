<template>
  <Tag
    :value="config.label"
    :severity="config.severity"
  />
</template>

<script setup lang="ts">
import type { ExpenseStatus } from '~/types/expense'
import { EXPENSE_STATUS_CONFIG } from '~/types/expense'

const props = defineProps<{
  status: ExpenseStatus
}>()

const config = computed(() => EXPENSE_STATUS_CONFIG[props.status] || EXPENSE_STATUS_CONFIG.PENDING)
</script>
