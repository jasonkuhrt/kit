import { Eq as EqTrait } from '#Eq'
import { domain } from '../domain.ts'

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
export const Eq = EqTrait.$.implement(domain, {
  is(a, b) {
    return typeof b === 'boolean' && a === b
  },
})

declare global {
  interface TRAITOR_DOMAINS_Eq {
    Bool: typeof Eq
  }
}
