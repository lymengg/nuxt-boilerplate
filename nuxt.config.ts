import Aura from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes'

const appPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    surface: {
      0: '#ffffff',
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
  },
  components: {
    inputtext: {
      root: {
        borderRadius: '10px',
      },
    },
    select: {
      root: {
        borderRadius: '10px',
      },
    },
    multiselect: {
      root: {
        borderRadius: '10px',
      },
    },
    textarea: {
      root: {
        borderRadius: '10px',
      },
    },
    password: {
      root: {
        borderRadius: '10px',
      },
    },
  },
})

// API origin the static SPA calls directly (no proxy). Baked in at build time.
const apiBase = process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    '@pinia/nuxt',
    '@nuxt/eslint',
  ],

  primevue: {
    options: {
      theme: {
        preset: appPreset,
        options: {
          darkModeSelector: '.app-dark-mode',
          cssLayer: false,
        },
      },
    },
  },

  // Security headers (CSP, HSTS, X-Frame-Options, etc.) are NOT applied by
  // this app — the SPA is static, so set them at the static host / CDN in
  // production (see README). The API sets its own headers (Spring Security).

  css: ['primeicons/primeicons.css'],

  tailwindcss: {
    configPath: 'tailwind.config.ts',
    cssPath: '~/assets/css/main.css',
  },

  runtimeConfig: {
    public: {
      // The API origin the SPA calls directly (e.g. https://api.xxx.com in
      // production, http://localhost:8080 in dev). Auth is fully backend-owned
      // via httpOnly cookies — this app holds no tokens.
      apiBase,
      // Enable VConsole for mobile browser debugging.
      vconsole: process.env.NUXT_PUBLIC_VCONSOLE !== 'false',
    },
  },

  // Static SPA — no server routes, no Nitro. Deploy the generated output to
  // any static host / CDN.
  ssr: false,

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
