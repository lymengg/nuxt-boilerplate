<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="form-field">
      <label for="name" class="form-label">Role Name</label>
      <InputText
        id="name"
        v-model="form.name"
        class="w-full"
        :invalid="!!errors.name"
        placeholder="e.g., Manager"
      />
      <small v-if="errors.name" class="form-error">{{ errors.name }}</small>
    </div>

    <div class="form-field">
      <label for="description" class="form-label">Description</label>
      <Textarea
        id="description"
        v-model="form.description"
        rows="3"
        class="w-full"
        :invalid="!!errors.description"
        placeholder="Describe this role..."
      />
      <small v-if="errors.description" class="form-error">{{ errors.description }}</small>
    </div>

    <div class="flex justify-end gap-2 pt-4">
      <Button type="button" label="Cancel" severity="secondary" text @click="$emit('cancel')" />
      <Button type="submit" :label="role ? 'Update' : 'Create'" :loading="isSubmitting" />
    </div>
  </form>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import type { Role } from '~/types'

const props = defineProps<{
  role?: Role
}>()

const emit = defineEmits<{
  submit: [data: unknown]
  cancel: []
}>()

const isSubmitting = ref(false)

const form = reactive({
  name: props.role?.name || '',
  description: props.role?.description || '',
})

const errors = reactive({
  name: '',
  description: '',
})

function validate() {
  let valid = true
  errors.name = ''
  errors.description = ''

  if (!form.name.trim()) {
    errors.name = 'Role name is required'
    valid = false
  }

  if (!form.description.trim()) {
    errors.description = 'Description is required'
    valid = false
  }

  return valid
}

function handleSubmit() {
  if (!validate()) return

  isSubmitting.value = true
  try {
    emit('submit', { name: form.name, description: form.description })
  } finally {
    isSubmitting.value = false
  }
}
</script>
