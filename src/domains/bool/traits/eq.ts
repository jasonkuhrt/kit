import { Traitor } from '#traitor'
import { Eq as EqTrait } from '../../../traits/eq.js'
import { domain } from '../domain.js'

/**
 * {@link Eq} trait implementation for booleans.
 *
 * Provides boolean equality comparison using strict equality (===).
 *
 * @example
 * ```ts
 * import { Bool } from '@wollybeard/kit'
 *
 * Bool.Eq.is(true, true)     // true
 * Bool.Eq.is(false, false)   // true
 * Bool.Eq.is(true, false)    // false
 * ```
 */
export const Eq = Traitor.implement(EqTrait, domain, {
  is(a, b) {
    return a === b
  },
})
