<template>
  <Dialog
    v-model:visible="visible"
    :header="isEditing ? 'Edit User' : 'Create User'"
    :modal="true"
    :closable="!isSubmitting"
    :style="{ width: '500px' }"
  >
    <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
      <Message v-if="generalError" severity="error" :closable="false">
        {{ generalError }}
      </Message>

      <template v-if="!isEditing">
        <Field v-slot="{ field, errorMessage }" as="div" name="email">
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

        <Field v-slot="{ field, errorMessage }" as="div" name="password">
          <label for="password" class="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <Password
            id="password"
            v-bind="field"
            class="w-full"
            input-class="w-full"
            :invalid="!!errorMessage"
            toggle-mask
            required
            autocomplete="new-password"
          />
          <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
        </Field>
      </template>

      <div class="grid grid-cols-2 gap-3">
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
      </div>

      <template v-if="!isEditing">
        <Field v-if="showTenant" v-slot="{ field, errorMessage }" as="div" name="tenantId">
          <label for="tenant" class="block text-sm font-medium text-slate-700 mb-1">Tenant</label>
          <Select
            id="tenant"
            :model-value="field.value"
            :options="tenants"
            option-label="name"
            option-value="id"
            placeholder="Your tenant"
            class="w-full"
            :invalid="!!errorMessage"
            show-clear
            @update:model-value="onTenantChange"
            @blur="field.onBlur"
          />
          <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
        </Field>

        <Field v-slot="{ field, errorMessage }" as="div" name="roleName">
          <label for="roleName" class="block text-sm font-medium text-slate-700 mb-1">Role</label>
          <Select
            id="roleName"
            :model-value="field.value"
            :options="roles"
            option-label="name"
            option-value="name"
            placeholder="Select role"
            class="w-full"
            :invalid="!!errorMessage"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
          <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
        </Field>
      </template>

      <Field v-if="showDepartment" v-slot="{ field, errorMessage }" as="div" name="departmentId">
        <label for="department" class="block text-sm font-medium text-slate-700 mb-1">
          Department <template v-if="!isEditing && !isPlatformAdmin"><span class="text-red-500">*</span></template>
        </label>
        <Select
          id="department"
          :model-value="field.value"
          :options="departments"
          option-label="name"
          option-value="id"
          placeholder="Select department"
          class="w-full"
          :invalid="!!errorMessage"
          :show-clear="isEditing"
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
import type { User, CreateUserRequest, UpdateUserRequest } from '~/types/user'
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
const { hasRole } = useAuthorization()

const { createUser, updateUser } = useUsers()
const { allTenants, fetchAllTenants } = useTenants()
const { allRoles, fetchAllRoles } = useRoles()
const { allDepartments, fetchAllDepartments } = useDepartments()

const generalError = ref<string | null>(null)
const isEditing = computed(() => !!props.user)
const isSuperAdmin = computed(() => hasRole('PLATFORM_ADMIN'))

const tenants = computed(() => allTenants.value)
const roles = computed(() => allRoles.value)
const departments = computed(() => {
  if (selectedTenantId.value !== null && selectedTenantId.value !== undefined) {
    return allDepartments.value.filter(d => d.tenantId === selectedTenantId.value)
  }
  return allDepartments.value
})

const selectedTenantId = ref<number | null>(null)

// Reactive schema: the same dialog instance is reused for create and edit.
const { handleSubmit, resetForm, setFieldValue, isSubmitting, values } = useForm({
  validationSchema: computed(() =>
    toTypedSchema(isEditing.value ? updateUserSchema : createUserSchema),
  ),
})

const isPlatformAdmin = computed(() => {
  if (isEditing.value && props.user) {
    return props.user.roles.includes('PLATFORM_ADMIN')
  }
  return (values as Partial<CreateUserFormData>).roleName === 'PLATFORM_ADMIN'
})

const showTenant = computed(() => isSuperAdmin.value && !isPlatformAdmin.value)
const showDepartment = computed(() => !isPlatformAdmin.value)

watch(visible, (val) => {
  if (val) {
    generalError.value = null
    fetchAllTenants()
    fetchAllRoles()
    fetchAllDepartments()

    if (props.user) {
      selectedTenantId.value = null
      resetForm({
        values: {
          firstName: props.user.firstName || '',
          lastName: props.user.lastName || '',
          departmentId: props.user.departmentId ?? null,
        },
      })
    }
    else {
      selectedTenantId.value = null
      resetForm({
        values: {
          email: '',
          firstName: '',
          lastName: '',
          password: '',
          tenantId: null,
          departmentId: null,
          roleName: 'EMPLOYEE',
        },
      })
    }
  }
})

watch(isPlatformAdmin, (platformAdmin) => {
  if (isEditing.value || !platformAdmin) {
    return
  }
  setFieldValue('departmentId', null)
  setFieldValue('tenantId', null)
})

function onTenantChange(value: number | null) {
  selectedTenantId.value = value ?? null
  setFieldValue('tenantId', value ?? null)
  setFieldValue('departmentId', null)
}

const onSubmit = handleSubmit(async (rawValues) => {
  try {
    if (isEditing.value && props.user) {
      const values = rawValues as UpdateUserFormData
      const payload: UpdateUserRequest = {
        firstName: values.firstName || undefined,
        lastName: values.lastName || undefined,
      }
      if (!isPlatformAdmin.value) {
        payload.departmentId = values.departmentId ?? null
      }
      await updateUser(props.user.id, payload)
    }
    else {
      const values = rawValues as CreateUserFormData
      const payload: CreateUserRequest = {
        email: values.email,
        password: values.password,
        firstName: values.firstName || undefined,
        lastName: values.lastName || undefined,
        roleName: values.roleName || undefined,
      }
      if (!isPlatformAdmin.value) {
        if (isSuperAdmin.value && values.tenantId) {
          payload.tenantId = values.tenantId
        }
        payload.departmentId = values.departmentId ?? undefined
      }
      await createUser(payload)
    }
    visible.value = false
    emit('saved')
  }
  catch (e) {
    generalError.value = getErrorMessage(e)
  }
})
</script>
