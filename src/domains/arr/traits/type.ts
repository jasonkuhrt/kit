import { Traitor } from '#traitor'
import { Type as TypeTrait } from '../../../traits/type.ts'
import { domain } from '../domain.ts'

/**
 * {@link Type} trait implementation for immutable arrays.
 *
 * Provides type checking for readonly array values using Array.isArray.
 *
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
