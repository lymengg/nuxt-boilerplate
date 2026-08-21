<template>
  <header class="h-16 bg-white border-b border-surface-200 flex items-center justify-between px-6">
    <div class="flex items-center gap-4">
      <button
        class="lg:hidden p-2 rounded-lg hover:bg-surface-100 text-surface-600"
        @click="$emit('toggleSidebar')"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div class="hidden md:block">
        <h1 class="text-lg font-semibold text-surface-900">{{ pageTitle }}</h1>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <Button
        icon="pi pi-bell"
        severity="secondary"
        text
        rounded
        aria-label="Notifications"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

defineEmits<{
  toggleSidebar: []
}>()

const route = useRoute()

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/expenses': 'Expenses',
    '/management/users': 'User Management',
    '/management/roles': 'Role Management',
    '/management/tenants': 'Tenant Management',
    '/management/departments': 'Department Management',
    '/management/audit': 'Audit Logs',
  }
  return titles[route.path] || 'Expense Management'
})
</script>
