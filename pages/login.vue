<template>
  <NuxtLayout name="auth">
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-slate-900">Expense Management</h1>
        <p class="text-slate-500 mt-1">Sign in to your account</p>
      </div>

      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
        <div v-if="error" class="mb-2">
          <Message severity="error" :closable="false">{{ error }}</Message>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <InputText
            id="email"
            v-model="form.email"
            type="email"
            placeholder="you@company.com"
            class="w-full"
            :class="{ 'p-invalid': errors.email }"
            required
            autocomplete="email"
          />
          <small v-if="errors.email" class="text-red-500">{{ errors.email }}</small>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <Password
            id="password"
            v-model="form.password"
            placeholder="Enter your password"
            :feedback="false"
            toggleMask
            class="w-full"
            :class="{ 'p-invalid': errors.password }"
            inputClass="w-full"
            required
            autocomplete="current-password"
          />
          <small v-if="errors.password" class="text-red-500">{{ errors.password }}</small>
        </div>

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

definePageMeta({
  layout: false,
  middleware: 'guest',
})

const { login } = useAuth()
const { getErrorMessage } = useApiError()
const { errors, validate } = useFormValidation(loginSchema)

const loading = ref(false)
const error = ref<string | null>(null)

const form = reactive<LoginFormData>({
  email: '',
  password: '',
})

async function handleLogin() {
  if (!await validate(form)) return

  loading.value = true
  error.value = null

  try {
    const result = await login(form.email, form.password)
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
}
</script>
