<template>
  <div class="flex flex-wrap items-end gap-4 mb-6">
    <div class="flex-1 min-w-[200px]">
      <label for="search" class="block text-sm font-medium text-slate-700 mb-1">Search</label>
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText
          id="search"
          v-model="localFilters.search"
          placeholder="Search expenses..."
          class="w-full"
          @keyup.enter="applyFilters"
        />
      </IconField>
    </div>

    <div class="w-48">
      <label for="status" class="block text-sm font-medium text-slate-700 mb-1">Status</label>
      <Select
        id="status"
        v-model="localFilters.status"
        :options="statusOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="All statuses"
        class="w-full"
        showClear
        @change="applyFilters"
      />
    </div>

    <div class="w-48">
      <label for="category" class="block text-sm font-medium text-slate-700 mb-1">Category</label>
      <Select
        id="category"
        v-model="localFilters.category"
        :options="categoryOptions"
        placeholder="All categories"
        class="w-full"
        showClear
        @change="applyFilters"
      />
    </div>

    <div class="flex gap-2">
      <Button label="Search" icon="pi pi-search" @click="applyFilters" />
      <Button label="Clear" icon="pi pi-times" severity="secondary" text @click="clearFilters" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExpenseListParams, ExpenseStatus } from '~/types/expense'
import { EXPENSE_CATEGORIES, EXPENSE_STATUS_CONFIG } from '~/types/expense'

const emit = defineEmits<{
  filter: [params: ExpenseListParams]
}>()

const localFilters = reactive({
  search: '',
  status: null as ExpenseStatus | null,
  category: null as string | null,
})

const statusOptions = Object.entries(EXPENSE_STATUS_CONFIG).map(([value, { label }]) => ({
  label,
  value,
}))

const categoryOptions = [...EXPENSE_CATEGORIES]

function applyFilters() {
  const params: ExpenseListParams = {}
  if (localFilters.search) params.search = localFilters.search
  if (localFilters.status) params.status = localFilters.status
  if (localFilters.category) params.category = localFilters.category
  emit('filter', params)
}

function clearFilters() {
  localFilters.search = ''
  localFilters.status = null
  localFilters.category = null
  emit('filter', {})
}
</script>
