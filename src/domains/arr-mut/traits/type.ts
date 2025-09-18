import { Traitor } from '#traitor'
import { Type as TypeTrait } from '../../../traits/type.js'
import { domain } from '../domain.js'

/**
 * {@link Type} trait implementation for arrays.
 *
 * Provides type checking for array values using Array.isArray.
 *
 * @example
 * ```ts
 * import { ArrMut } from '@wollybeard/kit'
 *
 * ArrMut.Type.is([1, 2, 3])     // true
 * ArrMut.Type.is([])            // true
 * ArrMut.Type.is('not array')   // false
 * ArrMut.Type.is(null)          // false
 * ```
 */
export const Type = Traitor.implement(TypeTrait, domain, {
  is(value) {
    return Array.isArray(value)
  },
})
