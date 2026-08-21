import type { ComputedRef, MaybeRef } from 'vue'

type ComponentProps<T> = T extends new(...args: any) => { $props: infer P } ? NonNullable<P>
  : T extends (props: infer P, ...args: any) => any ? P
  : {}

declare module 'nuxt/app' {
  interface NuxtLayouts {
    auth: ComponentProps<typeof import("/home/runner/work/nuxt-boilerplate/nuxt-boilerplate/layouts/auth.vue").default>,
    dashboard: ComponentProps<typeof import("/home/runner/work/nuxt-boilerplate/nuxt-boilerplate/layouts/dashboard.vue").default>,
    default: ComponentProps<typeof import("/home/runner/work/nuxt-boilerplate/nuxt-boilerplate/layouts/default.vue").default>,
}
  export type LayoutKey = keyof NuxtLayouts extends never ? string : keyof NuxtLayouts
  interface PageMeta {
    layout?: MaybeRef<LayoutKey | false> | ComputedRef<LayoutKey | false>
  }
}