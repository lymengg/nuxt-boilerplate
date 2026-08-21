<template>
  <div>
    <Drawer
      v-model:visible="drawerVisible"
      header="Navigation"
      :modal="true"
      :showCloseIcon="false"
      class="lg:hidden"
    >
      <nav class="flex flex-col gap-1">
        <NuxtLink
          v-for="item in filteredMenuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="isActive(item.path)
            ? 'bg-primary-50 text-primary-700'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
          @click="$emit('close')"
        >
          <i :class="item.icon" class="text-lg" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>
    </Drawer>

    <aside
      class="hidden lg:block fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-slate-200 overflow-y-auto transition-transform duration-300"
      :class="open ? 'translate-x-0' : '-translate-x-full'"
    >
      <nav class="flex flex-col gap-1 p-4">
        <NuxtLink
          v-for="item in filteredMenuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="isActive(item.path)
            ? 'bg-primary-50 text-primary-700'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
        >
          <i :class="item.icon" class="text-lg" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>
    </aside>
  </div>
</template>

<script setup lang="ts">
interface MenuItem {
  label: string
  icon: string
  path: string
  permission?: string
}

defineProps<{
  open: boolean
}>()

defineEmits<{
  close: []
}>()

const route = useRoute()
const { can } = useAuthorization()

const menuItems: MenuItem[] = [
  { label: 'Dashboard', icon: 'pi pi-home', path: '/dashboard' },
  { label: 'Expenses', icon: 'pi pi-wallet', path: '/expenses', permission: 'EXPENSE_READ' },
  { label: 'Users', icon: 'pi pi-users', path: '/management/users', permission: 'USER_READ' },
  { label: 'Roles', icon: 'pi pi-shield', path: '/management/roles', permission: 'ROLE_READ' },
  { label: 'Tenants', icon: 'pi pi-building', path: '/management/tenants', permission: 'TENANT_READ' },
  { label: 'Departments', icon: 'pi pi-tags', path: '/management/departments', permission: 'DEPARTMENT_READ' },
  { label: 'Audit Logs', icon: 'pi pi-history', path: '/management/audit', permission: 'AUDIT_LOG_READ' },
]

const filteredMenuItems = computed(() => {
  return menuItems.filter(item => !item.permission || can(item.permission))
})

const drawerVisible = computed({
  get: () => false,
  set: () => {},
})

function isActive(path: string): boolean {
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>
