<template>
  <Dialog
    v-model:visible="visible"
    header="Edit User"
    :modal="true"
    :closable="!isSubmitting"
    :style="{ width: '500px' }"
  >
    <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
      <Message v-if="generalError" severity="error" :closable="false">
        {{ generalError }}
      </Message>

      <Field v-slot="{ field, errorMessage }" as="div" name="firstName">
        <label for="firstName" class="block text-sm font-medium text-slate-700 mb-1">First Name</label>
        <InputText
          id="firstName"
          v-bind="field"
          class="w-full"
          :invalid="!!errorMessage"
        />
        <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
      </Field>

      <Field v-slot="{ field, errorMessage }" as="div" name="lastName">
        <label for="lastName" class="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
        <InputText
          id="lastName"
          v-bind="field"
          class="w-full"
          :invalid="!!errorMessage"
        />
        <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
      </Field>

      <Field v-if="showDepartment" v-slot="{ field, errorMessage }" as="div" name="departmentId">
        <label for="department" class="block text-sm font-medium text-slate-700 mb-1">Department</label>
        <Select
          id="department"
          :model-value="field.value"
          :options="allDepartments"
          option-label="name"
          option-value="id"
          placeholder="Select department"
          class="w-full"
          :invalid="!!errorMessage"
          show-clear
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
        label="Update"
        :loading="isSubmitting"
        @click="onSubmit"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import type { User, UpdateUserRequest } from '~/types/user'
import { updateUserSchema } from '~/schemas/user'
import { Field, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'

const props = defineProps<{
  user?: User
}>()

const emit = defineEmits<{
  saved: []
}>()

const visible = defineModel<boolean>('visible', { default: false })
const { getErrorMessage } = useApiError()

const { updateUser } = useUsers()
const { allDepartments, fetchAllDepartments } = useDepartments()

const generalError = ref<string | null>(null)

const isPlatformAdmin = computed(() => props.user?.roles.includes('PLATFORM_ADMIN') ?? false)
const showDepartment = computed(() => !isPlatformAdmin.value)

const { handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(updateUserSchema),
})

watch(visible, (val) => {
  if (val && props.user) {
    generalError.value = null
    fetchAllDepartments()
    resetForm({
      values: {
        firstName: props.user.firstName || '',
        lastName: props.user.lastName || '',
        departmentId: props.user.departmentId ?? null,
      },
    })
  }
})

function onSubmit() {
  generalError.value = null
  handleSubmit(async (formValues) => {
    try {
      const payload: UpdateUserRequest = {
        firstName: formValues.firstName || undefined,
        lastName: formValues.lastName || undefined,
      }

      if (!isPlatformAdmin.value) {
        payload.departmentId = formValues.departmentId ?? null
      }

      await updateUser(props.user!.id, payload)
      visible.value = false
      emit('saved')
    }
    catch (e) {
      generalError.value = getErrorMessage(e)
    }
  })()
}
</script>
