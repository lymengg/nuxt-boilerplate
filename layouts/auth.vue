<template>
  <div class="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100">
    <div class="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-200/40 blur-3xl" />
    <div class="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary-100/60 blur-3xl" />

    <div class="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">
        <slot />
      </div>
    </div>
  </div>
</template>
