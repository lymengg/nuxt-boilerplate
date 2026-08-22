<template>
  <div>
    <DataTable
      :value="users"
      :loading="loading"
      dataKey="id"
    >
      <template #empty>
        <CommonEmptyState message="No users found" />
      </template>

      <Column field="email" header="Email" sortable>
        <template #body="{ data }">
          <div class="font-medium text-slate-900">{{ data.email }}</div>
        </template>
      </Column>

      <Column header="Name" sortable sortField="lastName">
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
              :key="role.id"
              :value="role.name"
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
              icon="pi pi-pencil"
              severity="secondary"
              size="small"
              text
              @click="$emit('edit', data)"
              aria-label="Edit"
            />
            <Button
              v-if="data.enabled"
              icon="pi pi-ban"
              severity="danger"
              size="small"
              text
              @click="$emit('disable', data)"
              aria-label="Disable"
            />
            <Button
              v-else
              icon="pi pi-check"
              severity="success"
              size="small"
              text
              @click="$emit('enable', data)"
              aria-label="Enable"
            />
            <Button
              icon="pi pi-shield"
              severity="info"
              size="small"
              text
              @click="$emit('assignRole', data)"
              aria-label="Assign Role"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <Paginator
      :rows="pagination.state.size"
      :totalRecords="pagination.state.totalElements"
      :first="pagination.state.page * pagination.state.size"
      :rowsPerPageOptions="[10, 20, 50]"
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
  enable: [user: User]
  disable: [user: User]
  assignRole: [user: User]
  page: [page: number]
  sizeChange: [size: number]
}>()

const { formatDate } = useFormat()

function onPage(event: { page: number, rows: number }) {
  if (event.rows !== props.pagination.state.size) {
    emit('sizeChange', event.rows)
  }
  else {
    emit('page', event.page)
  }
}
</script>
