<template>
  <Dialog
    v-model:visible="visible"
    :header="isEditing ? 'Edit Department' : 'Create Department'"
    :modal="true"
    :closable="!loading"
    :style="{ width: '500px' }"
  >
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <div>
        <label for="name" class="block text-sm font-medium text-slate-700 mb-1">Name</label>
        <InputText
          id="name"
          v-model="form.name"
          class="w-full"
          :class="{ 'p-invalid': errors.name }"
          required
        />
        <small v-if="errors.name" class="text-red-500">{{ errors.name }}</small>
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <Textarea
          id="description"
          v-model="form.description"
          class="w-full"
          rows="3"
        />
      </div>

      <div>
        <label for="tenant" class="block text-sm font-medium text-slate-700 mb-1">Tenant</label>
        <Select
          id="tenant"
          v-model="form.tenantId"
          :options="tenants"
          optionLabel="name"
          optionValue="id"
          placeholder="Select tenant"
          class="w-full"
          :class="{ 'p-invalid': errors.tenantId }"
          :disabled="isEditing"
          required
        />
        <small v-if="errors.tenantId" class="text-red-500">{{ errors.tenantId }}</small>
      </div>
    </form>

    <template #footer>
      <Button
        label="Cancel"
        severity="secondary"
        text
        :disabled="loading"
        @click="visible = false"
      />
      <Button
        :label="isEditing ? 'Update' : 'Create'"
        :loading="loading"
        @click="handleSubmit"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import type { Department } from '~/types/department'

const props = defineProps<{
  department?: Department
}>()

const emit = defineEmits<{
  saved: []
}>()

const visible = defineModel<boolean>('visible', { default: false })
const { getErrorMessage } = useApiError()

const { createDepartment, updateDepartment } = useDepartments()
const { allTenants, fetchAllTenants } = useTenants()

const loading = ref(false)
const errors = ref<Record<string, string>>({})

const isEditing = computed(() => !!props.department)

const tenants = computed(() => allTenants.value)

const form = reactive({
  name: '',
  description: '',
  tenantId: '',
})

watch(visible, (val) => {
  if (val) {
    fetchAllTenants()
    if (props.department) {
      form.name = props.department.name
      form.description = props.department.description
      form.tenantId = props.department.tenantId
    }
    else {
      form.name = ''
      form.description = ''
      form.tenantId = ''
    }
    errors.value = {}
  }
})

function validate(): boolean {
  errors.value = {}

  if (!form.name.trim()) {
    errors.value.name = 'Name is required'
  }
  if (!form.tenantId) {
    errors.value.tenantId = 'Tenant is required'
  }

  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validate()) return

  loading.value = true
  try {
    if (isEditing.value && props.department) {
      await updateDepartment(props.department.id, {
        name: form.name,
        description: form.description,
      })
    }
    else {
      await createDepartment({
        name: form.name,
        description: form.description,
        tenantId: form.tenantId,
      })
    }
    visible.value = false
    emit('saved')
  }
  catch (e) {
    const msg = getErrorMessage(e)
    errors.value = { general: msg }
  }
  finally {
    loading.value = false
  }
}
</script>
