<template>
  <Dialog
    v-model:visible="visible"
    header="Create User"
    :modal="true"
    :closable="!isSubmitting"
    :style="{ width: '500px' }"
  >
    <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
      <Message v-if="generalError" severity="error" :closable="false">
        {{ generalError }}
      </Message>

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

      <Field v-if="showDepartment" v-slot="{ field, errorMessage }" as="div" name="departmentId">
        <label for="department" class="block text-sm font-medium text-slate-700 mb-1">
          Department <span class="text-red-500">*</span>
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
        label="Create"
        :loading="isSubmitting"
        @click="onSubmit"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import type { CreateUserRequest } from '~/types/user'
import { createUserSchema } from '~/schemas/user'
import { Field, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'

const emit = defineEmits<{
  saved: []
}>()

const visible = defineModel<boolean>('visible', { default: false })
const { getErrorMessage } = useApiError()
const { hasRole } = useAuthorization()

const { createUser } = useUsers()
const { allTenants, fetchAllTenants } = useTenants()
const { allRoles, fetchAllRoles } = useRoles()
const { allDepartments, fetchAllDepartments } = useDepartments()

const generalError = ref<string | null>(null)
const isSuperAdmin = computed(() => hasRole('PLATFORM_ADMIN'))

const tenants = computed(() => allTenants.value)
const roles = computed(() => allRoles.value)
const selectedTenantId = ref<number | null>(null)

const departments = computed(() => {
  if (selectedTenantId.value !== null && selectedTenantId.value !== undefined) {
    return allDepartments.value.filter(d => d.tenantId === selectedTenantId.value)
  }
  return allDepartments.value
})

const { handleSubmit, resetForm, setFieldValue, values, isSubmitting } = useForm({
  validationSchema: toTypedSchema(createUserSchema),
})

const isPlatformAdmin = computed(() => values.roleName === 'PLATFORM_ADMIN')
const showTenant = computed(() => isSuperAdmin.value && !isPlatformAdmin.value)
const showDepartment = computed(() => !isPlatformAdmin.value)

watch(visible, (val) => {
  if (val) {
    generalError.value = null
    fetchAllTenants()
    fetchAllRoles()
    fetchAllDepartments()
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
})

watch(isPlatformAdmin, (platformAdmin) => {
  if (platformAdmin) {
    setFieldValue('departmentId', null)
    setFieldValue('tenantId', null)
    selectedTenantId.value = null
  }
})

function onTenantChange(value: number | null) {
  selectedTenantId.value = value ?? null
  setFieldValue('tenantId', value ?? null)
  setFieldValue('departmentId', null)
}

function onSubmit() {
  // Clear any stale general error so a new attempt does not show an old one.
  generalError.value = null
  handleSubmit(async (formValues) => {
    try {
      const payload: CreateUserRequest = {
        email: formValues.email,
        password: formValues.password,
        firstName: formValues.firstName || undefined,
        lastName: formValues.lastName || undefined,
        roleName: formValues.roleName || undefined,
      }

      if (!isPlatformAdmin.value) {
        if (isSuperAdmin.value && formValues.tenantId) {
          payload.tenantId = formValues.tenantId
        }
        payload.departmentId = formValues.departmentId ?? undefined
      }

      await createUser(payload)
      visible.value = false
      emit('saved')
    }
    catch (e) {
      generalError.value = getErrorMessage(e)
    }
  })()
}
</script>
