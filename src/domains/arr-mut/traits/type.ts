import { Type as TypeTrait } from '#Type'
import { domain } from '../domain.ts'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Registration
//
//

declare global {
  interface TRAITOR_DOMAINS_Type {
    ArrMut: typeof Type
  }
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Implementation
//
//

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
export const Type = TypeTrait.$.implement(domain, {
  is(value) {
    return Array.isArray(value)
  },
})
