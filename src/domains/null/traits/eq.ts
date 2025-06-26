import { Eq as EqTrait } from '#Eq'
import { domain } from '../domain.ts'

/**
 * {@link Eq} trait implementation for null.
 *
 * Provides null equality comparison. Since null is a singleton
 * value, this always returns `true` when both values are null.
 *
 * @example
 * ```ts
 * import { Null } from '@wollybeard/kit'
 *
 * Null.Eq.is(null, null)           // true
 * Null.Eq.is(null, undefined)      // false
 * Null.Eq.is(null, 0)              // false
 * ```
 */
export const Eq = EqTrait.$.implement(domain, {
  is(a, b) {
    return b === null
  },
})

declare global {
  interface TRAITOR_DOMAINS_Eq {
    Null: typeof Eq
  }
}
