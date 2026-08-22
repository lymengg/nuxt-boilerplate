<template>
  <header class="fixed top-0 left-0 right-0 z-40 h-16 border-b border-slate-200/70 bg-white/90 backdrop-blur-md flex items-center px-4 lg:px-6">
    <Button
      icon="pi pi-bars"
      text
      rounded
      severity="secondary"
      @click="$emit('toggleSidebar')"
      aria-label="Toggle sidebar"
    />

    <div class="ml-3 flex items-center gap-2.5">
      <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 shadow-sm">
        <i class="pi pi-wallet text-sm text-white" />
      </div>
      <span class="hidden text-base font-semibold tracking-tight text-slate-900 sm:block">Expense Management</span>
    </div>

    <div class="ml-auto flex items-center gap-3">
      <div class="hidden items-center gap-2.5 rounded-full py-1 pl-1 pr-3 text-sm text-slate-600 transition-colors hover:bg-slate-100 sm:flex">
        <Avatar
          :label="userInitials"
          shape="circle"
          class="bg-gradient-to-br from-primary-500 to-primary-700 !text-white ring-2 ring-white"
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
