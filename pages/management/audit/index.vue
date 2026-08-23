<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold text-slate-900">Audit Logs</h1>
        <p class="text-slate-500">View system audit logs</p>
      </div>
    </div>

    <Card>
      <template #content>
        <AuditAuditTable
          :audit-logs="auditLogs"
          :loading="loading"
          :pagination="pagination"
          @page="handlePage"
          @size-change="handleSizeChange"
        />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  permission: 'AUDIT_LOG_READ',
})

const { auditLogs, loading, pagination, fetchAuditLogs } = useAuditLogs()

onMounted(() => {
  fetchAuditLogs()
})

function handlePage(page: number) {
  pagination.onPageChange(page)
  fetchAuditLogs()
}

function handleSizeChange(size: number) {
  pagination.onSizeChange(size)
  fetchAuditLogs()
}
</script>
