import { Traitor } from '#traitor'
import { Eq as EqTrait } from '../../../traits/eq.js'
import { domain } from '../domain.js'

/**
 * {@link Eq} trait implementation for immutable arrays.
 *
 * Provides deep structural equality for readonly arrays by recursively
 * comparing elements using their appropriate Eq implementations.
 *
 * @example
 * ```ts
 * import { Arr } from '@wollybeard/kit'
 *
 * // Basic array equality
 * Arr.Eq.is([1, 2, 3], [1, 2, 3]) // true
 * Arr.Eq.is([1, 2, 3], [1, 2, 4]) // false
 * Arr.Eq.is([1, 2], [1, 2, 3]) // false (different lengths)
 *
 * // Nested arrays
 * Arr.Eq.is(
 *   [[1, 2], [3, 4]],
 *   [[1, 2], [3, 4]]
 * ) // true
 *
 * // Mixed types
 * Arr.Eq.is(
 *   [1, 'hello', true],
 *   [1, 'hello', true]
 * ) // true
 * ```
 */
export const Eq = Traitor.implement(EqTrait, domain, {
  is(a, b) {
    // Type checking handled by base, both a and b are arrays
    if (a.length !== b.length) return false

    for (let i = 0; i < a.length; i++) {
      if (!EqTrait.is(a[i]!, b[i]!)) return false
    }

    return true
  },
})
