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
    Null: typeof Type
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
 * {@link Type} trait implementation for null.
 *
 * Provides type checking for null values using strict equality (===).
 *
 * @example
 * ```ts
 * import { Null } from '@wollybeard/kit'
 *
 * Null.Type.is(null)        // true
 * Null.Type.is(undefined)   // false
 * Null.Type.is(0)           // false
 * Null.Type.is('')          // false
 * ```
 */
export const Type = TypeTrait.$.implement(domain, {
  is(value) {
    return value === null
  },
})
