<template>
  <NuxtLayout name="default">
    <div class="text-center py-12">
      <i class="pi pi-lock text-6xl text-slate-300 mb-6" />
      <h1 class="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
      <p class="text-slate-500 mb-6">You don't have permission to access this page.</p>
      <Button
        label="Go to Dashboard"
        icon="pi pi-home"
        @click="navigateTo('/dashboard')"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})
</script>
