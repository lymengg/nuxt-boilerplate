<template>
  <div>
    <DataTable
      :value="departments"
      :loading="loading"
      data-key="id"
    >
      <template #empty>
        <CommonEmptyState message="No departments found" />
      </template>

      <Column field="name" header="Name" sortable>
        <template #body="{ data }">
          <div class="font-medium text-slate-900">{{ data.name }}</div>
        </template>
      </Column>

      <Column field="tenantName" header="Tenant" sortable />

      <Column header="Managers">
        <template #body="{ data }">
          <div v-if="data.managerUsernames.length" class="flex flex-wrap gap-1">
            <Tag
              v-for="username in data.managerUsernames"
              :key="username"
              :value="username"
              severity="info"
            />
          </div>
          <span v-else class="text-slate-400">—</span>
        </template>
      </Column>

      <Column header="Actions" style="width: 100px">
        <template #body="{ data }">
          <div class="flex gap-1">
            <Button
              icon="pi pi-pencil"
              severity="secondary"
              size="small"
              text
              aria-label="Edit"
              @click="$emit('edit', data)"
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              size="small"
              text
              aria-label="Delete"
              @click="$emit('delete', data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <Paginator
      :rows="pagination.state.size"
      :total-records="pagination.state.totalElements"
      :first="pagination.state.page * pagination.state.size"
      :rows-per-page-options="[10, 20, 50]"
      @page="onPage"
    />
  </div>
</template>

<script setup lang="ts">
import type { Department } from '~/types/department'
import type { PaginationState } from '~/types/api'

const props = defineProps<{
  departments: Department[]
  loading: boolean
  pagination: { state: PaginationState }
}>()

const emit = defineEmits<{
  edit: [department: Department]
  delete: [department: Department]
  page: [page: number]
  sizeChange: [size: number]
}>()

function onPage(event: { page: number, rows: number }) {
  if (event.rows !== props.pagination.state.size) {
    emit('sizeChange', event.rows)
  }
  else {
    emit('page', event.page)
  }
}
</script>
