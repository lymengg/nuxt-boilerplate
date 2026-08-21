<template>
  <div class="text-center p-8">
    <i class="pi pi-inbox text-4xl text-slate-300 mb-4" />
    <p class="text-slate-500">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  message?: string
}>(), {
  message: 'No data available',
})
</script>
