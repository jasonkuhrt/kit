import { Traitor } from '#traitor'
import { Type as TypeTrait } from '../../../traits/type.ts'
import { domain } from '../domain.ts'

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
export const Type = Traitor.implement(TypeTrait, domain, {
  is(value) {
    return value === null
  },
})
