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
    Arr: typeof Type
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
export const Type = TypeTrait.$.implement(domain, {
  is(value) {
    return Array.isArray(value)
  },
})
