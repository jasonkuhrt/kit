import { Traitor } from '#traitor'
import { Type as TypeTrait } from '../../../traits/type.js'
import { domain } from '../domain.js'

/**
 * {@link Type} trait implementation for strings.
 *
 * Provides type guard for checking if a value is a string.
 * @category Traits
 * @example
 * ```ts
 * import { Str } from '@wollybeard/kit'
 *
 * Str.Type.is('hello')    // true
 * Str.Type.is(123)        // false
 * Str.Type.is(null)       // false
 * ```
 */
export const Type = Traitor.implement(TypeTrait, domain, {
  is(value) {
    return typeof value === 'string'
  },
})
