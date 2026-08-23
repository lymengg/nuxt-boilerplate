<template>
  <NuxtLayout name="auth">
    <div class="rounded-2xl bg-white/80 p-8 shadow-xl ring-1 ring-slate-900/5 backdrop-blur">
      <div class="mb-6 text-center">
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md shadow-primary-500/25">
          <i class="pi pi-lock text-xl text-white" />
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Reset Password</h1>
        <p class="mt-1.5 text-base text-slate-500">Choose a new password for your account</p>
      </div>

      <div v-if="submitted">
        <Message severity="success" :closable="false">
          Your password has been reset. You can now sign in.
        </Message>
        <div class="mt-4 text-center">
          <Button
            label="Go to Login"
            class="w-full text-base"
            @click="navigateTo('/login')"
          />
        </div>
      </div>

      <form v-else class="flex flex-col gap-3" @submit.prevent="onSubmit">
        <div v-if="error">
          <Message severity="error" :closable="false">{{ error }}</Message>
        </div>

        <Field v-slot="{ field, errorMessage }" as="div" name="newPassword">
          <label for="newPassword" class="block text-base font-medium text-slate-700 mb-1.5">New Password</label>
          <Password
            id="newPassword"
            v-bind="field"
            placeholder="Enter a new password"
            toggle-mask
            class="w-full input-lg"
            :invalid="!!errorMessage"
            input-class="w-full input-lg"
            required
            autocomplete="new-password"
          />
          <small v-if="errorMessage" class="mt-1 block text-sm text-red-500">{{ errorMessage }}</small>
        </Field>

        <Field v-slot="{ field, errorMessage }" as="div" name="confirmPassword">
          <label for="confirmPassword" class="block text-base font-medium text-slate-700 mb-1.5">Confirm Password</label>
          <Password
            id="confirmPassword"
            v-bind="field"
            placeholder="Repeat the new password"
            :feedback="false"
            toggle-mask
            class="w-full input-lg"
            :invalid="!!errorMessage"
            input-class="w-full input-lg"
            required
            autocomplete="new-password"
          />
          <small v-if="errorMessage" class="mt-1 block text-sm text-red-500">{{ errorMessage }}</small>
        </Field>

        <Button
          type="submit"
          label="Reset Password"
          class="w-full text-base"
          :loading="isSubmitting"
        />
      </form>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Field, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { resetPasswordSchema } from '~/schemas/password'
import { authService } from '~/services/auth.service'

definePageMeta({
  layout: false,
})

const route = useRoute()
const { getErrorMessage } = useApiError()

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(resetPasswordSchema),
})

const error = ref<string | null>(null)
const submitted = ref(false)

const onSubmit = handleSubmit(async (values) => {
  error.value = null
  const token = route.query.token as string | undefined

  if (!token) {
    error.value = 'Invalid or missing reset token. Please request a new password reset.'
    return
  }

  try {
    const response = await authService.resetPassword({
      token,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    })
    if (!response.success) {
      throw new Error(response.message || 'Failed to reset password')
    }
    submitted.value = true
  }
  catch (e) {
    error.value = getErrorMessage(e)
  }
})
</script>
