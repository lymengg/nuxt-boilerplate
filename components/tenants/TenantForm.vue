<template>
  <Dialog
    v-model:visible="visible"
    :header="isEditing ? 'Edit Tenant' : 'Create Tenant'"
    :modal="true"
    :closable="!isSubmitting"
    :style="{ width: '500px' }"
  >
    <form @submit.prevent="onSubmit" class="flex flex-col gap-3">
      <Message v-if="generalError" severity="error" :closable="false">
        {{ generalError }}
      </Message>
      <Field as="div" name="name" v-slot="{ field, errorMessage }">
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

      <Field as="div" name="domain" v-slot="{ field, errorMessage }">
        <label for="domain" class="block text-sm font-medium text-slate-700 mb-1">Domain</label>
        <InputText
          id="domain"
          v-bind="field"
          class="w-full"
          :invalid="!!errorMessage"
          required
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

watch(visible, (val) => {
  if (val) {
    generalError.value = null
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
    generalError.value = getErrorMessage(e)
}
})
</script>
