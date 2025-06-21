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

    sidebar: [
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
      {
        text: 'API Reference',
        items: [
          {
            text: 'Data Structures',
            collapsed: false,
            items: [
              { text: 'Array (arr)', link: '/api/arr' },
              { text: 'Object (obj)', link: '/api/obj' },
              { text: 'String (str)', link: '/api/str' },
              { text: 'Record (rec)', link: '/api/rec' },
              { text: 'Group', link: '/api/group' },
              { text: 'Index (idx)', link: '/api/idx' },
              { text: 'Tree', link: '/api/tree' },
            ],
          },
          {
            text: 'Functional Programming',
            collapsed: false,
            items: [
              { text: 'Function (fn)', link: '/api/fn' },
              { text: 'Promise (prom)', link: '/api/prom' },
              { text: 'Cache', link: '/api/cache' },
            ],
          },
          {
            text: 'Type/Value',
            collapsed: false,
            items: [
              { text: 'Boolean (bool)', link: '/api/bool' },
              { text: 'Number (num)', link: '/api/num' },
              { text: 'Null', link: '/api/null' },
              { text: 'Undefined', link: '/api/undefined' },
              { text: 'Value', link: '/api/value' },
              { text: 'Equality (eq)', link: '/api/eq' },
            ],
          },
          {
            text: 'I/O & External',
            collapsed: false,
            items: [
              { text: 'File System (fs)', link: '/api/fs' },
              { text: 'FS Layout', link: '/api/fs-layout' },
              { text: 'FS Relative', link: '/api/fs-relative' },
              { text: 'HTTP', link: '/api/http' },
              { text: 'CLI', link: '/api/cli' },
              { text: 'URL', link: '/api/url' },
              { text: 'Path', link: '/api/path' },
            ],
          },
          {
            text: 'Development',
            collapsed: false,
            items: [
              { text: 'Debug', link: '/api/debug' },
              { text: 'TypeScript (ts)', link: '/api/ts' },
              { text: 'Language', link: '/api/language' },
              { text: 'Codec', link: '/api/codec' },
              { text: 'JSON', link: '/api/json' },
              { text: 'Error (err)', link: '/api/err' },
            ],
          },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/jasonkuhrt/kit' },
    ],

    search: {
      provider: 'local',
    },
  },
})
