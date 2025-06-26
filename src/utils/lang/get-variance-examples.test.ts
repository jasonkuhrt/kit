/**
 * Type-level tests that also serve as documentation examples for GetVariance.
 *
 * This file ensures that the examples in the JSDoc stay accurate by testing them.
 * If these tests fail, the JSDoc examples in language.ts need to be updated.
 *
 * The examples here should match exactly what's shown in the GetVariance JSDoc.
 */

import { expectTypeOf, test } from 'vitest'
import type { GetVariance } from './lang.ts'

test('GetVariance JSDoc examples', () => {
  // These match the examples in the JSDoc - if these fail, update the JSDoc!

  // Bivariant examples
  expectTypeOf<GetVariance<string, string>>().toEqualTypeOf<'bivariant'>()
  expectTypeOf<GetVariance<1, 1>>().toEqualTypeOf<'bivariant'>()
  expectTypeOf<GetVariance<{ a: 1 }, { a: 1 }>>().toEqualTypeOf<'bivariant'>()

  // Disjoint examples
  expectTypeOf<GetVariance<string, number>>().toEqualTypeOf<'disjoint'>()
  expectTypeOf<GetVariance<{ a: 1 }, { b: 2 }>>().toEqualTypeOf<'invariant'>() // Note: This is actually 'invariant', not 'disjoint'!

  // Invariant examples
  expectTypeOf<GetVariance<{ a: 1; id: 1 }, { b: 2; id: 1 }>>().toEqualTypeOf<'invariant'>()

  // Covariant examples (B is narrower than A)
  expectTypeOf<GetVariance<'a' | 'b', 'a'>>().toEqualTypeOf<'covariant'>()

  // Contravariant examples (B is wider than A)
  expectTypeOf<GetVariance<'a', 'a' | 'b'>>().toEqualTypeOf<'contravariant'>()
})

test('GetVariance additional examples for clarity', () => {
  // More covariant examples
  expectTypeOf<GetVariance<string | number, string>>().toEqualTypeOf<'covariant'>()
  expectTypeOf<GetVariance<unknown, string>>().toEqualTypeOf<'covariant'>()
  expectTypeOf<GetVariance<any, string>>().toEqualTypeOf<'bivariant'>() // any is special

  // More contravariant examples
  expectTypeOf<GetVariance<string, string | number>>().toEqualTypeOf<'contravariant'>()
  expectTypeOf<GetVariance<string, unknown>>().toEqualTypeOf<'contravariant'>()
  expectTypeOf<GetVariance<42, number>>().toEqualTypeOf<'contravariant'>()

  // Primitive vs object is always disjoint
  expectTypeOf<GetVariance<string, { x: 1 }>>().toEqualTypeOf<'disjoint'>()
  expectTypeOf<GetVariance<number, []>>().toEqualTypeOf<'disjoint'>()
})
