<template>
  <div class="min-h-screen bg-slate-50">
    <AppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    <main
      class="pt-16 transition-all duration-300"
      :class="sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'"
    >
      <div class="p-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const sidebarOpen = ref(true)
</script>
