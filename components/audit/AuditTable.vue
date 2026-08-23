<template>
  <div>
    <DataTable
      :value="auditLogs"
      :loading="loading"
      data-key="id"
    >
      <template #empty>
        <CommonEmptyState message="No audit logs found" />
      </template>

      <Column field="timestamp" header="Timestamp" sortable>
        <template #body="{ data }">
          {{ formatDateTime(data.timestamp) }}
        </template>
      </Column>

      <Column field="actorUsername" header="Actor" sortable />

      <Column field="action" header="Action" sortable>
        <template #body="{ data }">
          <Tag :value="data.action" :severity="getActionSeverity(data.action)" />
        </template>
      </Column>

      <Column field="resourceType" header="Resource Type" sortable />

      <Column field="resourceId" header="Resource ID">
        <template #body="{ data }">
          <code v-if="data.resourceId" class="text-xs bg-slate-100 px-1.5 py-0.5 rounded">{{ data.resourceId }}</code>
          <span v-else class="text-slate-400">—</span>
        </template>
      </Column>

      <Column header="Details">
        <template #body="{ data }">
          <span v-if="data.details" class="text-sm text-slate-600 line-clamp-1">{{ data.details }}</span>
          <span v-else class="text-slate-400">—</span>
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
import type { AuditLog } from '~/types/audit'
import type { PaginationState } from '~/types/api'

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined

const props = defineProps<{
  auditLogs: AuditLog[]
  loading: boolean
  pagination: { state: PaginationState }
}>()

const emit = defineEmits<{
  page: [page: number]
  sizeChange: [size: number]
}>()

const { formatDateTime } = useFormat()

function onPage(event: { page: number, rows: number }) {
  if (event.rows !== props.pagination.state.size) {
    emit('sizeChange', event.rows)
  }
  else {
    emit('page', event.page)
  }
}

function getActionSeverity(action: string): TagSeverity {
  if (action.includes('DELETE') || action.includes('FAILED')) return 'danger'
  if (action.includes('CREATE') || action.includes('APPROVE')) return 'success'
  if (action.includes('UPDATE') || action.includes('ENABLE') || action.includes('ASSIGN')) return 'info'
  return 'secondary'
}
</script>
