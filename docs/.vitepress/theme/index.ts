import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import DefaultTheme from 'vitepress/theme'
import '@shikijs/vitepress-twoslash/style.css'
import './custom.css'
import type { EnhanceAppContext } from 'vitepress'
import SourceLink from './components/SourceLink.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }: EnhanceAppContext) {
    app.use(TwoslashFloatingVue)
    app.component('SourceLink', SourceLink)
  },
}
