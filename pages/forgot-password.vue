<template>
  <NuxtLayout name="auth">
    <div class="rounded-2xl bg-white/80 p-8 shadow-xl ring-1 ring-slate-900/5 backdrop-blur">
      <div class="mb-6 text-center">
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md shadow-primary-500/25">
          <i class="pi pi-key text-xl text-white" />
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Forgot Password</h1>
        <p class="mt-1.5 text-base text-slate-500">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <div v-if="submitted">
        <Message severity="success" :closable="false">
          If an account exists for that email, a password reset link has been sent.
        </Message>
        <div class="mt-4 text-center">
          <Button
            label="Back to Login"
            severity="secondary"
            text
            class="w-full text-base"
            @click="navigateTo('/login')"
          />
        </div>
      </div>

      <form v-else class="flex flex-col gap-3" @submit.prevent="onSubmit">
        <div v-if="error">
          <Message severity="error" :closable="false">{{ error }}</Message>
        </div>

        <Field v-slot="{ field, errorMessage }" as="div" name="email">
          <label for="email" class="block text-base font-medium text-slate-700 mb-1.5">Email</label>
          <InputText
            id="email"
            v-bind="field"
            type="email"
            placeholder="you@company.com"
            class="w-full input-lg"
            :invalid="!!errorMessage"
            required
            autocomplete="email"
          />
          <small v-if="errorMessage" class="mt-1 block text-sm text-red-500">{{ errorMessage }}</small>
        </Field>

        <Button
          type="submit"
          label="Send Reset Link"
          class="w-full text-base"
          :loading="isSubmitting"
        />

        <div class="text-center">
          <NuxtLink
            to="/login"
            class="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
          >
            Back to Login
          </NuxtLink>
        </div>
      </form>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Field, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { forgotPasswordSchema } from '~/schemas/password'
import { authService } from '~/services/auth.service'

definePageMeta({
  layout: false,
  middleware: 'guest',
})

const { getErrorMessage } = useApiError()

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(forgotPasswordSchema),
})

const error = ref<string | null>(null)
const submitted = ref(false)

const onSubmit = handleSubmit(async (values) => {
  error.value = null

  try {
    const response = await authService.forgotPassword({ email: values.email })
    if (!response.success) {
      throw new Error(response.message || 'Failed to request password reset')
    }
    submitted.value = true
  }
  catch (e) {
    error.value = getErrorMessage(e)
  }
})
</script>
