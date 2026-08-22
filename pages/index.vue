<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-100">
    <ProgressSpinner />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

onMounted(async () => {
  const { initialize, isAuthenticated } = useAuth()
  await initialize()
  navigateTo(isAuthenticated.value ? '/dashboard' : '/login', { replace: true })
})
</script>
