<template>
  <Dialog
    v-model:visible="visible"
    :header="isEditing ? 'Edit User' : 'Create User'"
    :modal="true"
    :closable="!loading"
    :style="{ width: '500px' }"
  >
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <div v-if="!isEditing">
        <label for="email" class="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <InputText
          id="email"
          v-model="form.email"
          type="email"
          class="w-full"
          :class="{ 'p-invalid': errors.email }"
          required
        />
        <small v-if="errors.email" class="text-red-500">{{ errors.email }}</small>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="firstName" class="block text-sm font-medium text-slate-700 mb-1">First Name</label>
          <InputText
            id="firstName"
            v-model="form.firstName"
            class="w-full"
            :class="{ 'p-invalid': errors.firstName }"
            required
          />
          <small v-if="errors.firstName" class="text-red-500">{{ errors.firstName }}</small>
        </div>

        <div>
          <label for="lastName" class="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
          <InputText
            id="lastName"
            v-model="form.lastName"
            class="w-full"
            :class="{ 'p-invalid': errors.lastName }"
            required
          />
          <small v-if="errors.lastName" class="text-red-500">{{ errors.lastName }}</small>
        </div>
      </div>

      <div v-if="!isEditing">
        <label for="password" class="block text-sm font-medium text-slate-700 mb-1">Password</label>
        <Password
          id="password"
          v-model="form.password"
          class="w-full"
          :class="{ 'p-invalid': errors.password }"
          toggleMask
          required
        />
        <small v-if="errors.password" class="text-red-500">{{ errors.password }}</small>
      </div>

      <div v-if="!isEditing">
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
          required
        />
        <small v-if="errors.tenantId" class="text-red-500">{{ errors.tenantId }}</small>
      </div>

      <div>
        <label for="department" class="block text-sm font-medium text-slate-700 mb-1">Department</label>
        <Select
          id="department"
          v-model="form.departmentId"
          :options="departments"
          optionLabel="name"
          optionValue="id"
          placeholder="Select department"
          class="w-full"
          showClear
        />
      </div>

      <div v-if="!isEditing">
        <label class="block text-sm font-medium text-slate-700 mb-1">Roles</label>
        <MultiSelect
          v-model="form.roleIds"
          :options="roles"
          optionLabel="name"
          optionValue="id"
          placeholder="Select roles"
          class="w-full"
        />
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
import type { User } from '~/types/user'

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

const loading = ref(false)
const errors = ref<Record<string, string>>({})

const isEditing = computed(() => !!props.user)

const tenants = computed(() => allTenants.value)
const roles = computed(() => allRoles.value)
const departments = computed(() => allDepartments.value)

const form = reactive({
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  tenantId: '',
  departmentId: '',
  roleIds: [] as string[],
})

watch(visible, (val) => {
  if (val) {
    fetchAllTenants()
    fetchAllRoles()
    fetchAllDepartments()

    if (props.user) {
      form.email = props.user.email
      form.firstName = props.user.firstName
      form.lastName = props.user.lastName
      form.tenantId = props.user.tenantId
      form.departmentId = props.user.departmentId || ''
      form.roleIds = props.user.roles.map(r => r.id)
    }
    else {
      form.email = ''
      form.firstName = ''
      form.lastName = ''
      form.password = ''
      form.tenantId = ''
      form.departmentId = ''
      form.roleIds = []
    }
    errors.value = {}
  }
})

function validate(): boolean {
  errors.value = {}

  if (!isEditing.value && !form.email.trim()) {
    errors.value.email = 'Email is required'
  }
  if (!form.firstName.trim()) {
    errors.value.firstName = 'First name is required'
  }
  if (!form.lastName.trim()) {
    errors.value.lastName = 'Last name is required'
  }
  if (!isEditing.value && !form.password) {
    errors.value.password = 'Password is required'
  }
  if (!isEditing.value && !form.tenantId) {
    errors.value.tenantId = 'Tenant is required'
  }

  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validate()) return

  loading.value = true
  try {
    if (isEditing.value && props.user) {
      await updateUser(props.user.id, {
        firstName: form.firstName,
        lastName: form.lastName,
        departmentId: form.departmentId || null,
      })
    }
    else {
      await createUser({
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        password: form.password,
        tenantId: form.tenantId,
        departmentId: form.departmentId || undefined,
        roleIds: form.roleIds,
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
