import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '@wollybeard/kit',
  description: 'A TypeScript utility library with functional programming utilities',
  base: '/kit/', // Adjust this based on your deployment URL

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
            { text: 'Currying Pattern', link: '/guide/currying' },
            { text: 'Type Safety', link: '/guide/type-safety' },
          ],
        },
      ],

      // API sidebar
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
          ],
        },
        {
          text: 'Core Data Structures',
          items: [
            { text: 'Arr', link: '/api/arr' },
            { text: 'Obj', link: '/api/obj' },
            { text: 'Str', link: '/api/str' },
            { text: 'Fn', link: '/api/fn' },
            { text: 'Num', link: '/api/num' },
          ],
        },
        {
          text: 'Utilities',
          items: [
            { text: 'Err', link: '/api/err' },
            { text: 'Prom', link: '/api/prom' },
            { text: 'Rec', link: '/api/rec' },
            { text: 'Json', link: '/api/json' },
            { text: 'Value', link: '/api/value' },
          ],
        },
        {
          text: 'Development',
          items: [
            { text: 'Test', link: '/api/test' },
            {
              text: 'Ts',
              link: '/api/ts',
              items: [
                { text: 'Kind', link: '/api/ts/kind' },
                { text: 'Test', link: '/api/ts/test' },
                { text: 'Union', link: '/api/ts/union' },
                { text: 'Variance', link: '/api/ts/variance' },
              ],
            },
          ],
        },
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
