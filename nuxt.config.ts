import tailwindcss from '@tailwindcss/vite'
import { provider } from 'std-env'
import { currentLocales } from './i18n/i18n'

export default defineNuxtConfig({
  modules: [
    '@nuxthub/core',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@nuxt/eslint',
    '@vueuse/motion/nuxt',
    'shadcn-nuxt',
  ],
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  colorMode: {
    classSuffix: '',
  },
  runtimeConfig: {
    // 保持原有配置...
    siteToken: crypto.randomUUID(),
    redirectStatusCode: '301',
    linkCacheTtl: 60,
    redirectWithQuery: false,
    homeURL: '',
    cfAccountId: '',
    cfApiToken: '',
    dataset: 'sink',
    aiModel: '@cf/meta/llama-3.1-8b-instruct',
    aiPrompt: `You are a URL shortening assistant, please shorten the URL provided by the user into a SLUG. The SLUG information must come from the URL itself, do not make any assumptions. A SLUG is human-readable and should not exceed three words and can be validated using regular expressions {slugRegex} . Only the best one is returned, the format must be JSON reference {"slug": "example-slug"}`,
    caseSensitive: false,
    listQueryLimit: 500,
    disableBotAccessLog: false,
    public: {
      previewMode: '',
      slugDefaultLength: '6',
    },
  },
  routeRules: {
    // 保持原有配置...
    '/': {
      prerender: true,
    },
    '/dashboard/**': {
      prerender: true,
      ssr: false,
    },
    '/dashboard': {
      redirect: '/dashboard/links',
    },
    '/api/**': {
      cors: process.env.NUXT_API_CORS === 'true',
    },
  },
  experimental: {
    enforceModuleCompatibility: true,
  },
  compatibilityDate: 'latest',
  nitro: {
    // 关键修改：添加 Cloudflare 兼容性配置
    preset: import.meta.env.DEV ? 'cloudflare-module' : 'cloudflare-pages',
    cloudflare: {
      // 启用 Node.js 兼容性模式（解决 node:buffer 等模块缺失问题）
      compatibilityFlags: ['nodejs_compat']
    },
    experimental: {
      openAPI: true,
    },
    timing: true,
    openAPI: {
      production: 'runtime',
      meta: {
        title: 'Sink API',
        description: 'A Simple / Speedy / Secure Link Shortener with Analytics, 100% run on Cloudflare.',
      },
      route: '/_docs/openapi.json',
      ui: {
        scalar: {
          route: '/_docs/scalar',
        },
        swagger: {
          route: '/_docs/swagger',
        },
      },
    },
  },
  hub: {
    // 保持原有配置...
    ai: true,
    analytics: true,
    blob: false,
    cache: false,
    database: false,
    kv: true,
    workers: provider !== 'cloudflare_pages',
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  eslint: {
    config: {
      stylistic: true,
      standalone: false,
    },
  },
  i18n: {
    // 保持原有配置...
    locales: currentLocales,
    compilation: {
      strictMessage: false,
      escapeHtml: true,
    },
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'sink_i18n_redirected',
      redirectOn: 'root',
    },
    baseUrl: '/',
    defaultLocale: 'en-US',
  },
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },
})
