<template>
  <Dialog
    v-model:visible="visible"
    :header="isEditing ? 'Edit Role' : 'Create Role'"
    :modal="true"
    :closable="!isSubmitting"
    :style="{ width: '500px' }"
  >
    <form @submit.prevent="onSubmit" class="flex flex-col gap-3">
      <Message v-if="generalError" severity="error" :closable="false">
        {{ generalError }}
      </Message>
      <Field as="div" name="name" v-slot="{ field, errorMessage }">
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

      <Field as="div" name="description" v-slot="{ field, errorMessage }">
        <label for="description" class="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <Textarea
          id="description"
          v-bind="field"
          class="w-full"
          rows="3"
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
import type { Role } from '~/types/role'
import { roleSchema, type RoleFormData } from '~/schemas/role'
import { Field, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'

const props = defineProps<{
  role?: Role
}>()

const emit = defineEmits<{
  saved: []
}>()

const visible = defineModel<boolean>('visible', { default: false })
const { getErrorMessage } = useApiError()

const { handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(roleSchema),
})

const { createRole, updateRole } = useRoles()

const generalError = ref<string | null>(null)

const isEditing = computed(() => !!props.role)

watch(visible, (val) => {
  if (val) {
    generalError.value = null
    if (props.role) {
      resetForm({
        values: {
          name: props.role.name,
          description: props.role.description,
        },
      })
    }
    else {
      resetForm({
        values: {
          name: '',
          description: '',
        },
      })
    }
  }
})

const onSubmit = handleSubmit(async (values) => {
  try {
    if (isEditing.value && props.role) {
      await updateRole(props.role.id, {
        name: values.name,
        description: values.description,
      })
    }
    else {
      await createRole({
        name: values.name,
        description: values.description,
        permissionIds: [],
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
