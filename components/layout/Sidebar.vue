<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-surface-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <div class="flex items-center justify-between h-16 px-4 border-b border-surface-200">
      <NuxtLink to="/dashboard" class="flex items-center gap-2">
        <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">EM</span>
        </div>
        <span class="font-semibold text-surface-900">ExpenseManager</span>
      </NuxtLink>
      <button
        class="lg:hidden p-1 rounded hover:bg-surface-100"
        @click="$emit('close')"
      >
        <svg class="w-5 h-5 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <nav class="p-4 space-y-1">
      <NuxtLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :class="[
          'sidebar-link',
          isActive(item.path) ? 'sidebar-link-active' : 'sidebar-link-inactive',
        ]"
        @click="$emit('close')"
      >
        <span class="w-5 h-5 flex items-center justify-center text-sm">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-surface-200">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-700 font-medium text-sm">{{ userInitials }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-surface-900 truncate">{{ userName }}</p>
          <p class="text-xs text-surface-500 truncate">{{ user?.email }}</p>
        </div>
        <button
          class="p-1.5 rounded hover:bg-surface-100 text-surface-400 hover:text-surface-600"
          title="Logout"
          @click="handleLogout"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  </aside>

  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 z-40 lg:hidden"
    @click="$emit('close')"
  />
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  close: []
}>()

const route = useRoute()
const { user, logout } = useAuth()

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/expenses', label: 'Expenses', icon: '📋' },
  { path: '/management/users', label: 'Users', icon: '👥' },
  { path: '/management/roles', label: 'Roles', icon: '🛡' },
  { path: '/management/tenants', label: 'Tenants', icon: '🏢' },
  { path: '/management/departments', label: 'Departments', icon: '🏛' },
  { path: '/management/audit', label: 'Audit Logs', icon: '📝' },
]

const userName = computed(() => {
  if (!user.value) return ''
  return `${user.value.firstName} ${user.value.lastName}`
})

const userInitials = computed(() => {
  if (!user.value) return ''
  return `${user.value.firstName[0]}${user.value.lastName[0]}`.toUpperCase()
})

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}

async function handleLogout() {
  await logout()
}
</script>
