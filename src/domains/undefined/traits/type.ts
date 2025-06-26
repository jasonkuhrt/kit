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
    Undefined: typeof Type
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
export const Type = TypeTrait.$.implement(domain, {
  is(value) {
    return value === undefined
  },
})
