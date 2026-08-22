<template>
  <div>
    <DataTable
      :value="tenants"
      :loading="loading"
      dataKey="id"
    >
      <template #empty>
        <CommonEmptyState message="No tenants found" />
      </template>

      <Column field="name" header="Name" sortable>
        <template #body="{ data }">
          <div class="font-medium text-slate-900">{{ data.name }}</div>
        </template>
      </Column>

      <Column field="domain" header="Domain" sortable />

      <Column field="enabled" header="Status" sortable>
        <template #body="{ data }">
          <Tag
            :value="data.enabled ? 'Active' : 'Inactive'"
            :severity="data.enabled ? 'success' : 'danger'"
          />
        </template>
      </Column>

      <Column field="createdAt" header="Created" sortable>
        <template #body="{ data }">
          {{ formatDate(data.createdAt) }}
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
    />
  </div>
</template>

<script setup lang="ts">
import type { Tenant } from '~/types/tenant'
import type { PaginationState } from '~/types/api'

const props = defineProps<{
  tenants: Tenant[]
  loading: boolean
  pagination: { state: PaginationState }
}>()

const emit = defineEmits<{
  edit: [tenant: Tenant]
  delete: [tenant: Tenant]
  page: [page: number]
  sizeChange: [size: number]
}>()

const { formatDate } = useFormat()

function onPage(event: { page: number, rows: number }) {
  if (event.rows !== props.pagination.state.size) {
    emit('sizeChange', event.rows)
  }
  else {
    emit('page', event.page)
  }
}
</script>
