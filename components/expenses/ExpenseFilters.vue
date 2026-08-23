<template>
  <div class="flex flex-wrap items-end gap-4 mb-6">
    <div class="w-48">
      <label for="status" class="block text-sm font-medium text-slate-700 mb-1">Status</label>
      <Select
        id="status"
        v-model="localFilters.status"
        :options="statusOptions"
        option-label="label"
        option-value="value"
        placeholder="All statuses"
        class="w-full"
        show-clear
        @change="applyFilters"
      />
    </div>

    <div class="w-48">
      <label for="department" class="block text-sm font-medium text-slate-700 mb-1">Department</label>
      <Select
        id="department"
        v-model="localFilters.departmentId"
        :options="departments"
        option-label="name"
        option-value="id"
        placeholder="All departments"
        class="w-full"
        show-clear
        @change="applyFilters"
      />
    </div>

    <div class="flex gap-2">
      <Button label="Clear" icon="pi pi-times" severity="secondary" text @click="clearFilters" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExpenseListParams, ExpenseStatus } from '~/types/expense'
import { EXPENSE_STATUS_CONFIG } from '~/types/expense'

const emit = defineEmits<{
  filter: [params: ExpenseListParams]
}>()

// The backend expense list supports status / departmentId filters only.
const localFilters = reactive({
  status: null as ExpenseStatus | null,
  departmentId: null as number | null,
})

const { allDepartments, fetchAllDepartments } = useDepartments()

const statusOptions = Object.entries(EXPENSE_STATUS_CONFIG).map(([value, { label }]) => ({
  label,
  value,
}))

const departments = computed(() => allDepartments.value)

onMounted(() => {
  fetchAllDepartments()
})

function applyFilters() {
  const params: ExpenseListParams = {}
  if (localFilters.status) params.status = localFilters.status
  if (localFilters.departmentId !== null) params.departmentId = localFilters.departmentId
  emit('filter', params)
}

function clearFilters() {
  localFilters.status = null
  localFilters.departmentId = null
  emit('filter', {})
}
</script>
