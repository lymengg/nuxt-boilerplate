<template>
  <NuxtLayout name="auth">
    <div class="rounded-2xl bg-white/80 p-8 shadow-xl ring-1 ring-slate-900/5 backdrop-blur">
      <div class="mb-6 text-center">
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md shadow-primary-500/25">
          <i class="pi pi-shield text-xl text-white" />
        </div>
        <h1 class="text-xl font-semibold tracking-tight text-slate-900">Two-Factor Authentication</h1>
        <p class="mt-1 text-sm text-slate-500">Enter the code from your authenticator app</p>
      </div>

      <form @submit.prevent="onSubmit" class="flex flex-col gap-3">
        <div v-if="error">
          <Message severity="error" :closable="false">{{ error }}</Message>
        </div>

        <Field name="token" v-slot="{ field, errorMessage }">
          <label for="token" class="block text-sm font-medium text-slate-700 mb-1">Verification Code</label>
          <InputText
            id="token"
            v-bind="field"
            placeholder="000000"
            class="w-full text-center text-2xl tracking-widest"
            :class="{ 'p-invalid': errorMessage }"
            maxlength="6"
            required
            autofocus
          />
          <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
        </Field>

        <Button
          type="submit"
          label="Verify"
          class="w-full"
          :loading="loading"
        />

        <Button
          label="Back to Login"
          severity="secondary"
          text
          class="w-full"
          @click="navigateTo('/login')"
        />
      </form>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { mfaVerifySchema, type MfaVerifyFormData } from '~/schemas/mfa'
import { Field } from 'vee-validate'

definePageMeta({
  layout: false,
})

const { verifyMfa } = useAuth()
const { getErrorMessage } = useApiError()

const { handleSubmit } = useFormValidation(mfaVerifySchema)

const loading = ref(false)
const error = ref<string | null>(null)

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  error.value = null

  try {
    await verifyMfa(values.token)
    navigateTo('/dashboard')
  }
  catch (e) {
    error.value = getErrorMessage(e)
  }
  finally {
    loading.value = false
  }
})
</script>
