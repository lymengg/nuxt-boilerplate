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

  css: ['primeicons/primeicons.css'],

  tailwindcss: {
    configPath: 'tailwind.config.ts',
    cssPath: '~/assets/css/main.css',
  },

  runtimeConfig: {
    // Server-only: the Spring Boot backend URL. The BFF proxies all requests
    // here so the browser never sees the backend directly.
    backendUrl: process.env.NUXT_BACKEND_URL || 'http://localhost:8080',
    // HMAC secret for signing the opaque session cookie. Override in production.
    sessionSecret: process.env.NUXT_SESSION_SECRET || 'dev-only-secret-change-in-production',
    sessionTtl: 60 * 30, // 30 minutes — match the backend access token TTL
    // Idle timeout: session expires after this long without activity (default 30 min)
    sessionIdleTimeout: 60 * 30 * 1000,
    // Absolute timeout: session expires after this long regardless of activity (default 8 hours)
    sessionAbsoluteTimeout: 8 * 60 * 60 * 1000,
    // Comma-separated list of trusted frontend origins for CSRF Origin header validation.
    // The BFF derives this from the server origin in production if not set.
    allowedOrigins: process.env.NUXT_ALLOWED_ORIGINS || '',
    public: {
      // No longer exposes the backend URL — the browser talks only to the BFF
      // (same-origin /api/* routes). Kept for backward compat in case any code
      // still references it during the transition.
      apiBase: '/api',
    },
  },

  // BFF requires the Nuxt server (Nitro) to handle server routes. SPA mode
  // (ssr: false) is fine — server routes run regardless of SSR setting.
  ssr: false,

  nitro: {
    // Session storage: in-memory by default (zero deps, perfect for dev).
    // Set REDIS_URL in production for a distributed, restart-safe store.
    storage: {
      session: process.env.REDIS_URL
        ? { driver: 'redis', url: process.env.REDIS_URL, ttl: 60 * 30 }
        : { driver: 'memory' },
    },
  },

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
