<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-50 p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <span class="text-white font-bold text-lg">EM</span>
        </div>
        <h1 class="text-2xl font-semibold text-surface-900">Expense Management</h1>
        <p class="text-sm text-surface-500 mt-1">Sign in to your account</p>
      </div>

      <Card class="shadow-sm">
        <template #content>
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div class="form-field">
              <label for="email" class="form-label">Email</label>
              <InputText
                id="email"
                v-model="form.email"
                type="email"
                placeholder="you@company.com"
                class="w-full"
                :invalid="!!errors.email"
                :disabled="isLoading"
                aria-describedby="email-error"
              />
              <small v-if="errors.email" id="email-error" class="form-error">{{ errors.email }}</small>
            </div>

            <div class="form-field">
              <label for="password" class="form-label">Password</label>
              <Password
                id="password"
                v-model="form.password"
                placeholder="Enter your password"
                :feedback="false"
                toggleMask
                class="w-full"
                inputClass="w-full"
                :invalid="!!errors.password"
                :disabled="isLoading"
                aria-describedby="password-error"
              />
              <small v-if="errors.password" id="password-error" class="form-error">{{ errors.password }}</small>
            </div>

            <div v-if="serverError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-600">{{ serverError }}</p>
            </div>

            <Button
              type="submit"
              label="Sign In"
              class="w-full"
              :loading="isLoading"
              :disabled="isLoading"
            />
          </form>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'

definePageMeta({
  layout: false,
  middleware: ['guest'],
})

const { login, isLoading } = useAuth()

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

const serverError = ref('')

function validate() {
  let valid = true
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = 'Email is required'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email'
    valid = false
  }

  if (!form.password) {
    errors.password = 'Password is required'
    valid = false
  }

  return valid
}

async function handleLogin() {
  serverError.value = ''

  if (!validate()) return

  const result = await login(form.email, form.password)

  if (result.success) {
    navigateTo('/dashboard')
  } else if ('requiresMfa' in result && result.requiresMfa) {
    navigateTo('/mfa/verify')
  } else if ('error' in result) {
    serverError.value = (result as { error: string }).error
  }
}
</script>
