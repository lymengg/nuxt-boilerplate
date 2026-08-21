<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Roles</h1>
        <p class="text-slate-500">Manage roles and permissions</p>
      </div>
      <Button
        v-if="can('ROLE_CREATE')"
        label="New Role"
        icon="pi pi-plus"
        @click="showCreateDialog = true"
      />
    </div>

    <Card>
      <template #content>
        <RolesRoleTable
          :roles="roles"
          :loading="loading"
          :pagination="pagination"
          @edit="handleEdit"
          @permissions="handlePermissions"
          @delete="handleDelete"
        />
      </template>
    </Card>

    <RolesRoleForm
      v-model:visible="showCreateDialog"
      @saved="onSaved"
    />

    <RolesRoleForm
      v-model:visible="showEditDialog"
      :role="selectedRole"
      @saved="onSaved"
    />

    <RolesRolePermissionsDialog
      v-model:visible="showPermissionsDialog"
      :role="selectedRole"
      @saved="onSaved"
    />

    <ConfirmDialog />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import type { Role } from '~/types/role'

definePageMeta({
  middleware: 'auth',
  permission: 'ROLE_READ',
})

const { can } = useAuthorization()
const { roles, loading, pagination, fetchRoles, deleteRole } = useRoles()
const confirm = useConfirm()
const toast = useToast()

const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showPermissionsDialog = ref(false)
const selectedRole = ref<Role | undefined>(undefined)

onMounted(() => {
  fetchRoles()
})

function handleEdit(role: Role) {
  selectedRole.value = role
  showEditDialog.value = true
}

function handlePermissions(role: Role) {
  selectedRole.value = role
  showPermissionsDialog.value = true
}

function handleDelete(role: Role) {
  confirm.require({
    message: `Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`,
    header: 'Delete Role',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await deleteRole(role.id)
      toast.add({ severity: 'success', summary: 'Deleted', detail: 'Role deleted successfully', life: 3000 })
    },
  })
}

function onSaved() {
  showCreateDialog.value = false
  showEditDialog.value = false
  showPermissionsDialog.value = false
  selectedRole.value = undefined
  fetchRoles()
}
</script>
