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
        <div class="flex flex-wrap items-end gap-4 mb-6">
          <div class="flex-1 min-w-[200px]">
            <label for="action" class="block text-sm font-medium text-slate-700 mb-1">Action</label>
            <Select
              id="action"
              v-model="actionFilter"
              :options="actionOptions"
              placeholder="All actions"
              class="w-full"
              showClear
              @change="handleSearch"
            />
          </div>
          <div class="w-48">
            <label for="resourceType" class="block text-sm font-medium text-slate-700 mb-1">Resource Type</label>
            <Select
              id="resourceType"
              v-model="resourceTypeFilter"
              :options="resourceTypeOptions"
              placeholder="All types"
              class="w-full"
              showClear
              @change="handleSearch"
            />
          </div>
          <div class="w-48">
            <label for="result" class="block text-sm font-medium text-slate-700 mb-1">Result</label>
            <Select
              id="result"
              v-model="resultFilter"
              :options="resultOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All results"
              class="w-full"
              showClear
              @change="handleSearch"
            />
          </div>
          <Button label="Search" icon="pi pi-search" @click="handleSearch" />
        </div>

        <AuditAuditTable
          :auditLogs="auditLogs"
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
import { AUDIT_ACTIONS } from '~/types/audit'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  permission: 'AUDIT_LOG_READ',
})

const { auditLogs, loading, pagination, fetchAuditLogs } = useAuditLogs()

const actionFilter = ref<string | null>(null)
const resourceTypeFilter = ref<string | null>(null)
const resultFilter = ref<'SUCCESS' | 'FAILURE' | null>(null)

const actionOptions = [...AUDIT_ACTIONS]
const resourceTypeOptions = ['User', 'Role', 'Tenant', 'Department', 'Expense']
const resultOptions = [
  { label: 'Success', value: 'SUCCESS' },
  { label: 'Failure', value: 'FAILURE' },
]

onMounted(() => {
  fetchAuditLogs()
})

const currentParams = ref<Record<string, unknown>>({})

function handleSearch() {
  pagination.reset()
  const params: Record<string, unknown> = { ...currentParams.value }
  if (actionFilter.value) params.action = actionFilter.value
  else delete params.action
  if (resourceTypeFilter.value) params.resourceType = resourceTypeFilter.value
  else delete params.resourceType
  if (resultFilter.value) params.result = resultFilter.value
  else delete params.result
  currentParams.value = params
  fetchAuditLogs(params as Parameters<typeof fetchAuditLogs>[0])
}

function handlePage(page: number) {
  pagination.onPageChange(page)
  fetchAuditLogs(currentParams.value as Parameters<typeof fetchAuditLogs>[0])
}

function handleSizeChange(size: number) {
  pagination.onSizeChange(size)
  fetchAuditLogs(currentParams.value as Parameters<typeof fetchAuditLogs>[0])
}
</script>
