<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="form-field">
      <label for="firstName" class="form-label">First Name</label>
      <InputText
        id="firstName"
        v-model="form.firstName"
        class="w-full"
        :invalid="!!errors.firstName"
      />
      <small v-if="errors.firstName" class="form-error">{{ errors.firstName }}</small>
    </div>

    <div class="form-field">
      <label for="lastName" class="form-label">Last Name</label>
      <InputText
        id="lastName"
        v-model="form.lastName"
        class="w-full"
        :invalid="!!errors.lastName"
      />
      <small v-if="errors.lastName" class="form-error">{{ errors.lastName }}</small>
    </div>

    <div class="form-field">
      <label for="email" class="form-label">Email</label>
      <InputText
        id="email"
        v-model="form.email"
        type="email"
        class="w-full"
        :invalid="!!errors.email"
        :disabled="!!user"
      />
      <small v-if="errors.email" class="form-error">{{ errors.email }}</small>
    </div>

    <div v-if="!user" class="form-field">
      <label for="password" class="form-label">Password</label>
      <Password
        id="password"
        v-model="form.password"
        toggleMask
        class="w-full"
        inputClass="w-full"
        :invalid="!!errors.password"
      />
      <small v-if="errors.password" class="form-error">{{ errors.password }}</small>
    </div>

    <div class="form-field">
      <label for="department" class="form-label">Department</label>
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

    <div v-if="!user" class="form-field">
      <label class="form-label">Roles</label>
      <MultiSelect
        v-model="form.roleIds"
        :options="allRoles"
        optionLabel="name"
        optionValue="id"
        placeholder="Select roles"
        class="w-full"
        :invalid="!!errors.roleIds"
      />
      <small v-if="errors.roleIds" class="form-error">{{ errors.roleIds }}</small>
    </div>

    <div class="flex justify-end gap-2 pt-4">
      <Button type="button" label="Cancel" severity="secondary" text @click="$emit('cancel')" />
      <Button type="submit" :label="user ? 'Update' : 'Create'" :loading="isSubmitting" />
    </div>
  </form>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Select from 'primevue/select'
import MultiSelect from 'primevue/multiselect'
import type { User } from '~/types'
import { roleService } from '~/services/role.service'

const props = defineProps<{
  user?: User
}>()

const emit = defineEmits<{
  submit: [data: unknown]
  cancel: []
}>()

const { departments, fetchAllDepartments } = useDepartments()
const isSubmitting = ref(false)
const allRoles = ref<Array<{ id: string; name: string }>>([])

const form = reactive({
  firstName: props.user?.firstName || '',
  lastName: props.user?.lastName || '',
  email: props.user?.email || '',
  password: '',
  departmentId: props.user?.departmentId || '',
  roleIds: props.user?.roles.map((r) => r.id) || [],
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  roleIds: '',
})

function validate() {
  let valid = true
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = ''
  })

  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required'
    valid = false
  }

  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required'
    valid = false
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email'
    valid = false
  }

  if (!props.user && !form.password) {
    errors.password = 'Password is required'
    valid = false
  }

  if (!props.user && form.roleIds.length === 0) {
    errors.roleIds = 'At least one role is required'
    valid = false
  }

  return valid
}

async function handleSubmit() {
  if (!validate()) return

  isSubmitting.value = true
  try {
    if (props.user) {
      emit('submit', {
        firstName: form.firstName,
        lastName: form.lastName,
        departmentId: form.departmentId || null,
      })
    } else {
      emit('submit', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        departmentId: form.departmentId || undefined,
        roleIds: form.roleIds,
      })
    }
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  fetchAllDepartments()
  try {
    const response = await roleService.getAll()
    if (response.success && response.data) {
      allRoles.value = response.data
    }
  } catch {
    // Roles loading failed
  }
})
</script>
