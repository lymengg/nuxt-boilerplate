<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="form-field">
      <label for="name" class="form-label">Tenant Name</label>
      <InputText
        id="name"
        v-model="form.name"
        class="w-full"
        :invalid="!!errors.name"
        placeholder="e.g., Acme Corp"
      />
      <small v-if="errors.name" class="form-error">{{ errors.name }}</small>
    </div>

    <div class="form-field">
      <label for="domain" class="form-label">Domain</label>
      <InputText
        id="domain"
        v-model="form.domain"
        class="w-full"
        :invalid="!!errors.domain"
        placeholder="e.g., acme.example.com"
      />
      <small v-if="errors.domain" class="form-error">{{ errors.domain }}</small>
    </div>

    <div class="flex justify-end gap-2 pt-4">
      <Button type="button" label="Cancel" severity="secondary" text @click="$emit('cancel')" />
      <Button type="submit" :label="tenant ? 'Update' : 'Create'" :loading="isSubmitting" />
    </div>
  </form>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import type { Tenant } from '~/types'

const props = defineProps<{
  tenant?: Tenant
}>()

const emit = defineEmits<{
  submit: [data: unknown]
  cancel: []
}>()

const isSubmitting = ref(false)

const form = reactive({
  name: props.tenant?.name || '',
  domain: props.tenant?.domain || '',
})

const errors = reactive({
  name: '',
  domain: '',
})

function validate() {
  let valid = true
  errors.name = ''
  errors.domain = ''

  if (!form.name.trim()) {
    errors.name = 'Tenant name is required'
    valid = false
  }

  if (!form.domain.trim()) {
    errors.domain = 'Domain is required'
    valid = false
  }

  return valid
}

function handleSubmit() {
  if (!validate()) return

  isSubmitting.value = true
  try {
    emit('submit', { name: form.name, domain: form.domain })
  } finally {
    isSubmitting.value = false
  }
}
</script>
