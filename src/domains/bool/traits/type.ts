import { Traitor } from '#traitor'
import { Type as TypeTrait } from '../../../traits/type.js'
import { domain } from '../domain.js'

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
export const Type = Traitor.implement(TypeTrait, domain, {
  is(value) {
    return typeof value === 'boolean'
  },
})
