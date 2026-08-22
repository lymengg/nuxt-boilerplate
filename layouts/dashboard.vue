<template>
  <div class="min-h-screen bg-slate-50/50">
    <LayoutAppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
    <LayoutAppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    <main
      class="pt-16 transition-all duration-300"
      :class="sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'"
    >
      <div class="mx-auto max-w-[1600px] p-6 lg:p-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const sidebarOpen = ref(true)
</script>
