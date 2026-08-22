<template>
  <Dialog
    v-model:visible="visible"
    :header="isEditing ? 'Edit Role' : 'Create Role'"
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
import type { Role } from '~/types/role'
import { roleSchema, type RoleFormData } from '~/schemas/role'

const props = defineProps<{
  role?: Role
}>()

const emit = defineEmits<{
  saved: []
}>()

const visible = defineModel<boolean>('visible', { default: false })
const { getErrorMessage } = useApiError()
const { errors, validate, clearErrors } = useFormValidation(roleSchema)

const { createRole, updateRole } = useRoles()

const loading = ref(false)

const isEditing = computed(() => !!props.role)

const form = reactive<RoleFormData>({
  name: '',
  description: '',
})

watch(visible, (val) => {
  if (val) {
    if (props.role) {
      form.name = props.role.name
      form.description = props.role.description
    }
    else {
      form.name = ''
      form.description = ''
    }
    clearErrors()
  }
})

async function handleSubmit() {
  if (!await validate(form)) return

  loading.value = true
  try {
    if (isEditing.value && props.role) {
      await updateRole(props.role.id, {
        name: form.name,
        description: form.description,
      })
    }
    else {
      await createRole({
        name: form.name,
        description: form.description,
        permissionIds: [],
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
