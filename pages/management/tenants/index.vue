<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold text-slate-900">Tenants</h1>
        <p class="text-slate-500">Manage tenants</p>
      </div>
      <Button
        v-if="can('TENANT_CREATE')"
        label="New Tenant"
        icon="pi pi-plus"
        @click="showCreateDialog = true"
      />
    </div>

    <Card>
      <template #content>
        <TenantsTenantTable
          :tenants="tenants"
          :loading="loading"
          :pagination="pagination"
          @edit="handleEdit"
          @delete="handleDelete"
          @page="handlePage"
          @size-change="handleSizeChange"
        />
      </template>
    </Card>

    <TenantsTenantForm
      v-model:visible="showCreateDialog"
      @saved="onSaved"
    />

    <TenantsTenantForm
      v-model:visible="showEditDialog"
      :tenant="selectedTenant"
      @saved="onSaved"
    />

    <ConfirmDialog />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import type { Tenant } from '~/types/tenant'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  permission: 'TENANT_READ',
})

const { can } = useAuthorization()
const { tenants, loading, pagination, fetchTenants, deleteTenant } = useTenants()
const confirm = useConfirm()
const toast = useToast()

const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const selectedTenant = ref<Tenant | undefined>(undefined)

onMounted(() => {
  fetchTenants()
})

function handleEdit(tenant: Tenant) {
  selectedTenant.value = tenant
  showEditDialog.value = true
}

function handleDelete(tenant: Tenant) {
  confirm.require({
    message: `Are you sure you want to delete the tenant "${tenant.name}"? This action cannot be undone.`,
    header: 'Delete Tenant',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await deleteTenant(tenant.id)
      toast.add({ severity: 'success', summary: 'Deleted', detail: 'Tenant deleted successfully', life: 3000 })
    },
  })
}

function handlePage(page: number) {
  pagination.onPageChange(page)
  fetchTenants()
}

function handleSizeChange(size: number) {
  pagination.onSizeChange(size)
  fetchTenants()
}
function onSaved() {
  showCreateDialog.value = false
  showEditDialog.value = false
  selectedTenant.value = undefined
  fetchTenants()
}
</script>
