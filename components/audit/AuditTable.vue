<template>
  <div>
    <DataTable
      :value="auditLogs"
      :loading="loading"
      dataKey="id"
    >
      <template #empty>
        <CommonEmptyState message="No audit logs found" />
      </template>

      <Column field="createdAt" header="Timestamp" sortable>
        <template #body="{ data }">
          {{ formatDateTime(data.createdAt) }}
        </template>
      </Column>

      <Column field="actorEmail" header="Actor" sortable />

      <Column field="action" header="Action" sortable>
        <template #body="{ data }">
          <Tag :value="data.action" :severity="getActionSeverity(data.action)" />
        </template>
      </Column>

      <Column field="resourceType" header="Resource Type" sortable />

      <Column field="resourceId" header="Resource ID">
        <template #body="{ data }">
          <code class="text-xs bg-slate-100 px-1.5 py-0.5 rounded">{{ data.resourceId }}</code>
        </template>
      </Column>

      <Column field="result" header="Result" sortable>
        <template #body="{ data }">
          <Tag
            :value="data.result"
            :severity="data.result === 'SUCCESS' ? 'success' : 'danger'"
          />
        </template>
      </Column>

      <Column field="ipAddress" header="IP Address" />
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
  if (action.includes('UPDATE') || action.includes('ENABLE')) return 'info'
  return 'secondary'
}
</script>
