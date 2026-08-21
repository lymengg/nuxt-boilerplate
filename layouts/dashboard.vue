<template>
  <div class="min-h-screen bg-surface-50 flex">
    <LayoutSidebar
      :is-open="sidebarOpen"
      @close="sidebarOpen = false"
    />

    <div class="flex-1 flex flex-col min-h-screen lg:ml-64">
      <LayoutHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const sidebarOpen = ref(false)
</script>
