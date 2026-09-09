<template>
  <div>
    <DataTable
      :value="users"
      :loading="loading"
      data-key="id"
    >
      <template #empty>
        <CommonEmptyState message="No users found" />
      </template>

      <Column field="email" header="Email" sortable>
        <template #body="{ data }">
          <div class="font-medium text-slate-900">{{ data.email }}</div>
        </template>
      </Column>

      <Column header="Name" sortable sort-field="lastName">
        <template #body="{ data }">
          {{ data.firstName }} {{ data.lastName }}
        </template>
      </Column>

      <Column field="enabled" header="Status" sortable>
        <template #body="{ data }">
          <Tag
            :value="data.enabled ? 'Active' : 'Inactive'"
            :severity="data.enabled ? 'success' : 'danger'"
          />
        </template>
      </Column>

      <Column field="roles" header="Roles">
        <template #body="{ data }">
          <div class="flex flex-wrap gap-1">
            <Tag
              v-for="role in data.roles"
              :key="role"
              :value="role"
              severity="info"
            />
          </div>
        </template>
      </Column>

      <Column field="createdAt" header="Created" sortable>
        <template #body="{ data }">
          {{ formatDate(data.createdAt) }}
        </template>
      </Column>

      <Column header="Actions" style="width: 150px">
        <template #body="{ data }">
          <div class="flex gap-1">
            <Button
              v-if="can('USER_UPDATE')"
              icon="pi pi-pencil"
              severity="secondary"
              size="small"
              text
              aria-label="Edit"
              @click="$emit('edit', data)"
            />
            <Button
              v-if="can('USER_ENABLE')"
              :icon="data.enabled ? 'pi pi-ban' : 'pi pi-check'"
              :severity="data.enabled ? 'danger' : 'success'"
              size="small"
              text
              :aria-label="data.enabled ? 'Disable' : 'Enable'"
              @click="$emit('toggleEnabled', data)"
            />
            <Button
              v-if="can('USER_ASSIGN_ROLE')"
              icon="pi pi-shield"
              severity="info"
              size="small"
              text
              aria-label="Assign Role"
              @click="$emit('assignRole', data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <Paginator
      :rows="pagination.state.size"
      :total-records="pagination.state.totalElements"
      :first="pagination.state.page * pagination.state.size"
      :rows-per-page-options="[10, 20, 50]"
      @page="onPage"
    />
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types/user'
import type { PaginationState } from '~/types/api'

const props = defineProps<{
  users: User[]
  loading: boolean
  pagination: { state: PaginationState }
}>()

const emit = defineEmits<{
  edit: [user: User]
  toggleEnabled: [user: User]
  assignRole: [user: User]
  page: [page: number]
  sizeChange: [size: number]
}>()

const { formatDate } = useFormat()
const { can } = useAuthorization()

function onPage(event: { page: number, rows: number }) {
  if (event.rows !== props.pagination.state.size) {
    emit('sizeChange', event.rows)
  }
  else {
    emit('page', event.page)
  }
}
</script>
