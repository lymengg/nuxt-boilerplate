<template>
  <div>
    <DataTable
      :value="departments"
      :loading="loading"
      stripedRows
      responsiveLayout="scroll"
      :rows="pagination.state.size"
      :first="pagination.state.page * pagination.state.size"
      @page="onPage"
      dataKey="id"
    >
      <template #empty>
        <CommonEmptyState message="No departments found" />
      </template>

      <Column field="name" header="Name" sortable>
        <template #body="{ data }">
          <div class="font-medium text-slate-900">{{ data.name }}</div>
        </template>
      </Column>

      <Column field="description" header="Description" />

      <Column field="tenantName" header="Tenant" sortable />

      <Column field="enabled" header="Status" sortable>
        <template #body="{ data }">
          <Tag
            :value="data.enabled ? 'Active' : 'Inactive'"
            :severity="data.enabled ? 'success' : 'danger'"
          />
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
              @click="$emit('edit', data)"
              aria-label="Edit"
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              size="small"
              text
              @click="$emit('delete', data)"
              aria-label="Delete"
            />
          </div>
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
import type { Department } from '~/types/department'
import type { PaginationState } from '~/types/api'

defineProps<{
  departments: Department[]
  loading: boolean
  pagination: { state: PaginationState }
}>()

defineEmits<{
  edit: [department: Department]
  delete: [department: Department]
  page: [page: number]
}>()

function onPage(event: { page: number, rows: number }) {
  // Emit page change
}
</script>
