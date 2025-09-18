import { Traitor } from '#traitor'
import * as fc from 'fast-check'
import { Arb as ArbTrait } from '../../../traits/arb.js'
import { domain } from '../domain.js'

/**
 * {@link Arb} trait implementation for numbers.
 *
 * Provides various number generators for property-based testing.
 * Generates both integers and floating-point numbers.
 *
 * @example
 * ```ts
 * import { Num } from '@wollybeard/kit'
 * import * as fc from 'fast-check'
 *
 * // Generate sample numbers
 * const sample = Num.Arb.sample()     // 42 or -3.14 or 0
 * const samples = Num.Arb.samples(5)  // [1, -42, 3.14, 0, 999]
 *
 * // Use in property tests
 * fc.assert(
 *   fc.property(Num.Arb.arbitrary, (num) => {
 *     return Number.isFinite(num)
 *   })
 * )
 * ```
 */
const arbitrary = fc.oneof(
  fc.integer(),
  fc.float(),
)

export const Arb = Traitor.implement(ArbTrait, domain, {
  arbitrary,
  sample: () => fc.sample(arbitrary, 1)[0]!,
  samples: (count = 10) => fc.sample(arbitrary, count),
})

// Additional specialized number arbitraries
export const arbInteger = fc.integer()
export const arbPositive = fc.integer({ min: 1 })
export const arbNonNegative = fc.nat()
export const arbFloat = fc.float()
export const arbInRange = (min: number, max: number) => fc.float({ min, max })
