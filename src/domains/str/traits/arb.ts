import { Traitor } from '#traitor'
import * as fc from 'fast-check'
import { Arb as ArbTrait } from '../../../traits/arb.ts'
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

export const Arb = Traitor.implement(ArbTrait, domain, {
  arbitrary,
  sample: () => fc.sample(arbitrary, 1)[0]!,
  samples: (count = 10) => fc.sample(arbitrary, count),
})
