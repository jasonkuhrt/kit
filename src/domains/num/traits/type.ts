import { Traitor } from '#traitor'
import { Type as TypeTrait } from '../../../traits/type.js'
import { domain } from '../domain.js'

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
export const Type = Traitor.implement(TypeTrait, domain, {
  is(value) {
    return typeof value === 'number'
  },
})
