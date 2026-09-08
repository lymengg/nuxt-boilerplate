import VConsole from 'vconsole'

export default defineNuxtPlugin(() => {
  // vConsole patches XMLHttpRequest, which conflicts with MSW's network
  // interception in the test environment — never boot it under vitest.
  if (import.meta.env.TEST) {
    return
  }

  const { public: config } = useRuntimeConfig()

  if (config.vconsole) {
    new VConsole()
  }
})
