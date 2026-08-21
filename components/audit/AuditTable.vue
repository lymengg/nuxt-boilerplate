<template>
  <div>
    <DataTable
      :value="auditLogs"
      :loading="loading"
      stripedRows
      responsiveLayout="scroll"
      :rows="pagination.state.size"
      :first="pagination.state.page * pagination.state.size"
      @page="onPage"
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
      class="mt-4"
    />
  </div>
</template>

<script setup lang="ts">
import type { AuditLog } from '~/types/audit'
import type { PaginationState } from '~/types/api'

defineProps<{
  auditLogs: AuditLog[]
  loading: boolean
  pagination: { state: PaginationState }
}>()

defineEmits<{
  page: [page: number]
}>()

function onPage(event: { page: number, rows: number }) {
  // Emit page change
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getActionSeverity(action: string): string {
  if (action.includes('DELETE') || action.includes('FAILED')) return 'danger'
  if (action.includes('CREATE') || action.includes('APPROVE')) return 'success'
  if (action.includes('UPDATE') || action.includes('ENABLE')) return 'info'
  return 'secondary'
}
</script>
