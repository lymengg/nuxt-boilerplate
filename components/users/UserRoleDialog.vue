<template>
  <Dialog
    v-model:visible="visible"
    header="Assign Roles"
    :modal="true"
    :closable="!loading"
    :style="{ width: '400px' }"
  >
    <div class="flex flex-col gap-3">
      <Message v-if="generalError" severity="error" :closable="false">
        {{ generalError }}
      </Message>

      <p class="text-sm text-slate-600">
        Assign roles to <strong>{{ user?.firstName }} {{ user?.lastName }}</strong>
      </p>

      <MultiSelect
        v-model="selectedRoleIds"
        :options="allRoles"
        optionLabel="name"
        optionValue="id"
        placeholder="Select roles"
        class="w-full"
      />
    </div>

    <template #footer>
      <Button
        label="Cancel"
        severity="secondary"
        text
        :disabled="loading"
        @click="visible = false"
      />
      <Button
        label="Save"
        :loading="loading"
        @click="handleSave"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import type { User } from '~/types/user'

const props = defineProps<{
  user: User | null | undefined
}>()

const emit = defineEmits<{
  saved: []
}>()

const visible = defineModel<boolean>('visible', { default: false })
const { getErrorMessage } = useApiError()

const { assignRoles } = useUsers()
const { allRoles, fetchAllRoles } = useRoles()

const loading = ref(false)
const generalError = ref<string | null>(null)
const selectedRoleIds = ref<string[]>([])

watch(visible, (val) => {
  if (val) {
    generalError.value = null
    fetchAllRoles()
    if (props.user) {
      selectedRoleIds.value = props.user.roles.map(r => r.id)
    }
  }
})

async function handleSave() {
  if (!props.user) return

  loading.value = true
  try {
    await assignRoles(props.user.id, selectedRoleIds.value)
    visible.value = false
    emit('saved')
  }
  catch (e) {
    generalError.value = getErrorMessage(e)
  }
  finally {
    loading.value = false
  }
}
</script>
