import { Traitor } from '#traitor'
import { Type as TypeTrait } from '../../../traits/type.js'
import { domain } from '../domain.js'

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
 *
 * // Using isnt to narrow away null
 * const value: string | null = getValue()
 * if (Null.Type.isnt(value)) {
 *   value.toUpperCase()  // value is string
 * }
 * ```
 */
export const Type = Traitor.implement(TypeTrait, domain, {
  is(value) {
    return value === null
  },
})
