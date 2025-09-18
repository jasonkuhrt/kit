import { Traitor } from '#traitor'
import { Type as TypeTrait } from '../../../traits/type.js'
import { domain } from '../domain.js'

/**
 * {@link Type} trait implementation for undefined.
 *
 * Provides type checking for undefined values using strict equality (===).
 *
 * @example
 * ```ts
 * import { Undefined } from '@wollybeard/kit'
 *
 * Undefined.Type.is(undefined)   // true
 * Undefined.Type.is(null)        // false
 * Undefined.Type.is(0)           // false
 * Undefined.Type.is('')          // false
 * ```
 */
export const Type = Traitor.implement(TypeTrait, domain, {
  is(value) {
    return value === undefined
  },
})
