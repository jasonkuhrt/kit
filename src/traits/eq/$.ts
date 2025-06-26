import { Eq as EqBase } from './eq.ts'
import { Laws } from './laws.ts'

// Extend the base Eq with laws
export const Eq = Object.assign(EqBase, {
  $: {
    ...EqBase.$,
    laws: Laws,
  },
})
