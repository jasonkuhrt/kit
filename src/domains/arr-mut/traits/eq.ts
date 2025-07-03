import { Traitor } from '#traitor'
import { Eq as EqTrait } from '../../../traits/eq.ts'
import { domain } from '../domain.ts'

/**
 * {@link Eq} trait implementation for arrays.
 *
 * Provides deep structural equality for arrays by recursively
 * comparing elements using their appropriate Eq implementations.
 *
 * @example
 * ```ts
 * import { ArrMut } from '@wollybeard/kit'
 *
 * // Basic array equality
 * ArrMut.Eq.is([1, 2, 3], [1, 2, 3]) // true
 * ArrMut.Eq.is([1, 2, 3], [1, 2, 4]) // false
 * ArrMut.Eq.is([1, 2], [1, 2, 3]) // false (different lengths)
 *
 * // Nested arrays
 * ArrMut.Eq.is([[1, 2], [3, 4]], [[1, 2], [3, 4]]) // true
 *
 * // Mixed types
 * ArrMut.Eq.is([1, 'hello', true], [1, 'hello', true]) // true
 * ```
 */
export const Eq = Traitor.implement(EqTrait, domain, {
  is(a, b) {
    // Type checking handled by base, both a and b are arrays
    if (a.length !== b.length) return false

    // Compare each element using polymorphic Eq
    for (let i = 0; i < a.length; i++) {
      // Use polymorphic dispatch for element comparison
      if (!EqTrait.is(a[i]!, b[i]!)) return false
    }

    return true
  },
})
