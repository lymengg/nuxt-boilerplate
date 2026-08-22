<template>
  <NuxtLayout name="auth">
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-slate-900">Expense Management</h1>
        <p class="text-slate-500 mt-1">Sign in to your account</p>
      </div>

      <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
        <div v-if="error" class="mb-2">
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
          <small v-if="errorMessage" class="text-red-500">{{ errorMessage }}</small>
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
          <small v-if="errorMessage" class="text-red-500">{{ errorMessage }}</small>
        </Field>

        <Button
          type="submit"
          label="Sign In"
          class="w-full"
          :loading="loading"
        />
      </form>
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

const { handleSubmit, errors } = useFormValidation(loginSchema)

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
