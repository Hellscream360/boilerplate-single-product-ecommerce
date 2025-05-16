import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/i18n'],
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'fr', name: 'Français', file: 'fr.json' }
    ],
    langDir: 'locales',
    lazy: true,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: true,
      fallbackLocale: 'en'
    }
  },
  runtimeConfig: {
    public: {
      strapiUrl: process.env.STRAPI_URL || 'http://localhost:1337',
      strapiToken: process.env.STRAPI_API_READ_ONLY || '',
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY || ''
    }
  },
  hooks: {
    'app:created'() {
      console.log('Strapi URL:', process.env.STRAPI_URL || 'http://localhost:1337')
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})