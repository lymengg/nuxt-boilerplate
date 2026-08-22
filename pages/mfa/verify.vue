<template>
  <NuxtLayout name="auth">
    <div class="rounded-2xl bg-white/80 p-8 shadow-xl ring-1 ring-slate-900/5 backdrop-blur">
      <div class="mb-6 text-center">
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md shadow-primary-500/25">
          <i class="pi pi-shield text-xl text-white" />
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Two-Factor Authentication</h1>
        <p class="mt-1.5 text-base text-slate-500">Enter the code from your authenticator app — it verifies automatically</p>
      </div>

      <form @submit.prevent="onSubmit" class="flex flex-col gap-3">
        <div v-if="error">
          <Message severity="error" :closable="false">{{ error }}</Message>
        </div>

        <Field as="div" name="token" v-slot="{ field, errorMessage }">
          <label for="token" class="block text-base font-medium text-slate-700 mb-1.5">Verification Code</label>
          <InputText
            id="token"
            v-bind="field"
            class="w-full input-lg"
            :invalid="!!errorMessage"
            maxlength="6"
            required
            autofocus
          />
          <small v-if="errorMessage" class="mt-1 block text-sm text-red-500">{{ errorMessage }}</small>
        </Field>

        <Button
          type="submit"
          label="Verify"
          class="w-full text-base"
          :loading="isSubmitting"
        />

        <Button
          label="Back to Login"
          severity="secondary"
          text
          class="w-full text-base"
          @click="navigateTo('/login')"
        />
      </form>

      <div class="mt-6 border-t border-slate-200/70 pt-4 text-center">
        <p class="text-xs text-slate-400">Protected by two-factor authentication</p>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { mfaVerifySchema } from '~/schemas/mfa'
import { Field } from 'vee-validate'

definePageMeta({
  layout: false,
})

const { verifyMfa } = useAuth()
const { getErrorMessage } = useApiError()

const { handleSubmit, isSubmitting, values } = useForm({
  validationSchema: toTypedSchema(mfaVerifySchema),
})

const error = ref<string | null>(null)

const onSubmit = handleSubmit(async (formValues) => {
  error.value = null

  try {
    await verifyMfa(formValues.token)
    navigateTo('/dashboard')
  }
  catch (e) {
    error.value = getErrorMessage(e)
  }
})

watch(() => values.token, (token) => {
  if (!isSubmitting.value && /^\d{6}$/.test(token ?? '')) {
    onSubmit()
  }
})
</script>
