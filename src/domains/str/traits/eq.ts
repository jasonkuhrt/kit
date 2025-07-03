import { Traitor } from '#traitor'
import { Eq as EqTrait } from '../../../traits/eq.ts'
import { domain } from '../domain.ts'

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
export const Eq = Traitor.implement(EqTrait, domain, {
  is(a, b) {
    return a === b
  },
})
