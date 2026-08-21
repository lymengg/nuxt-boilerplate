<template>
  <NuxtLayout name="dashboard">
    <div class="page-container">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="page-title">User Management</h1>
          <p class="page-subtitle">Manage system users and their roles</p>
        </div>
        <Button label="Add User" icon="pi pi-plus" @click="showCreateDialog = true" />
      </div>

      <div class="filter-bar">
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText v-model="filters.search" placeholder="Search users..." @keyup.enter="handleSearch" />
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
          :value="users"
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
              <p class="text-surface-500">No users found</p>
            </div>
          </template>

          <Column field="email" header="User" sortable>
            <template #body="{ data }">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                  <span class="text-primary-700 font-medium text-sm">
                    {{ data.firstName[0] }}{{ data.lastName[0] }}
                  </span>
                </div>
                <div>
                  <p class="font-medium text-surface-900">{{ data.firstName }} {{ data.lastName }}</p>
                  <p class="text-xs text-surface-500">{{ data.email }}</p>
                </div>
              </div>
            </template>
          </Column>

          <Column field="roles" header="Roles">
            <template #body="{ data }">
              <div class="flex flex-wrap gap-1">
                <Tag
                  v-for="role in data.roles"
                  :key="role.id"
                  :value="role.name"
                  severity="info"
                  class="text-xs"
                />
              </div>
            </template>
          </Column>

          <Column field="departmentName" header="Department">
            <template #body="{ data }">
              <span class="text-sm text-surface-600">{{ data.departmentName || '—' }}</span>
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

          <Column header="Actions" style="width: 150px">
            <template #body="{ data }">
              <div class="flex items-center gap-1">
                <Button
                  icon="pi pi-pencil"
                  severity="secondary"
                  text
                  rounded
                  size="small"
                  @click="editUser(data)"
                  aria-label="Edit user"
                />
                <Button
                  v-if="can('USER_UPDATE')"
                  :icon="data.enabled ? 'pi pi-ban' : 'pi pi-check'"
                  :severity="data.enabled ? 'warn' : 'success'"
                  text
                  rounded
                  size="small"
                  @click="toggleUserStatus(data)"
                  :aria-label="data.enabled ? 'Disable user' : 'Enable user'"
                />
                <Button
                  v-if="can('ROLE_ASSIGN')"
                  icon="pi pi-shield"
                  severity="info"
                  text
                  rounded
                  size="small"
                  @click="assignRoles(data)"
                  aria-label="Assign roles"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>

      <Dialog
        v-model:visible="showCreateDialog"
        header="Add User"
        modal
        :style="{ width: '500px' }"
      >
        <UserForm
          @submit="handleCreate"
          @cancel="showCreateDialog = false"
        />
      </Dialog>

      <Dialog
        v-model:visible="showEditDialog"
        header="Edit User"
        modal
        :style="{ width: '500px' }"
      >
        <UserForm
          v-if="selectedUser"
          :user="selectedUser"
          @submit="handleUpdate"
          @cancel="showEditDialog = false"
        />
      </Dialog>

      <Dialog
        v-model:visible="showRoleDialog"
        header="Assign Roles"
        modal
        :style="{ width: '400px' }"
      >
        <div class="space-y-4">
          <div class="form-field">
            <label class="form-label">Select Roles</label>
            <MultiSelect
              v-model="selectedRoleIds"
              :options="allRoles"
              optionLabel="name"
              optionValue="id"
              placeholder="Select roles"
              class="w-full"
            />
          </div>
        </div>
        <template #footer>
          <Button label="Cancel" severity="secondary" text @click="showRoleDialog = false" />
          <Button label="Save" @click="confirmAssignRoles" :loading="isSubmitting" />
        </template>
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
import MultiSelect from 'primevue/multiselect'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import type { User } from '~/types'
import { userService } from '~/services/user.service'
import { roleService } from '~/services/role.service'

definePageMeta({
  layout: false,
  middleware: ['auth', 'permission'],
  permission: 'USER_READ',
})

const { users, isLoading, pagination, fetchUsers } = useUsers()
const { can } = useAuthorization()
const toast = useToast()
const confirm = useConfirm()

const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showRoleDialog = ref(false)
const selectedUser = ref<User | null>(null)
const selectedRoleIds = ref<string[]>([])
const allRoles = ref<Array<{ id: string; name: string }>>([])
const isSubmitting = ref(false)

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
  fetchUsers()
}

function handleSearch() {
  fetchUsers({
    search: filters.search || undefined,
    enabled: filters.enabled ?? undefined,
  })
}

function handleStatusChange() {
  fetchUsers({
    search: filters.search || undefined,
    enabled: filters.enabled ?? undefined,
  })
}

function onPage(event: { page: number }) {
  pagination.setPage(event.page)
  fetchUsers({
    search: filters.search || undefined,
    enabled: filters.enabled ?? undefined,
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onSort(event: any) {
  const field = typeof event.sortField === 'string' ? event.sortField : undefined
  if (field) {
    pagination.setSort(field, event.sortOrder === 1 ? 'asc' : 'desc')
    fetchUsers({
      search: filters.search || undefined,
      enabled: filters.enabled ?? undefined,
    })
  }
}

function editUser(user: User) {
  selectedUser.value = user
  showEditDialog.value = true
}

function assignRoles(user: User) {
  selectedUser.value = user
  selectedRoleIds.value = user.roles.map((r) => r.id)
  showRoleDialog.value = true
}

function toggleUserStatus(user: User) {
  const action = user.enabled ? 'disable' : 'enable'
  confirm.require({
    message: `Are you sure you want to ${action} this user?`,
    header: `${action === 'enable' ? 'Enable' : 'Disable'} User`,
    icon: 'pi pi-exclamation-triangle',
    acceptClass: action === 'disable' ? 'p-button-danger' : undefined,
    accept: async () => {
      try {
        if (user.enabled) {
          await userService.disable(user.id)
        } else {
          await userService.enable(user.id)
        }
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: `User ${action}d successfully`,
          life: 3000,
        })
        fetchUsers({
          search: filters.search || undefined,
          enabled: filters.enabled ?? undefined,
        })
      } catch {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to ${action} user`,
          life: 3000,
        })
      }
    },
  })
}

async function confirmAssignRoles() {
  if (!selectedUser.value) return

  isSubmitting.value = true
  try {
    await userService.assignRoles(selectedUser.value.id, selectedRoleIds.value)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Roles updated successfully',
      life: 3000,
    })
    showRoleDialog.value = false
    fetchUsers({
      search: filters.search || undefined,
      enabled: filters.enabled ?? undefined,
    })
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update roles',
      life: 3000,
    })
  } finally {
    isSubmitting.value = false
  }
}

async function handleCreate(data: unknown) {
  try {
    await userService.create(data as Parameters<typeof userService.create>[0])
    toast.add({ severity: 'success', summary: 'Success', detail: 'User created', life: 3000 })
    showCreateDialog.value = false
    fetchUsers({
      search: filters.search || undefined,
      enabled: filters.enabled ?? undefined,
    })
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create user', life: 3000 })
  }
}

async function handleUpdate(data: unknown) {
  if (!selectedUser.value) return
  try {
    await userService.update(selectedUser.value.id, data as Parameters<typeof userService.update>[1])
    toast.add({ severity: 'success', summary: 'Success', detail: 'User updated', life: 3000 })
    showEditDialog.value = false
    fetchUsers({
      search: filters.search || undefined,
      enabled: filters.enabled ?? undefined,
    })
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update user', life: 3000 })
  }
}

onMounted(async () => {
  fetchUsers()
  try {
    const response = await roleService.getAll()
    if (response.success && response.data) {
      allRoles.value = response.data
    }
  } catch {
    // Roles loading failed
  }
})
</script>
