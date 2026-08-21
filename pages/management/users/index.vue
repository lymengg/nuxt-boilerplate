<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Users</h1>
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
        <div class="flex flex-wrap items-end gap-4 mb-6">
          <div class="flex-1 min-w-[200px]">
            <label for="search" class="block text-sm font-medium text-slate-700 mb-1">Search</label>
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText
                id="search"
                v-model="search"
                placeholder="Search users..."
                class="w-full"
                @keyup.enter="handleSearch"
              />
            </IconField>
          </div>
          <div class="w-48">
            <label for="status" class="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <Select
              id="status"
              v-model="statusFilter"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All statuses"
              class="w-full"
              showClear
              @change="handleSearch"
            />
          </div>
          <Button label="Search" icon="pi pi-search" @click="handleSearch" />
        </div>

        <UsersUserTable
          :users="users"
          :loading="loading"
          :pagination="pagination"
          @edit="handleEdit"
          @enable="handleEnable"
          @disable="handleDisable"
          @assign-role="handleAssignRole"
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
  middleware: 'auth',
  permission: 'USER_READ',
})

const { can } = useAuthorization()
const { users, loading, pagination, fetchUsers, enableUser, disableUser } = useUsers()
const confirm = useConfirm()
const toast = useToast()

const search = ref('')
const statusFilter = ref<boolean | null>(null)
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showRoleDialog = ref(false)
const selectedUser = ref<User | undefined>(undefined)

const statusOptions = [
  { label: 'Active', value: true },
  { label: 'Inactive', value: false },
]

onMounted(() => {
  fetchUsers()
})

function handleSearch() {
  pagination.reset()
  const params: Record<string, unknown> = {}
  if (search.value) params.search = search.value
  if (statusFilter.value !== null) params.enabled = statusFilter.value
  fetchUsers(params as Parameters<typeof fetchUsers>[0])
}

function handleEdit(user: User) {
  selectedUser.value = user
  showEditDialog.value = true
}

function handleEnable(user: User) {
  confirm.require({
    message: `Are you sure you want to enable ${user.firstName} ${user.lastName}?`,
    header: 'Enable User',
    icon: 'pi pi-check-circle',
    acceptClass: 'p-button-success',
    accept: async () => {
      await enableUser(user.id)
      toast.add({ severity: 'success', summary: 'Enabled', detail: 'User enabled successfully', life: 3000 })
    },
  })
}

function handleDisable(user: User) {
  confirm.require({
    message: `Are you sure you want to disable ${user.firstName} ${user.lastName}?`,
    header: 'Disable User',
    icon: 'pi pi-ban',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await disableUser(user.id)
      toast.add({ severity: 'warn', summary: 'Disabled', detail: 'User disabled', life: 3000 })
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
