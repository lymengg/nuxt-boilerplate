<template>
  <Dialog
    v-model:visible="visible"
    :header="isEditing ? 'Edit Tenant' : 'Create Tenant'"
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
        <label for="domain" class="block text-sm font-medium text-slate-700 mb-1">Domain</label>
        <InputText
          id="domain"
          v-model="form.domain"
          class="w-full"
          :class="{ 'p-invalid': errors.domain }"
          required
        />
        <small v-if="errors.domain" class="text-red-500">{{ errors.domain }}</small>
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
import type { Tenant } from '~/types/tenant'
import { tenantSchema, type TenantFormData } from '~/schemas/tenant'

const props = defineProps<{
  tenant?: Tenant
}>()

const emit = defineEmits<{
  saved: []
}>()

const visible = defineModel<boolean>('visible', { default: false })
const { getErrorMessage } = useApiError()
const { errors, validate, clearErrors } = useFormValidation(tenantSchema)

const { createTenant, updateTenant } = useTenants()

const loading = ref(false)

const isEditing = computed(() => !!props.tenant)

const form = reactive<TenantFormData>({
  name: '',
  domain: '',
})

watch(visible, (val) => {
  if (val) {
    if (props.tenant) {
      form.name = props.tenant.name
      form.domain = props.tenant.domain
    }
    else {
      form.name = ''
      form.domain = ''
    }
    clearErrors()
  }
})

async function handleSubmit() {
  if (!await validate(form)) return

  loading.value = true
  try {
    if (isEditing.value && props.tenant) {
      await updateTenant(props.tenant.id, {
        name: form.name,
        domain: form.domain,
      })
    }
    else {
      await createTenant({
        name: form.name,
        domain: form.domain,
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
