<template>
  <Dialog
    v-model:visible="visible"
    :header="`Manage Permissions - ${role?.name || ''}`"
    :modal="true"
    :closable="!loading"
    :style="{ width: '600px' }"
  >
    <div class="flex flex-col gap-4">
      <Message v-if="generalError" severity="error" :closable="false">
        {{ generalError }}
      </Message>

      <div v-for="group in permissionGroups" :key="group.name">
        <h4 class="text-sm font-semibold text-slate-900 mb-2">{{ group.name }}</h4>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="permission in group.permissions"
            :key="permission.id"
            class="flex items-center gap-2"
          >
            <Checkbox
              :input-id="permission.id"
              :model-value="selectedPermissionIds.includes(permission.id)"
              @update:model-value="togglePermission(permission.id, $event)"
            />
            <label :for="permission.id" class="text-sm text-slate-700">
              {{ permission.name }}
            </label>
          </div>
        </div>
      </div>
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
import type { Role } from '~/types/role'
import { PERMISSION_GROUPS } from '~/types/permission'

const props = defineProps<{
  role: Role | null | undefined
}>()

const emit = defineEmits<{
  saved: []
}>()

const visible = defineModel<boolean>('visible', { default: false })
const { getErrorMessage } = useApiError()

const { addPermission, removePermission } = useRoles()

const loading = ref(false)
const generalError = ref<string | null>(null)
const selectedPermissionIds = ref<string[]>([])

const permissionGroups = PERMISSION_GROUPS

watch(visible, (val) => {
  if (val && props.role) {
    generalError.value = null
    selectedPermissionIds.value = [...props.role.permissions]
  }
})

function togglePermission(permissionId: string, checked: boolean) {
  if (checked) {
    selectedPermissionIds.value.push(permissionId)
  }
  else {
    selectedPermissionIds.value = selectedPermissionIds.value.filter(id => id !== permissionId)
  }
}

/**
 * The backend exposes only single-permission add/remove endpoints, so the
 * dialog diffs the selection against the current role permissions and applies
 * the changes one at a time.
 */
async function handleSave() {
  if (!props.role) return

  const current = new Set(props.role.permissions)
  const selected = new Set(selectedPermissionIds.value)
  const toAdd = selectedPermissionIds.value.filter(id => !current.has(id))
  const toRemove = [...current].filter(id => !selected.has(id))

  loading.value = true
  generalError.value = null
  try {
    for (const permission of toAdd) {
      await addPermission(props.role.id, permission)
    }
    for (const permission of toRemove) {
      await removePermission(props.role.id, permission)
    }
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
