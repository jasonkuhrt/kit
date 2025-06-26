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
    Num: typeof Type
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
 * {@link Type} trait implementation for numbers.
 *
 * Provides type checking for number values using typeof.
 *
 * @example
 * ```ts
 * import { Num } from '@wollybeard/kit'
 *
 * Num.Type.is(42)            // true
 * Num.Type.is(3.14)          // true
 * Num.Type.is(NaN)           // true (NaN is a number)
 * Num.Type.is('42')          // false
 * ```
 */
export const Type = TypeTrait.$.implement(domain, {
  is(value) {
    return typeof value === 'number'
  },
})
