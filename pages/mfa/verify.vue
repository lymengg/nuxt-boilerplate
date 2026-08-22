<template>
  <NuxtLayout name="auth">
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-slate-900">Two-Factor Authentication</h1>
        <p class="text-slate-500 mt-1">Enter the code from your authenticator app</p>
      </div>

      <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
        <div v-if="error" class="mb-2">
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
          <small v-if="errorMessage" class="text-red-500">{{ errorMessage }}</small>
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

const { handleSubmit, errors } = useFormValidation(mfaVerifySchema)

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
