import VConsole from 'vconsole'

export default defineNuxtPlugin(() => {
  const { public: config } = useRuntimeConfig()

  if (config.vconsole) {
    new VConsole()
  }
})
