import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/i18n', '@pinia/nuxt'],
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
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
    },
    email: {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASSWORD,
      from: process.env.EMAIL_FROM || '"E-commerce Store" <store@example.com>'
    },
    public: {
      stripe: {
        publicKey: process.env.STRIPE_PUBLIC_KEY
      },
      strapiUrl: process.env.STRAPI_URL || 'http://localhost:1337',
      strapiToken: process.env.STRAPI_API_TOKEN || '',
      siteUrl: process.env.SITE_URL || 'http://localhost:3000'
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})