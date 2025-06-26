import { Eq as EqTrait } from '#Eq'
import { domain } from '../domain.ts'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Registration
//
//

declare global {
  interface TRAITOR_DOMAINS_Eq {
    Str: typeof Eq
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
 * {@link Eq} trait implementation for strings.
 *
 * Provides string equality comparison using strict equality (===).
 * String comparison is case-sensitive and considers all Unicode characters.
 *
 * @example
 * ```ts
 * import { Str } from '@wollybeard/kit'
 *
 * Str.Eq.is('hello', 'hello')     // true
 * Str.Eq.is('hello', 'Hello')     // false (case-sensitive)
 * Str.Eq.is('', '')               // true (empty strings)
 * ```
 */
export const Eq = EqTrait.$.implement(domain, {
  is(a, b) {
    // Type checking handled by base, both a and b are strings
    return a === b
  },
})
