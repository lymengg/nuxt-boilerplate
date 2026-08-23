<template>
  <Dialog
    v-model:visible="visible"
    :header="isEditing ? 'Edit Tenant' : 'Create Tenant'"
    :modal="true"
    :closable="!isSubmitting"
    :style="{ width: '500px' }"
  >
    <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
      <Message v-if="generalError" severity="error" :closable="false">
        {{ generalError }}
      </Message>
      <Field v-slot="{ field, errorMessage }" as="div" name="name">
        <label for="name" class="block text-sm font-medium text-slate-700 mb-1">Name</label>
        <InputText
          id="name"
          v-bind="field"
          class="w-full"
          :invalid="!!errorMessage"
          required
        />
        <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
      </Field>

      <Field v-slot="{ field, errorMessage }" as="div" name="status">
        <label for="status" class="block text-sm font-medium text-slate-700 mb-1">Status</label>
        <Select
          id="status"
          :model-value="field.value"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          placeholder="Select status"
          class="w-full"
          :invalid="!!errorMessage"
          required
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
import type { Tenant } from '~/types/tenant'
import { TENANT_STATUS_CONFIG } from '~/types/tenant'
import { tenantSchema, type TenantFormData } from '~/schemas/tenant'
import { Field, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'

const props = defineProps<{
  tenant?: Tenant
}>()

const emit = defineEmits<{
  saved: []
}>()

const visible = defineModel<boolean>('visible', { default: false })
const { getErrorMessage } = useApiError()

const { handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(tenantSchema),
})

const { createTenant, updateTenant } = useTenants()

const generalError = ref<string | null>(null)

const isEditing = computed(() => !!props.tenant)

const statusOptions = Object.entries(TENANT_STATUS_CONFIG).map(([value, { label }]) => ({
  label,
  value,
}))

watch(visible, (val) => {
  if (val) {
    generalError.value = null
    if (props.tenant) {
      resetForm({
        values: {
          name: props.tenant.name,
          status: props.tenant.status,
        },
      })
    }
    else {
      resetForm({
        values: {
          name: '',
          status: 'ACTIVE',
        },
      })
    }
  }
})

const onSubmit = handleSubmit(async (values) => {
  try {
    const data: TenantFormData = {
      name: values.name,
      status: values.status,
    }

    if (isEditing.value && props.tenant) {
      await updateTenant(props.tenant.id, data)
    }
    else {
      await createTenant(data)
    }
    visible.value = false
    emit('saved')
  }
  catch (e) {
    generalError.value = getErrorMessage(e)
  }
})
</script>
