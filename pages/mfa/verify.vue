<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-50 p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <span class="text-white font-bold text-lg">EM</span>
        </div>
        <h1 class="text-2xl font-semibold text-surface-900">Two-Factor Authentication</h1>
        <p class="text-sm text-surface-500 mt-1">Enter the code from your authenticator app</p>
      </div>

      <Card class="shadow-sm">
        <template #content>
          <form @submit.prevent="handleVerify" class="space-y-4">
            <div class="form-field">
              <label for="code" class="form-label">Verification Code</label>
              <InputText
                id="code"
                v-model="code"
                placeholder="000000"
                class="w-full text-center text-2xl tracking-widest"
                maxlength="6"
                :invalid="!!error"
                :disabled="isLoading"
                autofocus
              />
              <small v-if="error" class="form-error">{{ error }}</small>
            </div>

            <Button
              type="submit"
              label="Verify"
              class="w-full"
              :loading="isLoading"
              :disabled="isLoading || code.length !== 6"
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

definePageMeta({
  layout: false,
})

const { verifyMfa, isLoading, isMfaPending } = useAuth()

const code = ref('')
const error = ref('')

onMounted(() => {
  if (!isMfaPending.value) {
    navigateTo('/login')
  }
})

async function handleVerify() {
  error.value = ''

  if (code.value.length !== 6) {
    error.value = 'Please enter a 6-digit code'
    return
  }

  const result = await verifyMfa(code.value)

  if (result.success) {
    navigateTo('/dashboard')
  } else if ('error' in result) {
    error.value = (result as { error: string }).error
  }
}
</script>
