<template>
  <Dialog
    v-model:visible="visible"
    :header="`Manage Permissions - ${role?.name || ''}`"
    :modal="true"
    :closable="!loading"
    :style="{ width: '600px' }"
  >
    <div class="flex flex-col gap-6">
      <div v-for="group in permissionGroups" :key="group.name">
        <h4 class="text-sm font-semibold text-slate-900 mb-2">{{ group.name }}</h4>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="permission in group.permissions"
            :key="permission.id"
            class="flex items-center gap-2"
          >
            <Checkbox
              :inputId="permission.id"
              :modelValue="selectedPermissionIds.includes(permission.id)"
              @update:modelValue="togglePermission(permission.id, $event)"
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

const { assignPermissions } = useRoles()

const loading = ref(false)
const selectedPermissionIds = ref<string[]>([])

const permissionGroups = PERMISSION_GROUPS

watch(visible, (val) => {
  if (val && props.role) {
    selectedPermissionIds.value = props.role.permissions.map(p => p.id)
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

async function handleSave() {
  if (!props.role) return

  loading.value = true
  try {
    await assignPermissions(props.role.id, selectedPermissionIds.value)
    visible.value = false
    emit('saved')
  }
  catch (e) {
    const msg = getErrorMessage(e)
  }
  finally {
    loading.value = false
  }
}
</script>
