import { Eq as EqTrait } from '#Eq'
import { domain } from '../domain.ts'

/**
 * {@link Eq} trait implementation for numbers.
 *
 * Provides number equality comparison using strict equality (===).
 * Handles special cases like NaN, which is never equal to itself.
 *
 * @example
 * ```ts
 * import { Num } from '@wollybeard/kit'
 *
 * Num.Eq.is(42, 42)           // true
 * Num.Eq.is(3.14, 3.14)       // true
 * Num.Eq.is(0, -0)            // true (positive and negative zero are equal)
 * Num.Eq.is(NaN, NaN)         // false (NaN is never equal to itself)
 * ```
 */
export const Eq = EqTrait.$.implement(domain, {
  is(a, b) {
    return typeof b === 'number' && a === b
  },
})

declare global {
  interface TRAITOR_DOMAINS_Eq {
    Num: typeof Eq
  }
}
