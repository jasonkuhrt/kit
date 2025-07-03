import { Traitor } from '#traitor'
import { Eq as EqTrait } from '../../../traits/eq.ts'
import { domain } from '../domain.ts'

/**
 * {@link Eq} trait implementation for undefined.
 *
 * Provides undefined equality comparison. Since undefined is a singleton
 * value, this always returns `true`.
 *
 * @example
 * ```ts
 * import { Undefined } from '@wollybeard/kit'
 *
 * Undefined.Eq.is(undefined, undefined)   // true
 * ```
 */
export const Eq = Traitor.implement(EqTrait, domain, {
  is(a, b) {
    return a === b
  },
})
