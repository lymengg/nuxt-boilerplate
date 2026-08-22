<template>
  <div>
    <DataTable
      :value="roles"
      :loading="loading"
      dataKey="id"
    >
      <template #empty>
        <CommonEmptyState message="No roles found" />
      </template>

      <Column field="name" header="Name" sortable>
        <template #body="{ data }">
          <div class="font-medium text-slate-900">{{ data.name }}</div>
        </template>
      </Column>

      <Column field="description" header="Description" />

      <Column header="Permissions">
        <template #body="{ data }">
          <div class="flex flex-wrap gap-1">
            <Tag
              v-for="perm in data.permissions.slice(0, 3)"
              :key="perm.id"
              :value="perm.name"
              severity="info"
            />
            <Tag
              v-if="data.permissions.length > 3"
              :value="`+${data.permissions.length - 3} more`"
              severity="secondary"
            />
          </div>
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
              icon="pi pi-key"
              severity="info"
              size="small"
              text
              @click="$emit('permissions', data)"
              aria-label="Manage Permissions"
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              size="small"
              text
              @click="$emit('delete', data)"
              aria-label="Delete"
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
import type { Role } from '~/types/role'
import type { PaginationState } from '~/types/api'

const props = defineProps<{
  roles: Role[]
  loading: boolean
  pagination: { state: PaginationState }
}>()

const emit = defineEmits<{
  edit: [role: Role]
  permissions: [role: Role]
  delete: [role: Role]
  page: [page: number]
  sizeChange: [size: number]
}>()

function onPage(event: { page: number, rows: number }) {
  if (event.rows !== props.pagination.state.size) {
    emit('sizeChange', event.rows)
  }
  else {
    emit('page', event.page)
  }
}
</script>
