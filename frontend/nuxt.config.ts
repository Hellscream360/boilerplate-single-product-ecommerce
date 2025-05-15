import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      strapiUrl: process.env.STRAPI_URL || 'http://localhost:1337',
      strapiToken: process.env.STRAPI_API_READ_ONLY || ''
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
