<template>
  <div>
    <DataTable
      :value="tenants"
      :loading="loading"
      data-key="id"
    >
      <template #empty>
        <CommonEmptyState message="No tenants found" />
      </template>

      <Column field="name" header="Name" sortable>
        <template #body="{ data }">
          <div class="font-medium text-slate-900">{{ data.name }}</div>
        </template>
      </Column>

      <Column field="status" header="Status" sortable>
        <template #body="{ data }">
          <Tag
            :value="statusLabel(data.status)"
            :severity="statusSeverity(data.status)"
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
import type { Tenant, TenantStatus } from '~/types/tenant'
import { TENANT_STATUS_CONFIG } from '~/types/tenant'
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

function statusLabel(status: string): string {
  return TENANT_STATUS_CONFIG[status as TenantStatus]?.label ?? status
}

function statusSeverity(status: string): string {
  return TENANT_STATUS_CONFIG[status as TenantStatus]?.severity ?? 'secondary'
}

function onPage(event: { page: number, rows: number }) {
  if (event.rows !== props.pagination.state.size) {
    emit('sizeChange', event.rows)
  }
  else {
    emit('page', event.page)
  }
}
</script>
