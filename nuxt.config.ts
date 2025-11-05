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
    // 新增：客户端 Node.js 模块兼容，避免构建时误删依赖
    clientNodeCompat: true,
  },
  // 关键：指定明确的兼容性日期（需 ≥2024-09-23，与 Cloudflare 要求一致）
  compatibilityDate: '2025-11-05',
  nitro: {
    preset: import.meta.env.DEV ? 'cloudflare-module' : 'cloudflare-pages',
    cloudflare: {
      compatibilityFlags: ['nodejs_compat'],
      compatibilityDate: '2025-11-05', // 显式同步日期，避免版本不匹配
    },
    // 新增：声明 Node.js 模块副作用，防止构建时被 tree-shake 移除
    moduleSideEffects: [
      'node:buffer',
      'node:events',
      'node:process',
      'node:timers',
      'node:async_hooks'
    ],
    // 新增：构建配置，强制保留 Node.js 模块并映射全局变量
    build: {
      rollupOptions: {
        external: [
          'node:buffer',
          'node:events',
          'node:process',
          'node:timers',
          'node:async_hooks'
        ],
        output: {
          // 映射 Node.js 模块到全局变量，确保 Worker 运行时可访问
          globals: {
            'node:buffer': 'Buffer',
            'node:events': 'events',
            'node:process': 'process',
            'node:timers': 'timers',
            'node:async_hooks': 'async_hooks'
          }
        }
      }
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
    // 新增：Vite 构建时保留 Node.js 模块引用
    optimizeDeps: {
      exclude: [
        'node:buffer',
        'node:events',
        'node:process',
        'node:timers',
        'node:async_hooks'
      ]
    }
  },
  eslint: {
    config: {
      stylistic: true,
      standalone: false,
    },
  },
  i18n: {
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
