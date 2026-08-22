<template>
  <NuxtLayout name="default">
    <div class="flex flex-col items-center py-16 text-center">
      <div class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/50">
        <i class="pi pi-lock text-3xl text-red-400" />
      </div>
      <h1 class="mb-2 text-xl font-semibold tracking-tight text-slate-900">Access Denied</h1>
      <p class="mb-6 max-w-sm text-sm text-slate-500">
        You don't have permission to access this page. Contact your administrator if you believe this is a mistake.
      </p>
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
