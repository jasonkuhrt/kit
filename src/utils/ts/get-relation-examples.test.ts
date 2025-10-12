/**
 * Type-level tests that also serve as documentation examples for GetRelation.
 *
 * This file ensures that the examples in the JSDoc stay accurate by testing them.
 * If these tests fail, the JSDoc examples in ts.ts need to be updated.
 *
 * The examples here should match exactly what's shown in the GetRelation JSDoc.
 */

import { Ts } from '#ts'
import { expectTypeOf, test } from 'vitest'

test('GetRelation JSDoc examples', () => {
  // These match the examples in the JSDoc - if these fail, update the JSDoc!

  // Equivalent examples
  expectTypeOf<Ts.GetRelation<string, string>>().toEqualTypeOf<'equivalent'>()
  expectTypeOf<Ts.GetRelation<1, 1>>().toEqualTypeOf<'equivalent'>()
  expectTypeOf<Ts.GetRelation<{ a: 1 }, { a: 1 }>>().toEqualTypeOf<'equivalent'>()

  // Disjoint examples
  expectTypeOf<Ts.GetRelation<string, number>>().toEqualTypeOf<'disjoint'>()
  expectTypeOf<Ts.GetRelation<{ a: 1 }, { b: 2 }>>().toEqualTypeOf<'overlapping'>() // Note: This is actually 'overlapping', not 'disjoint'!

  // Overlapping examples
  expectTypeOf<Ts.GetRelation<{ a: 1; id: 1 }, { b: 2; id: 1 }>>().toEqualTypeOf<'overlapping'>()

  // Subtype examples (B is narrower than A)
  expectTypeOf<Ts.GetRelation<'a' | 'b', 'a'>>().toEqualTypeOf<'subtype'>()

  // Supertype examples (B is wider than A)
  expectTypeOf<Ts.GetRelation<'a', 'a' | 'b'>>().toEqualTypeOf<'supertype'>()
})

test('GetRelation additional examples for clarity', () => {
  // More subtype examples
  expectTypeOf<Ts.GetRelation<string | number, string>>().toEqualTypeOf<'subtype'>()
  expectTypeOf<Ts.GetRelation<unknown, string>>().toEqualTypeOf<'subtype'>()
  expectTypeOf<Ts.GetRelation<any, string>>().toEqualTypeOf<'equivalent'>() // any is special

  // More supertype examples
  expectTypeOf<Ts.GetRelation<string, string | number>>().toEqualTypeOf<'supertype'>()
  expectTypeOf<Ts.GetRelation<string, unknown>>().toEqualTypeOf<'supertype'>()
  expectTypeOf<Ts.GetRelation<42, number>>().toEqualTypeOf<'supertype'>()

  // Primitive vs object is always disjoint
  expectTypeOf<Ts.GetRelation<string, { x: 1 }>>().toEqualTypeOf<'disjoint'>()
  expectTypeOf<Ts.GetRelation<number, []>>().toEqualTypeOf<'disjoint'>()
})

test('GetVariance deprecated alias still works', () => {
  // Test that the deprecated alias still functions
  expectTypeOf<Ts.GetVariance<string, string>>().toEqualTypeOf<'equivalent'>()
  expectTypeOf<Ts.GetVariance<'a' | 'b', 'a'>>().toEqualTypeOf<'subtype'>()
})
