<template>
  <NuxtLayout name="dashboard">
    <div class="page-container">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="page-title">Role Management</h1>
          <p class="page-subtitle">Manage roles and permissions</p>
        </div>
        <Button label="Add Role" icon="pi pi-plus" @click="showCreateDialog = true" />
      </div>

      <div class="table-container">
        <DataTable
          :value="roles"
          :loading="isLoading"
          stripedRows
          responsiveLayout="scroll"
        >
          <template #empty>
            <div class="text-center py-8">
              <p class="text-surface-500">No roles found</p>
            </div>
          </template>

          <Column field="name" header="Role" sortable>
            <template #body="{ data }">
              <div>
                <p class="font-medium text-surface-900">{{ data.name }}</p>
                <p class="text-xs text-surface-500 mt-0.5">{{ data.description }}</p>
              </div>
            </template>
          </Column>

          <Column field="permissions" header="Permissions">
            <template #body="{ data }">
              <div class="flex flex-wrap gap-1">
                <Tag
                  v-for="perm in data.permissions.slice(0, 3)"
                  :key="perm.id"
                  :value="perm.name"
                  severity="info"
                  class="text-xs"
                />
                <Tag
                  v-if="data.permissions.length > 3"
                  :value="`+${data.permissions.length - 3} more`"
                  severity="secondary"
                  class="text-xs"
                />
              </div>
            </template>
          </Column>

          <Column field="userCount" header="Users" sortable>
            <template #body="{ data }">
              <span class="text-sm text-surface-600">{{ data.userCount }}</span>
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
                  @click="editRole(data)"
                  aria-label="Edit role"
                />
                <Button
                  v-if="can('ROLE_PERMISSIONS')"
                  icon="pi pi-key"
                  severity="info"
                  text
                  rounded
                  size="small"
                  @click="managePermissions(data)"
                  aria-label="Manage permissions"
                />
                <Button
                  v-if="can('ROLE_DELETE')"
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  rounded
                  size="small"
                  @click="deleteRole(data)"
                  aria-label="Delete role"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>

      <Dialog
        v-model:visible="showCreateDialog"
        header="Add Role"
        modal
        :style="{ width: '400px' }"
      >
        <RoleForm
          @submit="handleCreate"
          @cancel="showCreateDialog = false"
        />
      </Dialog>

      <Dialog
        v-model:visible="showEditDialog"
        header="Edit Role"
        modal
        :style="{ width: '400px' }"
      >
        <RoleForm
          v-if="selectedRole"
          :role="selectedRole"
          @submit="handleUpdate"
          @cancel="showEditDialog = false"
        />
      </Dialog>

      <Dialog
        v-model:visible="showPermissionDialog"
        header="Manage Permissions"
        modal
        :style="{ width: '600px' }"
      >
        <div v-if="selectedRole" class="space-y-4">
          <p class="text-sm text-surface-600">
            Managing permissions for <strong>{{ selectedRole.name }}</strong>
          </p>

          <div v-for="(perms, category) in groupedPermissions" :key="category" class="space-y-2">
            <h4 class="text-sm font-semibold text-surface-700">{{ category }}</h4>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="perm in perms"
                :key="perm.id"
                class="flex items-center gap-2"
              >
                <Checkbox
                  :inputId="perm.id"
                  :modelValue="selectedPermissionIds.includes(perm.id)"
                  @update:modelValue="togglePermission(perm.id)"
                />
                <label :for="perm.id" class="text-sm text-surface-600">{{ perm.name }}</label>
              </div>
            </div>
          </div>
        </div>
        <template #footer>
          <Button label="Cancel" severity="secondary" text @click="showPermissionDialog = false" />
          <Button label="Save" @click="savePermissions" :loading="isSubmitting" />
        </template>
      </Dialog>

      <ConfirmDialog />
      <Toast />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import type { Role, Permission, PermissionCategory } from '~/types'
import { PERMISSION_CATEGORIES } from '~/types'
import { roleService } from '~/services/role.service'
import { apiFetch } from '~/utils/api'

definePageMeta({
  layout: false,
  middleware: ['auth', 'permission'],
  permission: 'ROLE_READ',
})

const { can } = useAuthorization()
const toast = useToast()
const confirm = useConfirm()

const roles = ref<Role[]>([])
const allPermissions = ref<Permission[]>([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showPermissionDialog = ref(false)
const selectedRole = ref<Role | null>(null)
const selectedPermissionIds = ref<string[]>([])

const groupedPermissions = computed(() => {
  const groups: Partial<Record<PermissionCategory, Permission[]>> = {}
  for (const perm of allPermissions.value) {
    if (!groups[perm.category]) {
      groups[perm.category] = []
    }
    groups[perm.category]!.push(perm)
  }
  return groups
})

function togglePermission(id: string) {
  const idx = selectedPermissionIds.value.indexOf(id)
  if (idx >= 0) {
    selectedPermissionIds.value.splice(idx, 1)
  } else {
    selectedPermissionIds.value.push(id)
  }
}

async function fetchRoles() {
  isLoading.value = true
  try {
    const response = await roleService.list()
    if (response.success && response.data) {
      roles.value = response.data.content
    }
  } catch {
    // Error handled silently
  } finally {
    isLoading.value = false
  }
}

function editRole(role: Role) {
  selectedRole.value = role
  showEditDialog.value = true
}

function managePermissions(role: Role) {
  selectedRole.value = role
  selectedPermissionIds.value = role.permissions.map((p) => p.id)
  showPermissionDialog.value = true
}

function deleteRole(role: Role) {
  confirm.require({
    message: `Are you sure you want to delete the role "${role.name}"?`,
    header: 'Delete Role',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await roleService.delete(role.id)
        toast.add({ severity: 'success', summary: 'Success', detail: 'Role deleted', life: 3000 })
        fetchRoles()
      } catch {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete role', life: 3000 })
      }
    },
  })
}

async function savePermissions() {
  if (!selectedRole.value) return

  isSubmitting.value = true
  try {
    await roleService.assignPermissions(selectedRole.value.id, {
      permissionIds: selectedPermissionIds.value,
    })
    toast.add({ severity: 'success', summary: 'Success', detail: 'Permissions updated', life: 3000 })
    showPermissionDialog.value = false
    fetchRoles()
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update permissions', life: 3000 })
  } finally {
    isSubmitting.value = false
  }
}

async function handleCreate(data: unknown) {
  try {
    await roleService.create(data as Parameters<typeof roleService.create>[0])
    toast.add({ severity: 'success', summary: 'Success', detail: 'Role created', life: 3000 })
    showCreateDialog.value = false
    fetchRoles()
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create role', life: 3000 })
  }
}

async function handleUpdate(data: unknown) {
  if (!selectedRole.value) return
  try {
    await roleService.update(selectedRole.value.id, data as Parameters<typeof roleService.update>[1])
    toast.add({ severity: 'success', summary: 'Success', detail: 'Role updated', life: 3000 })
    showEditDialog.value = false
    fetchRoles()
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update role', life: 3000 })
  }
}

onMounted(async () => {
  fetchRoles()
  try {
    const response = await apiFetch<Permission[]>('/api/permissions')
    if (response.success && response.data) {
      allPermissions.value = response.data
    }
  } catch {
    // Permissions loading failed
  }
})
</script>
