<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="form-field">
      <label for="name" class="form-label">Department Name</label>
      <InputText
        id="name"
        v-model="form.name"
        class="w-full"
        :invalid="!!errors.name"
        placeholder="e.g., Engineering"
      />
      <small v-if="errors.name" class="form-error">{{ errors.name }}</small>
    </div>

    <div class="form-field">
      <label for="manager" class="form-label">Manager</label>
      <Select
        id="manager"
        v-model="form.managerId"
        :options="managers"
        optionLabel="name"
        optionValue="id"
        placeholder="Select manager"
        class="w-full"
        showClear
        filter
      />
    </div>

    <div class="flex justify-end gap-2 pt-4">
      <Button type="button" label="Cancel" severity="secondary" text @click="$emit('cancel')" />
      <Button type="submit" :label="department ? 'Update' : 'Create'" :loading="isSubmitting" />
    </div>
  </form>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import type { Department } from '~/types'
import { userService } from '~/services/user.service'

const props = defineProps<{
  department?: Department
}>()

const emit = defineEmits<{
  submit: [data: unknown]
  cancel: []
}>()

const isSubmitting = ref(false)
const managers = ref<Array<{ id: string; name: string }>>([])

const form = reactive({
  name: props.department?.name || '',
  managerId: props.department?.managerId || '',
})

const errors = reactive({
  name: '',
})

function validate() {
  let valid = true
  errors.name = ''

  if (!form.name.trim()) {
    errors.name = 'Department name is required'
    valid = false
  }

  return valid
}

function handleSubmit() {
  if (!validate()) return

  isSubmitting.value = true
  try {
    emit('submit', {
      name: form.name,
      managerId: form.managerId || undefined,
    })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  try {
    const response = await userService.list({ size: 100 })
    if (response.success && response.data) {
      managers.value = response.data.content.map((u) => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
      }))
    }
  } catch {
    // Managers loading failed
  }
})
</script>
