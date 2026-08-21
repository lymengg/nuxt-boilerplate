export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
  ],

  primevue: {},

  tailwindcss: {
    configPath: 'tailwind.config.ts',
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080',
    },
  },

  ssr: true,

  app: {
    head: {
      title: 'Expense Management',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Enterprise expense management system' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        },
      ],
    },
  },

  typescript: {
    strict: true,
  },
})
