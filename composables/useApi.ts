/**
 * Accessor for the shared HTTP client provided by the $api plugin.
 *
 * Services call this instead of `useNuxtApp().$api` directly so tests can
 * mock the seam with the standard `vi.mock('~/composables/useApi')` pattern
 * (the app's auto-imports are unreachable by vi.mock in the Nuxt test env).
 */
export function useApi() {
  return useNuxtApp().$api
}
