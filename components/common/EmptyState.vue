<template>
  <div class="flex flex-col items-center px-8 py-12 text-center">
    <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 ring-8 ring-slate-100/50">
      <i class="pi pi-inbox text-xl text-slate-400" />
    </div>
    <p class="text-sm font-medium text-slate-500">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  message?: string
}>(), {
  message: 'No data available',
})
</script>
