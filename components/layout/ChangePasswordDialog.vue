<template>
  <Dialog
    v-model:visible="visible"
    header="Change Password"
    :modal="true"
    :closable="!isSubmitting"
    :style="{ width: '460px' }"
  >
    <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
      <Message v-if="generalError" severity="error" :closable="false">
        {{ generalError }}
      </Message>
      <Message severity="info" :closable="false">
        After changing your password you will need to sign in again.
      </Message>

      <Field v-slot="{ field, errorMessage }" as="div" name="currentPassword">
        <label for="currentPassword" class="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
        <Password
          id="currentPassword"
          v-bind="field"
          class="w-full"
          :feedback="false"
          toggle-mask
          :invalid="!!errorMessage"
          input-class="w-full"
          required
          autocomplete="current-password"
        />
        <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
      </Field>

      <Field v-slot="{ field, errorMessage }" as="div" name="newPassword">
        <label for="newPassword" class="block text-sm font-medium text-slate-700 mb-1">New Password</label>
        <Password
          id="newPassword"
          v-bind="field"
          class="w-full"
          toggle-mask
          :invalid="!!errorMessage"
          input-class="w-full"
          required
          autocomplete="new-password"
        />
        <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
      </Field>

      <Field v-slot="{ field, errorMessage }" as="div" name="confirmPassword">
        <label for="confirmPassword" class="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
        <Password
          id="confirmPassword"
          v-bind="field"
          class="w-full"
          :feedback="false"
          toggle-mask
          :invalid="!!errorMessage"
          input-class="w-full"
          required
          autocomplete="new-password"
        />
        <small v-if="errorMessage" class="mt-1 block text-red-500">{{ errorMessage }}</small>
      </Field>
    </form>

    <template #footer>
      <Button
        label="Cancel"
        severity="secondary"
        text
        :disabled="isSubmitting"
        @click="visible = false"
      />
      <Button
        label="Change Password"
        :loading="isSubmitting"
        @click="onSubmit"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { Field, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { changePasswordSchema } from '~/schemas/password'

const visible = defineModel<boolean>('visible', { default: false })
const { getErrorMessage } = useApiError()
const authStore = useAuthStore()

const { handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(changePasswordSchema),
})

const generalError = ref<string | null>(null)

watch(visible, (val) => {
  if (val) {
    generalError.value = null
    resetForm()
  }
})

const onSubmit = handleSubmit(async (values) => {
  generalError.value = null
  try {
    await authStore.changePassword(
      values.currentPassword,
      values.newPassword,
      values.confirmPassword,
    )
    visible.value = false
    // The backend revokes all tokens and clears the refresh cookie.
    navigateTo('/login?passwordChanged=1', { replace: true })
  }
  catch (e) {
    generalError.value = getErrorMessage(e)
  }
})
</script>
