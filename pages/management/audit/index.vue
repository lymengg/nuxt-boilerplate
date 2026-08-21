<template>
  <NuxtLayout name="dashboard">
    <div class="page-container">
      <div class="mb-6">
        <h1 class="page-title">Audit Logs</h1>
        <p class="page-subtitle">Track system activities and security events</p>
      </div>

      <div class="filter-bar">
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText v-model="filters.action" placeholder="Filter by action..." @keyup.enter="handleSearch" />
        </IconField>
        <Select
          v-model="filters.resourceType"
          :options="resourceTypeOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="All Resources"
          class="w-48"
          showClear
          @change="handleResourceChange"
        />
        <Select
          v-model="filters.result"
          :options="resultOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="All Results"
          class="w-48"
          showClear
          @change="handleResultChange"
        />
        <Button label="Reset" severity="secondary" text @click="resetFilters" />
      </div>

      <div class="table-container">
        <DataTable
          :value="auditLogs"
          :loading="isLoading"
          lazy
          paginator
          :first="pagination.page.value * pagination.size.value"
          :rows="pagination.size.value"
          :totalRecords="pagination.totalElements.value"
          @page="onPage"
          @sort="onSort"
          sortMode="single"
          :sortField="pagination.sort.value"
          :sortOrder="pagination.direction.value === 'asc' ? 1 : -1"
          stripedRows
          responsiveLayout="scroll"
        >
          <template #empty>
            <div class="text-center py-8">
              <p class="text-surface-500">No audit logs found</p>
            </div>
          </template>

          <Column field="createdAt" header="Timestamp" sortable>
            <template #body="{ data }">
              <span class="text-sm text-surface-600">{{ formatTimestamp(data.createdAt) }}</span>
            </template>
          </Column>

          <Column field="actor" header="Actor">
            <template #body="{ data }">
              <div>
                <p class="text-sm font-medium text-surface-900">{{ data.actor.firstName }} {{ data.actor.lastName }}</p>
                <p class="text-xs text-surface-500">{{ data.actor.email }}</p>
              </div>
            </template>
          </Column>

          <Column field="action" header="Action" sortable>
            <template #body="{ data }">
              <span class="text-sm font-medium text-surface-700">{{ formatAction(data.action) }}</span>
            </template>
          </Column>

          <Column field="resourceType" header="Resource">
            <template #body="{ data }">
              <Tag :value="data.resourceType" severity="info" class="text-xs" />
            </template>
          </Column>

          <Column field="resourceId" header="Resource ID">
            <template #body="{ data }">
              <span class="text-xs text-surface-500 font-mono">{{ data.resourceId }}</span>
            </template>
          </Column>

          <Column field="result" header="Result" sortable>
            <template #body="{ data }">
              <Tag
                :value="data.result"
                :severity="data.result === 'SUCCESS' ? 'success' : 'danger'"
                class="text-xs"
              />
            </template>
          </Column>

          <Column field="ipAddress" header="IP Address">
            <template #body="{ data }">
              <span class="text-xs text-surface-500 font-mono">{{ data.ipAddress }}</span>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import { AUDIT_RESOURCE_TYPES } from '~/types'

definePageMeta({
  layout: false,
  middleware: ['auth', 'permission'],
  permission: 'AUDIT_LOG_READ',
})

const { auditLogs, isLoading, pagination, fetchAuditLogs } = useAuditLogs()

const filters = reactive({
  action: '',
  resourceType: null as string | null,
  result: null as 'SUCCESS' | 'FAILURE' | null,
})

const resourceTypeOptions = AUDIT_RESOURCE_TYPES.map((rt) => ({
  label: rt,
  value: rt,
}))

const resultOptions = [
  { label: 'Success', value: 'SUCCESS' },
  { label: 'Failure', value: 'FAILURE' },
]

function resetFilters() {
  filters.action = ''
  filters.resourceType = null
  filters.result = null
  fetchLogs()
}

function formatTimestamp(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatAction(action: string) {
  return action
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function handleSearch() {
  fetchLogs()
}

function handleResourceChange() {
  fetchLogs()
}

function handleResultChange() {
  fetchLogs()
}

function fetchLogs() {
  fetchAuditLogs({
    action: filters.action || undefined,
    resourceType: filters.resourceType || undefined,
    result: filters.result || undefined,
  })
}

function onPage(event: { page: number }) {
  pagination.setPage(event.page)
  fetchLogs()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onSort(event: any) {
  const field = typeof event.sortField === 'string' ? event.sortField : undefined
  if (field) {
    pagination.setSort(field, event.sortOrder === 1 ? 'asc' : 'desc')
    fetchLogs()
  }
}

onMounted(() => {
  fetchLogs()
})
</script>
