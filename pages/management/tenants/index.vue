<template>
  <NuxtLayout name="dashboard">
    <div class="page-container">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="page-title">Tenant Management</h1>
          <p class="page-subtitle">Manage system tenants</p>
        </div>
        <Button label="Add Tenant" icon="pi pi-plus" @click="showCreateDialog = true" />
      </div>

      <div class="filter-bar">
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText v-model="filters.search" placeholder="Search tenants..." @keyup.enter="handleSearch" />
        </IconField>
        <Select
          v-model="filters.enabled"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="All Statuses"
          class="w-48"
          showClear
          @change="handleStatusChange"
        />
        <Button label="Reset" severity="secondary" text @click="resetFilters" />
      </div>

      <div class="table-container">
        <DataTable
          :value="tenants"
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
              <p class="text-surface-500">No tenants found</p>
            </div>
          </template>

          <Column field="name" header="Tenant" sortable>
            <template #body="{ data }">
              <div>
                <p class="font-medium text-surface-900">{{ data.name }}</p>
                <p class="text-xs text-surface-500 mt-0.5">{{ data.domain }}</p>
              </div>
            </template>
          </Column>

          <Column field="userCount" header="Users" sortable>
            <template #body="{ data }">
              <span class="text-sm text-surface-600">{{ data.userCount }}</span>
            </template>
          </Column>

          <Column field="enabled" header="Status" sortable>
            <template #body="{ data }">
              <Tag
                :value="data.enabled ? 'Active' : 'Disabled'"
                :severity="data.enabled ? 'success' : 'danger'"
              />
            </template>
          </Column>

          <Column header="Actions" style="width: 120px">
            <template #body="{ data }">
              <div class="flex items-center gap-1">
                <Button
                  icon="pi pi-pencil"
                  severity="secondary"
                  text
                  rounded
                  size="small"
                  @click="editTenant(data)"
                  aria-label="Edit tenant"
                />
                <Button
                  v-if="can('TENANT_UPDATE')"
                  :icon="data.enabled ? 'pi pi-ban' : 'pi pi-check'"
                  :severity="data.enabled ? 'warn' : 'success'"
                  text
                  rounded
                  size="small"
                  @click="toggleTenantStatus(data)"
                  :aria-label="data.enabled ? 'Disable tenant' : 'Enable tenant'"
                />
                <Button
                  v-if="can('TENANT_DELETE')"
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  rounded
                  size="small"
                  @click="deleteTenant(data)"
                  aria-label="Delete tenant"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>

      <Dialog
        v-model:visible="showCreateDialog"
        header="Add Tenant"
        modal
        :style="{ width: '400px' }"
      >
        <TenantForm
          @submit="handleCreate"
          @cancel="showCreateDialog = false"
        />
      </Dialog>

      <Dialog
        v-model:visible="showEditDialog"
        header="Edit Tenant"
        modal
        :style="{ width: '400px' }"
      >
        <TenantForm
          v-if="selectedTenant"
          :tenant="selectedTenant"
          @submit="handleUpdate"
          @cancel="showEditDialog = false"
        />
      </Dialog>

      <ConfirmDialog />
      <Toast />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import type { Tenant } from '~/types'
import { tenantService } from '~/services/tenant.service'

definePageMeta({
  layout: false,
  middleware: ['auth', 'permission'],
  permission: 'TENANT_READ',
})

const { tenants, isLoading, pagination, fetchTenants } = useTenants()
const { can } = useAuthorization()
const toast = useToast()
const confirm = useConfirm()

const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const selectedTenant = ref<Tenant | null>(null)

const filters = reactive({
  search: '',
  enabled: null as boolean | null,
})

const statusOptions = [
  { label: 'Active', value: true },
  { label: 'Disabled', value: false },
]

function resetFilters() {
  filters.search = ''
  filters.enabled = null
  fetchTenants()
}

function handleSearch() {
  fetchTenants({
    search: filters.search || undefined,
    enabled: filters.enabled ?? undefined,
  })
}

function handleStatusChange() {
  fetchTenants({
    search: filters.search || undefined,
    enabled: filters.enabled ?? undefined,
  })
}

function onPage(event: { page: number }) {
  pagination.setPage(event.page)
  fetchTenants({
    search: filters.search || undefined,
    enabled: filters.enabled ?? undefined,
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onSort(event: any) {
  const field = typeof event.sortField === 'string' ? event.sortField : undefined
  if (field) {
    pagination.setSort(field, event.sortOrder === 1 ? 'asc' : 'desc')
    fetchTenants({
      search: filters.search || undefined,
      enabled: filters.enabled ?? undefined,
    })
  }
}

function editTenant(tenant: Tenant) {
  selectedTenant.value = tenant
  showEditDialog.value = true
}

function toggleTenantStatus(tenant: Tenant) {
  const action = tenant.enabled ? 'disable' : 'enable'
  confirm.require({
    message: `Are you sure you want to ${action} this tenant?`,
    header: `${action === 'enable' ? 'Enable' : 'Disable'} Tenant`,
    icon: 'pi pi-exclamation-triangle',
    acceptClass: action === 'disable' ? 'p-button-danger' : undefined,
    accept: async () => {
      try {
        await tenantService.update(tenant.id, { enabled: !tenant.enabled })
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: `Tenant ${action}d successfully`,
          life: 3000,
        })
        fetchTenants({
          search: filters.search || undefined,
          enabled: filters.enabled ?? undefined,
        })
      } catch {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to ${action} tenant`,
          life: 3000,
        })
      }
    },
  })
}

function deleteTenant(tenant: Tenant) {
  confirm.require({
    message: `Are you sure you want to delete "${tenant.name}"? This action cannot be undone.`,
    header: 'Delete Tenant',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await tenantService.delete(tenant.id)
        toast.add({ severity: 'success', summary: 'Success', detail: 'Tenant deleted', life: 3000 })
        fetchTenants({
          search: filters.search || undefined,
          enabled: filters.enabled ?? undefined,
        })
      } catch {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete tenant', life: 3000 })
      }
    },
  })
}

async function handleCreate(data: unknown) {
  try {
    await tenantService.create(data as Parameters<typeof tenantService.create>[0])
    toast.add({ severity: 'success', summary: 'Success', detail: 'Tenant created', life: 3000 })
    showCreateDialog.value = false
    fetchTenants({
      search: filters.search || undefined,
      enabled: filters.enabled ?? undefined,
    })
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create tenant', life: 3000 })
  }
}

async function handleUpdate(data: unknown) {
  if (!selectedTenant.value) return
  try {
    await tenantService.update(selectedTenant.value.id, data as Parameters<typeof tenantService.update>[1])
    toast.add({ severity: 'success', summary: 'Success', detail: 'Tenant updated', life: 3000 })
    showEditDialog.value = false
    fetchTenants({
      search: filters.search || undefined,
      enabled: filters.enabled ?? undefined,
    })
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update tenant', life: 3000 })
  }
}

onMounted(() => {
  fetchTenants()
})
</script>
