import { Eq as EqTrait } from '#Eq'
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
export const Eq = EqTrait.$.implement(domain, {
  is(a, b) {
    return b === undefined
  },
})

declare global {
  interface TRAITOR_DOMAINS_Eq {
    Undefined: typeof Eq
  }
}
