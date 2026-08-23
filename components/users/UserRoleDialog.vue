<template>
  <Dialog
    v-model:visible="visible"
    header="Manage Roles"
    :modal="true"
    :closable="!loading"
    :style="{ width: '420px' }"
  >
    <div class="flex flex-col gap-4">
      <Message v-if="generalError" severity="error" :closable="false">
        {{ generalError }}
      </Message>

      <p class="text-sm text-slate-600">
        Manage roles for <strong>{{ user?.firstName }} {{ user?.lastName }}</strong>
      </p>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">Current Roles</label>
        <div v-if="user?.roles.length" class="flex flex-wrap gap-2">
          <Tag
            v-for="role in user!.roles"
            :key="role"
            :value="role"
            severity="info"
            removable
            @remove="handleRemoveRole(role)"
          />
        </div>
        <p v-else class="text-sm text-slate-400">No roles assigned</p>
      </div>

      <div>
        <label for="roleToAdd" class="block text-sm font-medium text-slate-700 mb-2">Add Role</label>
        <Select
          id="roleToAdd"
          v-model="selectedRoleName"
          :options="addableRoles"
          option-label="name"
          option-value="name"
          placeholder="Select a role to add"
          class="w-full"
          :disabled="loading"
        />
        <Button
          label="Add Role"
          icon="pi pi-plus"
          class="mt-2 w-full"
          :loading="loading"
          :disabled="!selectedRoleName"
          @click="handleAddRole"
        />
      </div>
    </div>

    <template #footer>
      <Button
        label="Close"
        severity="secondary"
        text
        :disabled="loading"
        @click="visible = false"
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

const { assignRole, removeRole } = useUsers()
const { allRoles, fetchAllRoles } = useRoles()

const loading = ref(false)
const generalError = ref<string | null>(null)
const selectedRoleName = ref<string | null>(null)

// Roles the user does not currently have (backend assigns one role at a time).
const addableRoles = computed(() => {
  if (!props.user) return []
  const current = new Set(props.user.roles)
  return allRoles.value.filter(r => !current.has(r.name))
})

watch(visible, (val) => {
  if (val) {
    generalError.value = null
    selectedRoleName.value = null
    fetchAllRoles()
  }
})

async function handleAddRole() {
  if (!props.user || !selectedRoleName.value) return

  loading.value = true
  generalError.value = null
  try {
    await assignRole(props.user.id, selectedRoleName.value)
    selectedRoleName.value = null
    emit('saved')
  }
  catch (e) {
    generalError.value = getErrorMessage(e)
  }
  finally {
    loading.value = false
  }
}

async function handleRemoveRole(roleName: string) {
  if (!props.user) return

  loading.value = true
  generalError.value = null
  try {
    await removeRole(props.user.id, roleName)
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
