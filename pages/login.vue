<template>
  <NuxtLayout name="auth">
    <div>
      <div class="rounded-2xl bg-white/80 p-8 shadow-xl ring-1 ring-slate-900/5 backdrop-blur">
        <div class="mb-6 text-center">
          <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md shadow-primary-500/25">
            <i class="pi pi-wallet text-xl text-white" />
          </div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">Expense Management</h1>
          <p class="mt-1.5 text-base text-slate-500">Sign in to your account</p>
        </div>

        <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
          <div v-if="passwordChanged">
            <Message severity="success" :closable="false">
              Password changed successfully. Please sign in with your new password.
            </Message>
          </div>
          <div v-if="error">
            <Message severity="error" :closable="false">{{ error }}</Message>
          </div>

          <Field v-slot="{ field, errorMessage }" as="div" name="usernameOrEmail">
            <label for="usernameOrEmail" class="block text-base font-medium text-slate-700 mb-1.5">Username or Email</label>
            <InputText
              id="usernameOrEmail"
              v-bind="field"
              placeholder="you@company.com"
              class="w-full input-lg"
              :invalid="!!errorMessage"
              required
              autocomplete="username"
            />
            <small v-if="errorMessage" class="mt-1 block text-sm text-red-500">{{ errorMessage }}</small>
          </Field>

          <Field v-slot="{ field, errorMessage }" as="div" name="password">
            <label for="password" class="block text-base font-medium text-slate-700 mb-1.5">Password</label>
            <Password
              id="password"
              v-bind="field"
              placeholder="Enter your password"
              :feedback="false"
              toggle-mask
              class="w-full input-lg"
              :invalid="!!errorMessage"
              input-class="w-full input-lg"
              required
              autocomplete="current-password"
            />
            <small v-if="errorMessage" class="mt-1 block text-sm text-red-500">{{ errorMessage }}</small>
          </Field>

          <Button
            type="submit"
            label="Sign In"
            class="w-full text-base"
            :loading="isSubmitting"
          />

          <div class="text-center">
            <NuxtLink
              to="/forgot-password"
              class="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
            >
              Forgot your password?
            </NuxtLink>
          </div>
        </form>

        <div class="mt-6 border-t border-slate-200/70 pt-4 text-center">
          <p class="text-xs text-slate-400">&copy; 2026 Expense Management &mdash; All rights reserved</p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Field, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { loginSchema } from '~/schemas/login'

definePageMeta({
  layout: false,
  middleware: 'guest',
})

const route = useRoute()
const { login } = useAuthStore()
const { getErrorMessage } = useApiError()

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(loginSchema),
})

const error = ref<string | null>(null)
const passwordChanged = computed(() => route.query.passwordChanged === '1')

const onSubmit = handleSubmit(async (values) => {
  error.value = null

  try {
    const result = await login(values.usernameOrEmail, values.password)
    navigateTo(result.requiresMfa ? '/mfa/verify' : '/dashboard')
  }
  catch (e) {
    error.value = getErrorMessage(e)
  }
})
</script>
