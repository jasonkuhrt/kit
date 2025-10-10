import { Traitor } from '#traitor'
import { Type as TypeTrait } from '../../../traits/type.js'
import { domain } from '../domain.js'

/**
 * {@link Type} trait implementation for immutable arrays.
 *
 * Provides type checking for readonly array values using Array.isArray.
 *
 * @category Traits
 * @example
 * ```ts
 * import { Arr } from '@wollybeard/kit'
 *
 * Arr.Type.is([1, 2, 3])     // true
 * Arr.Type.is([])            // true
 * Arr.Type.is('not array')   // false
 * Arr.Type.is(null)          // false
 * ```
 */
export const Type = Traitor.implement(TypeTrait, domain, {
  is(value) {
    return Array.isArray(value)
  },
})
