const baseURL = process.env.NUXT_APP_BASE_URL || '/'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  components: [{ path: '~/components', pathPrefix: false }],
  css: ['@fontsource-variable/outfit'],
  tailwindcss: { cssPath: '~/assets/css/main.css' },
  typescript: { strict: true },
  app: {
    // Set by the GitHub Pages workflow so the site works under /<repo-name>/.
    baseURL,
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Pet Meal Planner',
      meta: [
        {
          name: 'description',
          content:
            'A multi-step form with A/B testing, built with Nuxt, Vue 3, TypeScript and Pinia.',
        },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: `${baseURL}favicon.svg` }],
    },
  },
})
