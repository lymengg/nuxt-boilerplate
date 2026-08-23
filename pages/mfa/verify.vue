<template>
  <NuxtLayout name="auth">
    <div class="rounded-2xl bg-white/80 p-8 shadow-xl ring-1 ring-slate-900/5 backdrop-blur">
      <div class="mb-6 text-center">
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md shadow-primary-500/25">
          <i class="pi pi-shield text-xl text-white" />
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Two-Factor Authentication</h1>
        <p class="mt-1.5 text-base text-slate-500">{{ methodHint }}</p>
      </div>

      <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
        <div v-if="error">
          <Message severity="error" :closable="false">{{ error }}</Message>
        </div>

        <Field v-slot="{ field, errorMessage }" as="div" name="code">
          <label for="code" class="block text-base font-medium text-slate-700 mb-1.5">Verification Code</label>
          <InputText
            id="code"
            v-bind="field"
            inputmode="numeric"
            class="w-full input-lg text-center tracking-[0.5em]"
            :invalid="!!errorMessage"
            maxlength="6"
            required
            autofocus
            autocomplete="one-time-code"
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
          @click="handleBack"
        />
      </form>

      <div class="mt-6 border-t border-slate-200/70 pt-4 text-center">
        <p class="text-xs text-slate-400">Protected by two-factor authentication</p>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Field, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { mfaVerifySchema } from '~/schemas/mfa'

definePageMeta({
  layout: false,
})

const authStore = useAuthStore()
const { pendingMfa } = storeToRefs(authStore)
const { verifyMfa, cancelMfa } = authStore
const { getErrorMessage } = useApiError()

const { handleSubmit, isSubmitting, values } = useForm({
  validationSchema: toTypedSchema(mfaVerifySchema),
})

const error = ref<string | null>(null)

const methodHint = computed(() => {
  if (pendingMfa.value?.method === 'EMAIL') {
    return 'Enter the 6-digit code we emailed you — it verifies automatically'
  }
  return 'Enter the 6-digit code from your authenticator app — it verifies automatically'
})

onMounted(() => {
  if (!pendingMfa.value) {
    navigateTo('/login', { replace: true })
  }
})

const onSubmit = handleSubmit(async (formValues) => {
  error.value = null

  try {
    await verifyMfa(formValues.code)
    navigateTo('/dashboard')
  }
  catch (e) {
    error.value = getErrorMessage(e)
  }
})

watch(() => values.code, (code) => {
  if (!isSubmitting.value && /^\d{6}$/.test(code ?? '')) {
    onSubmit()
  }
})

function handleBack() {
  cancelMfa()
  navigateTo('/login')
}
</script>
