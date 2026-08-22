<template>
  <NuxtLayout name="auth">
    <div class="rounded-2xl bg-white/80 p-8 shadow-xl ring-1 ring-slate-900/5 backdrop-blur">
      <div class="mb-6 text-center">
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md shadow-primary-500/25">
          <i class="pi pi-wallet text-xl text-white" />
        </div>
        <h1 class="text-xl font-semibold tracking-tight text-slate-900">Expense Management</h1>
        <p class="mt-1 text-sm text-slate-500">Sign in to your account</p>
      </div>

      <form @submit.prevent="onSubmit" class="flex flex-col gap-3">
        <div v-if="error">
          <Message severity="error" :closable="false">{{ error }}</Message>
        </div>

        <Field name="email" v-slot="{ field, errorMessage }">
          <label for="email" class="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <InputText
            id="email"
            v-bind="field"
            type="email"
            placeholder="you@company.com"
            class="w-full"
            :class="{ 'p-invalid': errorMessage }"
            required
            autocomplete="email"
          />
          <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
        </Field>

        <Field name="password" v-slot="{ field, errorMessage }">
          <label for="password" class="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <Password
            id="password"
            v-bind="field"
            placeholder="Enter your password"
            :feedback="false"
            toggleMask
            class="w-full"
            :class="{ 'p-invalid': errorMessage }"
            inputClass="w-full"
            required
            autocomplete="current-password"
          />
          <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
        </Field>

        <Button
          type="submit"
          label="Sign In"
          class="w-full"
          :loading="loading"
        />
      </form>

      <div class="mt-6 rounded-xl bg-primary-50/70 px-4 py-3 text-center ring-1 ring-primary-100">
        <p class="text-xs font-semibold text-primary-700">Demo mode — backend is mocked</p>
        <p class="mt-0.5 text-xs text-primary-600/80">
          Any email &amp; password works. Use a password starting with
          <span class="font-medium">mfa</span> to preview the 2FA screen.
        </p>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { loginSchema, type LoginFormData } from '~/schemas/login'
import { Field } from 'vee-validate'

definePageMeta({
  layout: false,
  middleware: 'guest',
})

const { login } = useAuth()
const { getErrorMessage } = useApiError()

const { handleSubmit } = useFormValidation(loginSchema)

const loading = ref(false)
const error = ref<string | null>(null)

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
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
  finally {
    loading.value = false
  }
})
</script>
