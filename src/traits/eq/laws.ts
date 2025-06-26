import * as fc from 'fast-check'
import type { Eq } from './eq.ts'

/**
 * Fast-check property tests for Eq trait laws.
 *
 * The Eq trait must satisfy these laws:
 * 1. Reflexivity: eq.is(a, a) === true
 * 2. Symmetry: eq.is(a, b) === eq.is(b, a)
 * 3. Transitivity: if eq.is(a, b) && eq.is(b, c) then eq.is(a, c)
 * 4. Consistency with currying: a.is(x, y) === a.isOn(x)(y)
 */
export const Laws = {
  /**
   * Test reflexivity law: every value equals itself.
   *
   * @param arbitrary - Fast-check arbitrary for the type being tested
   * @param eq - The Eq implementation to test
   */
  reflexivity: <T>(arbitrary: fc.Arbitrary<T>, eq: Eq<T>) => {
    return fc.property(arbitrary, (a) => {
      return eq.is(a, a) === true
    })
  },

  /**
   * Test symmetry law: equality is commutative.
   *
   * @param arbitrary - Fast-check arbitrary for the type being tested
   * @param eq - The Eq implementation to test
   */
  symmetry: <T>(arbitrary: fc.Arbitrary<T>, eq: Eq<T>) => {
    return fc.property(arbitrary, arbitrary, (a, b) => {
      return eq.is(a, b) === eq.is(b, a)
    })
  },

  /**
   * Test transitivity law: if a equals b and b equals c, then a equals c.
   *
   * @param arbitrary - Fast-check arbitrary for the type being tested
   * @param eq - The Eq implementation to test
   */
  transitivity: <T>(arbitrary: fc.Arbitrary<T>, eq: Eq<T>) => {
    return fc.property(arbitrary, arbitrary, arbitrary, (a, b, c) => {
      // Only test when we have equality relationships
      if (eq.is(a, b) && eq.is(b, c)) {
        return eq.is(a, c) === true
      }
      return true // vacuously true when premise is false
    })
  },

  /**
   * Test consistency between is and isOn methods.
   *
   * @param arbitrary - Fast-check arbitrary for the type being tested
   * @param eq - The Eq implementation to test
   */
  curryingConsistency: <T>(arbitrary: fc.Arbitrary<T>, eq: Eq<T>) => {
    return fc.property(arbitrary, arbitrary, (a, b) => {
      return eq.is(a, b) === eq.isOn(a)(b)
    })
  },

  /**
   * Run all Eq laws for a given implementation.
   *
   * @param arbitrary - Fast-check arbitrary for the type being tested
   * @param eq - The Eq implementation to test
   *
   * @example
   * ```ts
   * import { describe, test } from 'vitest'
   * import * as fc from 'fast-check'
   * import { Eq } from '#traits/eq'
   * import { Str } from '#str'
   *
   * describe('Str.Eq laws', () => {
   *   test('satisfies Eq laws', () => {
   *     fc.assert(Laws.all(fc.string(), Str.Eq))
   *   })
   * })
   * ```
   */
  all: <T>(arbitrary: fc.Arbitrary<T>, eq: Eq<T>) => {
    // Test all laws in a single property
    return fc.property(arbitrary, arbitrary, arbitrary, (a, b, c) => {
      // Each law must hold independently

      // Reflexivity: a equals itself
      const reflexive = eq.is(a, a) === true

      // Symmetry: order doesn't matter
      const symmetric = eq.is(a, b) === eq.is(b, a)

      // Transitivity: equality chains
      const transitive = !eq.is(a, b) || !eq.is(b, c) || eq.is(a, c) === true

      // Currying: both forms are equivalent
      const curryConsistent = eq.is(a, b) === eq.isOn(a)(b)

      return reflexive && symmetric && transitive && curryConsistent
    })
  },
}
