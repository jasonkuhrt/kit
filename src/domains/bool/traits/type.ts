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
    Bool: typeof Type
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
 * {@link Type} trait implementation for booleans.
 *
 * Provides type checking for boolean values using typeof.
 *
 * @example
 * ```ts
 * import { Bool } from '@wollybeard/kit'
 *
 * Bool.Type.is(true)         // true
 * Bool.Type.is(false)        // true
 * Bool.Type.is(1)            // false
 * Bool.Type.is('true')       // false
 * ```
 */
export const Type = TypeTrait.$.implement(domain, {
  is(value) {
    return typeof value === 'boolean'
  },
})
