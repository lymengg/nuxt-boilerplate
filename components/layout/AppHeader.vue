<template>
  <header class="fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-6">
    <Button
      icon="pi pi-bars"
      text
      rounded
      @click="$emit('toggleSidebar')"
      aria-label="Toggle sidebar"
    />

    <div class="ml-4 flex items-center">
      <span class="text-lg font-semibold text-slate-900">Expense Management</span>
    </div>

    <div class="ml-auto flex items-center gap-3">
      <div class="hidden sm:flex items-center gap-2 text-sm text-slate-600">
        <Avatar
          :label="userInitials"
          shape="circle"
          class="bg-primary-100 text-primary-700"
        />
        <span class="font-medium">{{ user?.firstName }} {{ user?.lastName }}</span>
      </div>

      <Button
        icon="pi pi-sign-out"
        text
        rounded
        severity="secondary"
        @click="handleLogout"
        aria-label="Logout"
        v-tooltip.bottom="'Logout'"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
defineEmits<{
  toggleSidebar: []
}>()

const { user, logout } = useAuth()

const userInitials = computed(() => {
  if (!user.value) return '?'
  return `${user.value.firstName.charAt(0)}${user.value.lastName.charAt(0)}`.toUpperCase()
})

async function handleLogout() {
  await logout()
}
</script>
