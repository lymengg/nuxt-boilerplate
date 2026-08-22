<template>
  <Dialog
    v-model:visible="visible"
    :header="isEditing ? 'Edit User' : 'Create User'"
    :modal="true"
    :closable="!isSubmitting"
    :style="{ width: '500px' }"
  >
    <form @submit.prevent="onSubmit" class="flex flex-col gap-3">
      <Message v-if="generalError" severity="error" :closable="false">
        {{ generalError }}
      </Message>
      <div v-if="!isEditing">
        <Field as="div" name="email" v-slot="{ field, errorMessage }">
          <label for="email" class="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <InputText
            id="email"
            v-bind="field"
            type="email"
            class="w-full"
            :invalid="!!errorMessage"
            required
          />
          <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
        </Field>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <Field as="div" name="firstName" v-slot="{ field, errorMessage }">
          <label for="firstName" class="block text-sm font-medium text-slate-700 mb-1">First Name</label>
          <InputText
            id="firstName"
            v-bind="field"
            class="w-full"
            :invalid="!!errorMessage"
            required
          />
          <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
        </Field>

        <Field as="div" name="lastName" v-slot="{ field, errorMessage }">
          <label for="lastName" class="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
          <InputText
            id="lastName"
            v-bind="field"
            class="w-full"
            :invalid="!!errorMessage"
            required
          />
          <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
        </Field>
      </div>

      <div v-if="!isEditing">
        <Field as="div" name="password" v-slot="{ field, errorMessage }">
          <label for="password" class="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <Password
            id="password"
            v-bind="field"
            class="w-full"
            :invalid="!!errorMessage"
            toggleMask
            required
          />
          <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
        </Field>
      </div>

      <div v-if="!isEditing">
        <Field as="div" name="tenantId" v-slot="{ field, errorMessage }">
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
            :invalid="!!errorMessage"
            required
          />
          <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
        </Field>
      </div>

      <div>
        <Field as="div" name="departmentId" v-slot="{ field, errorMessage }">
          <label for="department" class="block text-sm font-medium text-slate-700 mb-1">Department</label>
          <Select
            id="department"
            :modelValue="field.value"
            @update:modelValue="field.onChange"
            @blur="field.onBlur"
            :options="departments"
            optionLabel="name"
            optionValue="id"
            placeholder="Select department"
            class="w-full"
            showClear
          />
          <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
        </Field>
      </div>

      <div v-if="!isEditing">
        <Field as="div" name="roleIds" v-slot="{ field, errorMessage }">
          <label class="block text-sm font-medium text-slate-700 mb-1">Roles</label>
          <MultiSelect
            :modelValue="field.value"
            @update:modelValue="field.onChange"
            @blur="field.onBlur"
            :options="roles"
            optionLabel="name"
            optionValue="id"
            placeholder="Select roles"
            class="w-full"
          />
          <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
        </Field>
      </div>
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
import type { User } from '~/types/user'
import { createUserSchema, updateUserSchema, type CreateUserFormData, type UpdateUserFormData } from '~/schemas/user'
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

const { createUser, updateUser } = useUsers()
const { allTenants, fetchAllTenants } = useTenants()
const { allRoles, fetchAllRoles } = useRoles()
const { allDepartments, fetchAllDepartments } = useDepartments()

const generalError = ref<string | null>(null)
const isEditing = computed(() => !!props.user)

// Reactive schema: the same dialog instance is reused for create and edit.
const { handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: computed(() =>
    toTypedSchema(isEditing.value ? updateUserSchema : createUserSchema),
  ),
})

const tenants = computed(() => allTenants.value)
const roles = computed(() => allRoles.value)
const departments = computed(() => allDepartments.value)

watch(visible, (val) => {
  if (val) {
    generalError.value = null
    fetchAllTenants()
    fetchAllRoles()
    fetchAllDepartments()

    if (props.user) {
      resetForm({
        values: {
          email: props.user.email,
          firstName: props.user.firstName,
          lastName: props.user.lastName,
          tenantId: props.user.tenantId,
          departmentId: props.user.departmentId || '',
          roleIds: props.user.roles.map(r => r.id),
        },
      })
    }
    else {
      resetForm({
        values: {
          email: '',
          firstName: '',
          lastName: '',
          password: '',
          tenantId: '',
          departmentId: '',
          roleIds: [],
        },
      })
    }
  }
})

const onSubmit = handleSubmit(async (rawValues) => {
  try {
    if (isEditing.value && props.user) {
      const values = rawValues as UpdateUserFormData
      await updateUser(props.user.id, {
        firstName: values.firstName,
        lastName: values.lastName,
        departmentId: values.departmentId || null,
      })
    }
    else {
      const values = rawValues as CreateUserFormData
      await createUser({
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password,
        tenantId: values.tenantId,
        departmentId: values.departmentId || undefined,
        roleIds: values.roleIds,
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
