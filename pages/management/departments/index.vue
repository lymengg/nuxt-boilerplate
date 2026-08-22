<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold text-slate-900">Departments</h1>
        <p class="text-slate-500">Manage departments</p>
      </div>
      <Button
        v-if="can('DEPARTMENT_CREATE')"
        label="New Department"
        icon="pi pi-plus"
        @click="showCreateDialog = true"
      />
    </div>

    <Card>
      <template #content>
        <DepartmentsDepartmentTable
          :departments="departments"
          :loading="loading"
          :pagination="pagination"
          @edit="handleEdit"
          @delete="handleDelete"
          @page="handlePage"
          @size-change="handleSizeChange"
        />
      </template>
    </Card>

    <DepartmentsDepartmentForm
      v-model:visible="showCreateDialog"
      @saved="onSaved"
    />

    <DepartmentsDepartmentForm
      v-model:visible="showEditDialog"
      :department="selectedDepartment"
      @saved="onSaved"
    />

    <ConfirmDialog />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import type { Department } from '~/types/department'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  permission: 'DEPARTMENT_READ',
})

const { can } = useAuthorization()
const { departments, loading, pagination, fetchDepartments, deleteDepartment } = useDepartments()
const confirm = useConfirm()
const toast = useToast()

const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const selectedDepartment = ref<Department | undefined>(undefined)

onMounted(() => {
  fetchDepartments()
})

function handleEdit(department: Department) {
  selectedDepartment.value = department
  showEditDialog.value = true
}

function handleDelete(department: Department) {
  confirm.require({
    message: `Are you sure you want to delete the department "${department.name}"? This action cannot be undone.`,
    header: 'Delete Department',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await deleteDepartment(department.id)
      toast.add({ severity: 'success', summary: 'Deleted', detail: 'Department deleted successfully', life: 3000 })
    },
  })
}

function handlePage(page: number) {
  pagination.onPageChange(page)
  fetchDepartments()
}

function handleSizeChange(size: number) {
  pagination.onSizeChange(size)
  fetchDepartments()
}
function onSaved() {
  showCreateDialog.value = false
  showEditDialog.value = false
  selectedDepartment.value = undefined
  fetchDepartments()
}
</script>
