import { Traitor } from '#traitor'
import { Eq as EqTrait } from '../../../traits/eq.js'
import { domain } from '../domain.js'

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
export const Eq = Traitor.implement(EqTrait, domain, {
  is(a, b) {
    return a === b
  },
})
