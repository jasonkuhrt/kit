import { transformerNotationWordHighlight } from '@shikijs/transformers'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { defineConfig } from 'vitepress'
import { apiSidebar } from '../.generated/sidebar.js'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '@wollybeard/kit',
  description: 'A TypeScript utility library with functional programming utilities',

  // Use / for local development and production
  base: '/',

  // Remove .html from URLs
  cleanUrls: true,

  srcExclude: ['**/internal/**'], // Exclude internal docs from build
  ignoreDeadLinks: true, // Temporarily ignore dead links

  markdown: {
    codeTransformers: [
      transformerNotationWordHighlight(),
      // Enable Twoslash in CI or when explicitly enabled via TWOSLASH=true
      // Disabled by default in local dev for faster iteration
      ...(process.env.CI || process.env.TWOSLASH === 'true' ? [transformerTwoslash()] : []),
    ],
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
    ],

    outline: {
      level: [2, 3], // Show h2 and h3 headings in the outline
    },

    sidebar: {
      // Guide sidebar
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Philosophy', link: '/guide/philosophy' },
          ],
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Module Structure', link: '/guide/module-structure' },
            { text: 'Drillable Namespace Pattern', link: '/guide/drillable-namespace-pattern' },
            { text: 'Currying Pattern', link: '/guide/currying' },
            { text: 'Type Safety', link: '/guide/type-safety' },
          ],
        },
      ],

      // API sidebar - dynamically generated from interface model
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
          ],
        },
        ...apiSidebar,
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/jasonkuhrt/kit' },
    ],

    search: {
      provider: 'local',
    },
  },
})
