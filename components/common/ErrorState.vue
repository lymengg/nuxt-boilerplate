<template>
  <Message v-if="error" severity="error" :closable="closable" @close="$emit('close')">
    {{ error }}
  </Message>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  error: string
  closable?: boolean
}>(), {
  closable: false,
})

defineEmits<{
  close: []
}>()
</script>
