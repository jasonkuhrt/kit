import { Arb as ArbTrait } from '#Arb'
import * as fc from 'fast-check'
import { domain } from '../domain.ts'

/**
 * {@link Arb} trait implementation for strings.
 *
 * Provides various string generators for property-based testing.
 * Generates strings of various lengths and character sets.
 *
 * @example
 * ```ts
 * import { Str } from '@wollybeard/kit'
 * import * as fc from 'fast-check'
 *
 * // Generate sample strings
 * const sample = Str.Arb.sample()     // "hello" or "" or "test123"
 * const samples = Str.Arb.samples(3)  // ["abc", "", "xyz"]
 *
 * // Use in property tests
 * fc.assert(
 *   fc.property(Str.Arb.arbitrary, (str) => {
 *     return str.length >= 0
 *   })
 * )
 * ```
 */
const arbitrary = fc.string()

export const Arb = ArbTrait.$.implement(domain, {
  arbitrary,
  sample: () => fc.sample(arbitrary, 1)[0]!,
  samples: (count = 10) => fc.sample(arbitrary, count),
})

// Additional specialized string arbitraries could be exposed:
export const arbNonEmpty = fc.string({ minLength: 1 })
export const arbAlphanumeric = fc.string({ minLength: 1 }).filter(s => /^[a-zA-Z0-9]+$/.test(s))
export const arbEmail = fc.string().map(s => `${s}@example.com`)

declare global {
  interface TRAITOR_DOMAINS_Arb {
    Str: typeof Arb
  }
}
