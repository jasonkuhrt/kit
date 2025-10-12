/**
 * Type-level tests that also serve as documentation examples for GetVariance.
 *
 * This file ensures that the examples in the JSDoc stay accurate by testing them.
 * If these tests fail, the JSDoc examples in ts.ts need to be updated.
 *
 * The examples here should match exactly what's shown in the GetVariance JSDoc.
 */

import { Ts } from '#ts'
import { expectTypeOf, test } from 'vitest'

test('GetVariance JSDoc examples', () => {
  // These match the examples in the JSDoc - if these fail, update the JSDoc!

  // Bivariant examples
  expectTypeOf<Ts.GetVariance<string, string>>().toEqualTypeOf<'bivariant'>()
  expectTypeOf<Ts.GetVariance<1, 1>>().toEqualTypeOf<'bivariant'>()
  expectTypeOf<Ts.GetVariance<{ a: 1 }, { a: 1 }>>().toEqualTypeOf<'bivariant'>()

  // Disjoint examples
  expectTypeOf<Ts.GetVariance<string, number>>().toEqualTypeOf<'disjoint'>()
  expectTypeOf<Ts.GetVariance<{ a: 1 }, { b: 2 }>>().toEqualTypeOf<'invariant'>() // Note: This is actually 'invariant', not 'disjoint'!

  // Invariant examples
  expectTypeOf<Ts.GetVariance<{ a: 1; id: 1 }, { b: 2; id: 1 }>>().toEqualTypeOf<'invariant'>()

  // Covariant examples (B is narrower than A)
  expectTypeOf<Ts.GetVariance<'a' | 'b', 'a'>>().toEqualTypeOf<'covariant'>()

  // Contravariant examples (B is wider than A)
  expectTypeOf<Ts.GetVariance<'a', 'a' | 'b'>>().toEqualTypeOf<'contravariant'>()
})

test('GetVariance additional examples for clarity', () => {
  // More covariant examples
  expectTypeOf<Ts.GetVariance<string | number, string>>().toEqualTypeOf<'covariant'>()
  expectTypeOf<Ts.GetVariance<unknown, string>>().toEqualTypeOf<'covariant'>()
  expectTypeOf<Ts.GetVariance<any, string>>().toEqualTypeOf<'bivariant'>() // any is special

  // More contravariant examples
  expectTypeOf<Ts.GetVariance<string, string | number>>().toEqualTypeOf<'contravariant'>()
  expectTypeOf<Ts.GetVariance<string, unknown>>().toEqualTypeOf<'contravariant'>()
  expectTypeOf<Ts.GetVariance<42, number>>().toEqualTypeOf<'contravariant'>()

  // Primitive vs object is always disjoint
  expectTypeOf<Ts.GetVariance<string, { x: 1 }>>().toEqualTypeOf<'disjoint'>()
  expectTypeOf<Ts.GetVariance<number, []>>().toEqualTypeOf<'disjoint'>()
})
