<template>
  <Dialog
    v-model:visible="visible"
    :header="isEditing ? 'Edit Department' : 'Create Department'"
    :modal="true"
    :closable="!loading"
    :style="{ width: '500px' }"
  >
    <form @submit.prevent="onSubmit" class="flex flex-col gap-3">
      <Message v-if="generalError" severity="error" :closable="false">
        {{ generalError }}
      </Message>
      <Field name="name" v-slot="{ field, errorMessage }">
        <label for="name" class="block text-sm font-medium text-slate-700 mb-1">Name</label>
        <InputText
          id="name"
          v-bind="field"
          class="w-full"
          :class="{ 'p-invalid': errorMessage }"
          required
        />
        <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
      </Field>

      <Field name="description" v-slot="{ field, errorMessage }">
        <label for="description" class="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <Textarea
          id="description"
          v-bind="field"
          class="w-full"
          rows="3"
        />
        <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
      </Field>

      <Field name="tenantId" v-slot="{ field, errorMessage }">
        <label for="tenant" class="block text-sm font-medium text-slate-700 mb-1">Tenant</label>
        <Select
          id="tenant"
          :modelValue="field.value"
          @update:modelValue="field.onChange"
          @blur="field.onBlur"
          :options="tenants"
          optionLabel="name"
          optionValue="id"
          placeholder="Select tenant"
          class="w-full"
          :class="{ 'p-invalid': errorMessage }"
          :disabled="isEditing"
          required
        />
        <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
      </Field>
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
        @click="onSubmit"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import type { Department } from '~/types/department'
import { departmentSchema, type DepartmentFormData } from '~/schemas/department'
import { Field } from 'vee-validate'

const props = defineProps<{
  department?: Department
}>()

const emit = defineEmits<{
  saved: []
}>()

const visible = defineModel<boolean>('visible', { default: false })
const { getErrorMessage } = useApiError()

const { handleSubmit, resetForm } = useFormValidation(departmentSchema)

const { createDepartment, updateDepartment } = useDepartments()
const { allTenants, fetchAllTenants } = useTenants()

const loading = ref(false)
const generalError = ref<string | null>(null)

const isEditing = computed(() => !!props.department)

const tenants = computed(() => allTenants.value)

watch(visible, (val) => {
  if (val) {
    generalError.value = null
    fetchAllTenants()
    if (props.department) {
      resetForm({
        values: {
          name: props.department.name,
          description: props.department.description,
          tenantId: props.department.tenantId,
        },
      })
    }
    else {
      resetForm({
        values: {
          name: '',
          description: '',
          tenantId: '',
        },
      })
    }
  }
})

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  try {
    if (isEditing.value && props.department) {
      await updateDepartment(props.department.id, {
        name: values.name,
        description: values.description,
      })
    }
    else {
      await createDepartment({
        name: values.name,
        description: values.description,
        tenantId: values.tenantId,
      })
    }
    visible.value = false
    emit('saved')
  }
  catch (e) {
    generalError.value = getErrorMessage(e)
  }
  finally {
    loading.value = false
  }
})
</script>
