<template>
  <NuxtLayout name="dashboard">
    <div class="page-container">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="page-title">Department Management</h1>
          <p class="page-subtitle">Manage organizational departments</p>
        </div>
        <Button label="Add Department" icon="pi pi-plus" @click="showCreateDialog = true" />
      </div>

      <div class="filter-bar">
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText v-model="filters.search" placeholder="Search departments..." @keyup.enter="handleSearch" />
        </IconField>
        <Button label="Reset" severity="secondary" text @click="resetFilters" />
      </div>

      <div class="table-container">
        <DataTable
          :value="departments"
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
              <p class="text-surface-500">No departments found</p>
            </div>
          </template>

          <Column field="name" header="Department" sortable>
            <template #body="{ data }">
              <span class="font-medium text-surface-900">{{ data.name }}</span>
            </template>
          </Column>

          <Column field="managerName" header="Manager">
            <template #body="{ data }">
              <span class="text-sm text-surface-600">{{ data.managerName || '—' }}</span>
            </template>
          </Column>

          <Column field="userCount" header="Users" sortable>
            <template #body="{ data }">
              <span class="text-sm text-surface-600">{{ data.userCount }}</span>
            </template>
          </Column>

          <Column header="Actions" style="width: 100px">
            <template #body="{ data }">
              <div class="flex items-center gap-1">
                <Button
                  icon="pi pi-pencil"
                  severity="secondary"
                  text
                  rounded
                  size="small"
                  @click="editDepartment(data)"
                  aria-label="Edit department"
                />
                <Button
                  v-if="can('DEPARTMENT_DELETE')"
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  rounded
                  size="small"
                  @click="deleteDepartment(data)"
                  aria-label="Delete department"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>

      <Dialog
        v-model:visible="showCreateDialog"
        header="Add Department"
        modal
        :style="{ width: '400px' }"
      >
        <DepartmentForm
          @submit="handleCreate"
          @cancel="showCreateDialog = false"
        />
      </Dialog>

      <Dialog
        v-model:visible="showEditDialog"
        header="Edit Department"
        modal
        :style="{ width: '400px' }"
      >
        <DepartmentForm
          v-if="selectedDepartment"
          :department="selectedDepartment"
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
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import type { Department } from '~/types'
import { departmentService } from '~/services/department.service'

definePageMeta({
  layout: false,
  middleware: ['auth', 'permission'],
  permission: 'DEPARTMENT_READ',
})

const { departments, isLoading, pagination, fetchDepartments } = useDepartments()
const { can } = useAuthorization()
const toast = useToast()
const confirm = useConfirm()

const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const selectedDepartment = ref<Department | null>(null)

const filters = reactive({
  search: '',
})

function resetFilters() {
  filters.search = ''
  fetchDepartments()
}

function handleSearch() {
  fetchDepartments({
    search: filters.search || undefined,
  })
}

function onPage(event: { page: number }) {
  pagination.setPage(event.page)
  fetchDepartments({
    search: filters.search || undefined,
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onSort(event: any) {
  const field = typeof event.sortField === 'string' ? event.sortField : undefined
  if (field) {
    pagination.setSort(field, event.sortOrder === 1 ? 'asc' : 'desc')
    fetchDepartments({
      search: filters.search || undefined,
    })
  }
}

function editDepartment(department: Department) {
  selectedDepartment.value = department
  showEditDialog.value = true
}

function deleteDepartment(department: Department) {
  confirm.require({
    message: `Are you sure you want to delete "${department.name}"?`,
    header: 'Delete Department',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await departmentService.delete(department.id)
        toast.add({ severity: 'success', summary: 'Success', detail: 'Department deleted', life: 3000 })
        fetchDepartments({
          search: filters.search || undefined,
        })
      } catch {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete department', life: 3000 })
      }
    },
  })
}

async function handleCreate(data: unknown) {
  try {
    await departmentService.create(data as Parameters<typeof departmentService.create>[0])
    toast.add({ severity: 'success', summary: 'Success', detail: 'Department created', life: 3000 })
    showCreateDialog.value = false
    fetchDepartments({
      search: filters.search || undefined,
    })
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create department', life: 3000 })
  }
}

async function handleUpdate(data: unknown) {
  if (!selectedDepartment.value) return
  try {
    await departmentService.update(selectedDepartment.value.id, data as Parameters<typeof departmentService.update>[1])
    toast.add({ severity: 'success', summary: 'Success', detail: 'Department updated', life: 3000 })
    showEditDialog.value = false
    fetchDepartments({
      search: filters.search || undefined,
    })
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update department', life: 3000 })
  }
}

onMounted(() => {
  fetchDepartments()
})
</script>
