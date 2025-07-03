import { Traitor } from '#traitor'
import { Eq as EqTrait } from '../../../traits/eq.ts'
import { domain } from '../domain.ts'

/**
 * {@link Eq} trait implementation for objects.
 *
 * Provides deep structural equality for objects by recursively
 * comparing properties using their appropriate Eq implementations.
 *
 * @example
 * ```ts
 * import { Obj } from '@wollybeard/kit'
 *
 * // Basic object equality
 * Obj.Eq.is({ a: 1, b: 2 }, { a: 1, b: 2 }) // true
 * Obj.Eq.is({ a: 1, b: 2 }, { a: 1, b: 3 }) // false
 * Obj.Eq.is({ a: 1 }, { a: 1, b: 2 }) // false (different keys)
 *
 * // Nested objects
 * Obj.Eq.is(
 *   { a: 1, b: { c: 2 } },
 *   { a: 1, b: { c: 2 } }
 * ) // true
 *
 * // Mixed types in properties
 * Obj.Eq.is(
 *   { a: 1, b: 'hello', c: true },
 *   { a: 1, b: 'hello', c: true }
 * ) // true
 * ```
 */
export const Eq = Traitor.implement(EqTrait, domain, {
  is(a, b) {
    // Type checking handled by base, both a and b are objects
    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)

    // Different number of keys means not equal
    if (aKeys.length !== bKeys.length) return false

    // Check all keys exist in both objects and values are equal
    for (const key of aKeys) {
      if (!(key in b)) return false
      // Use polymorphic dispatch for value comparison
      if (!EqTrait.is((a as any)[key], (b as any)[key])) return false
    }

    return true
  },
})
