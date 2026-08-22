<template>
  <Dialog
    v-model:visible="visible"
    :header="isEditing ? 'Edit Tenant' : 'Create Tenant'"
    :modal="true"
    :closable="!loading"
    :style="{ width: '500px' }"
  >
    <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
      <Field name="name" v-slot="{ field, errorMessage }">
        <label for="name" class="block text-sm font-medium text-slate-700 mb-1">Name</label>
        <InputText
          id="name"
          v-bind="field"
          class="w-full"
          :class="{ 'p-invalid': errorMessage }"
          required
        />
        <small v-if="errorMessage" class="text-red-500">{{ errorMessage }}</small>
      </Field>

      <Field name="domain" v-slot="{ field, errorMessage }">
        <label for="domain" class="block text-sm font-medium text-slate-700 mb-1">Domain</label>
        <InputText
          id="domain"
          v-bind="field"
          class="w-full"
          :class="{ 'p-invalid': errorMessage }"
          required
        />
        <small v-if="errorMessage" class="text-red-500">{{ errorMessage }}</small>
      </Field>
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
        @click="onSubmit"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import type { Tenant } from '~/types/tenant'
import { tenantSchema, type TenantFormData } from '~/schemas/tenant'
import { Field } from 'vee-validate'

const props = defineProps<{
  tenant?: Tenant
}>()

const emit = defineEmits<{
  saved: []
}>()

const visible = defineModel<boolean>('visible', { default: false })
const { getErrorMessage } = useApiError()

const { handleSubmit, errors, resetForm, setFieldError } = useFormValidation(tenantSchema)

const { createTenant, updateTenant } = useTenants()

const loading = ref(false)

const isEditing = computed(() => !!props.tenant)

watch(visible, (val) => {
  if (val) {
    if (props.tenant) {
      resetForm({
        values: {
          name: props.tenant.name,
          domain: props.tenant.domain,
        },
      })
    }
    else {
      resetForm({
        values: {
          name: '',
          domain: '',
        },
      })
    }
  }
})

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  try {
    if (isEditing.value && props.tenant) {
      await updateTenant(props.tenant.id, {
        name: values.name,
        domain: values.domain,
      })
    }
    else {
      await createTenant({
        name: values.name,
        domain: values.domain,
      })
    }
    visible.value = false
    emit('saved')
  }
  catch (e) {
    const msg = getErrorMessage(e)
    setFieldError('__general', msg)
  }
  finally {
    loading.value = false
  }
})
</script>
