import { bench } from '@ark/attest'
import type { StaticErrorAssertion } from './assertion-error.js'

type _baseline = StaticErrorAssertion<'baseline', string, number>

bench('StaticErrorAssertion > N metadata', () => {
  return {} as StaticErrorAssertion<'Types mismatch', 1, 0>
}).types([40, 'instantiations'])

bench('StaticErrorAssertion > Y metadata', () => {
  return {} as StaticErrorAssertion<'Types mismatch', 1, 0, { a: 'a'; b: 'b' }>
}).types([315, 'instantiations'])
