<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold text-slate-900">Users</h1>
        <p class="text-slate-500">Manage user accounts</p>
      </div>
      <Button
        v-if="can('USER_CREATE')"
        label="New User"
        icon="pi pi-plus"
        @click="showCreateDialog = true"
      />
    </div>

    <Card>
      <template #content>
        <UsersUserTable
          :users="users"
          :loading="loading"
          :pagination="pagination"
          @edit="handleEdit"
          @toggle-enabled="handleToggleEnabled"
          @assign-role="handleAssignRole"
          @page="handlePage"
          @size-change="handleSizeChange"
        />
      </template>
    </Card>

    <UsersUserForm
      v-model:visible="showCreateDialog"
      @saved="onSaved"
    />

    <UsersUserForm
      v-model:visible="showEditDialog"
      :user="selectedUser"
      @saved="onSaved"
    />

    <UsersUserRoleDialog
      v-model:visible="showRoleDialog"
      :user="selectedUser"
      @saved="onSaved"
    />

    <ConfirmDialog />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types/user'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  permission: 'USER_READ',
})

const { can } = useAuthorization()
const { users, loading, pagination, fetchUsers, setEnabled } = useUsers()
const confirm = useConfirm()
const toast = useToast()

const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showRoleDialog = ref(false)
const selectedUser = ref<User | undefined>(undefined)

onMounted(() => {
  fetchUsers()
})

function handlePage(page: number) {
  pagination.onPageChange(page)
  fetchUsers()
}

function handleSizeChange(size: number) {
  pagination.onSizeChange(size)
  fetchUsers()
}

function handleEdit(user: User) {
  selectedUser.value = user
  showEditDialog.value = true
}

function handleToggleEnabled(user: User) {
  const nextState = !user.enabled
  confirm.require({
    message: `Are you sure you want to ${nextState ? 'enable' : 'disable'} ${user.firstName} ${user.lastName}?`,
    header: `${nextState ? 'Enable' : 'Disable'} User`,
    icon: nextState ? 'pi pi-check-circle' : 'pi pi-ban',
    acceptClass: nextState ? 'p-button-success' : 'p-button-danger',
    accept: async () => {
      await setEnabled(user.id, nextState)
      toast.add({
        severity: nextState ? 'success' : 'warn',
        summary: nextState ? 'Enabled' : 'Disabled',
        detail: `User ${nextState ? 'enabled' : 'disabled'} successfully`,
        life: 3000,
      })
    },
  })
}

function handleAssignRole(user: User) {
  selectedUser.value = user
  showRoleDialog.value = true
}

function onSaved() {
  showCreateDialog.value = false
  showEditDialog.value = false
  showRoleDialog.value = false
  selectedUser.value = undefined
  fetchUsers()
}
</script>
