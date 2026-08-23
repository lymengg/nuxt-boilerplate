<template>
  <Dialog
    v-model:visible="visible"
    :header="isEditing ? 'Edit Department' : 'Create Department'"
    :modal="true"
    :closable="!isSubmitting"
    :style="{ width: '500px' }"
  >
    <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
      <Message v-if="generalError" severity="error" :closable="false">
        {{ generalError }}
      </Message>
      <Field v-slot="{ field, errorMessage }" as="div" name="name">
        <label for="name" class="block text-sm font-medium text-slate-700 mb-1">Name</label>
        <InputText
          id="name"
          v-bind="field"
          class="w-full"
          :invalid="!!errorMessage"
          required
        />
        <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
      </Field>

      <Field v-slot="{ field, errorMessage }" as="div" name="tenantId">
        <label for="tenant" class="block text-sm font-medium text-slate-700 mb-1">Tenant</label>
        <Select
          id="tenant"
          :model-value="field.value"
          :options="tenants"
          option-label="name"
          option-value="id"
          placeholder="Select tenant"
          class="w-full"
          :invalid="!!errorMessage"
          :disabled="isEditing"
          required
          @update:model-value="onTenantChange"
          @blur="field.onBlur"
        />
        <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
      </Field>

      <Field v-slot="{ field, errorMessage }" as="div" name="managerIds">
        <label for="managers" class="block text-sm font-medium text-slate-700 mb-1">Managers</label>
        <MultiSelect
          id="managers"
          :model-value="field.value"
          :options="managers"
          option-label="username"
          option-value="id"
          placeholder="Select managers"
          class="w-full"
          :invalid="!!errorMessage"
          :show-toggle-all="false"
          :max-selected-labels="3"
          @update:model-value="field.onChange"
          @blur="field.onBlur"
        />
        <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
      </Field>
    </form>

    <template #footer>
      <Button
        label="Cancel"
        severity="secondary"
        text
        :disabled="isSubmitting"
        @click="visible = false"
      />
      <Button
        :label="isEditing ? 'Update' : 'Create'"
        :loading="isSubmitting"
        @click="onSubmit"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import type { Department } from '~/types/department'
import { departmentSchema } from '~/schemas/department'
import { Field, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'

const props = defineProps<{
  department?: Department
}>()

const emit = defineEmits<{
  saved: []
}>()

const visible = defineModel<boolean>('visible', { default: false })
const { getErrorMessage } = useApiError()

const { handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(departmentSchema),
})

const { createDepartment, updateDepartment } = useDepartments()
const { allTenants, fetchAllTenants } = useTenants()
const { users, fetchUsers } = useUsers()

const generalError = ref<string | null>(null)

const isEditing = computed(() => !!props.department)

const tenants = computed(() => allTenants.value)
const selectedTenantId = ref<number | null>(null)

// Manager picker: users of the selected tenant (backend scopes user lists).
const managers = computed(() => {
  if (selectedTenantId.value === null) return []
  return users.value.filter(u => u.enabled)
})

watch(visible, (val) => {
  if (val) {
    generalError.value = null
    fetchAllTenants()
    if (props.department) {
      selectedTenantId.value = props.department.tenantId
      fetchUsers()
      resetForm({
        values: {
          name: props.department.name,
          tenantId: props.department.tenantId,
          managerIds: props.department.managerIds,
        },
      })
    }
    else {
      selectedTenantId.value = null
      resetForm({
        values: {
          name: '',
          tenantId: undefined,
          managerIds: [],
        },
      })
    }
  }
})

function onTenantChange(value: number | null) {
  selectedTenantId.value = value ?? null
  fetchUsers()
  resetForm({
    values: {
      ...(isEditing.value ? {} : { tenantId: value ?? undefined }),
      managerIds: [],
    },
  })
}

const onSubmit = handleSubmit(async (values) => {
  try {
    if (isEditing.value && props.department) {
      await updateDepartment(props.department.id, {
        name: values.name,
        managerIds: values.managerIds,
      })
    }
    else {
      await createDepartment({
        name: values.name,
        tenantId: values.tenantId!,
        managerIds: values.managerIds,
      })
    }
    visible.value = false
    emit('saved')
  }
  catch (e) {
    generalError.value = getErrorMessage(e)
  }
})
</script>
