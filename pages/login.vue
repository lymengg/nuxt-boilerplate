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

        <form @submit.prevent="onSubmit" class="flex flex-col gap-3">
          <div v-if="error">
            <Message severity="error" :closable="false">{{ error }}</Message>
          </div>

          <Field as="div" name="email" v-slot="{ field, errorMessage }">
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

          <Field as="div" name="password" v-slot="{ field, errorMessage }">
            <label for="password" class="block text-base font-medium text-slate-700 mb-1.5">Password</label>
            <Password
              id="password"
              v-bind="field"
              placeholder="Enter your password"
              :feedback="false"
              toggleMask
              class="w-full input-lg"
              :invalid="!!errorMessage"
              inputClass="w-full input-lg"
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
        </form>

        <div class="mt-6 border-t border-slate-200/70 pt-4 text-center">
          <p class="text-xs text-slate-400">© 2026 Expense Management · All rights reserved</p>
        </div>
      </div>

      <div class="mx-auto mt-4 w-fit rounded-full bg-white/60 px-4 py-1.5 text-xs text-slate-500 ring-1 ring-slate-900/5 backdrop-blur">
        Demo mode — any email &amp; password works · use a password starting with
        <span class="font-medium">mfa</span> to preview 2FA
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { loginSchema } from '~/schemas/login'
import { Field } from 'vee-validate'

definePageMeta({
  layout: false,
  middleware: 'guest',
})

const { login } = useAuth()
const { getErrorMessage } = useApiError()

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(loginSchema),
})

const error = ref<string | null>(null)

const onSubmit = handleSubmit(async (values) => {
  error.value = null

  try {
    const result = await login(values.email, values.password)
    if (result.requiresMfa) {
      navigateTo('/mfa/verify')
    }
    else {
      navigateTo('/dashboard')
    }
  }
  catch (e) {
    error.value = getErrorMessage(e)
  }
})
</script>
