/**
 * Type-level tests that also serve as documentation examples for GetRelation.
 *
 * This file ensures that the examples in the JSDoc stay accurate by testing them.
 * If these tests fail, the JSDoc examples in ts.ts need to be updated.
 *
 * The examples here should match exactly what's shown in the GetRelation JSDoc.
 */

import { Ts } from '#ts'
import { test } from 'vitest'

const A = Ts.Assert.exact.ofAs

test('GetRelation JSDoc examples', () => {
  // These match the examples in the JSDoc - if these fail, update the JSDoc!

  // Equivalent examples
  Ts.Assert.exact.ofAs<'equivalent'>().onAs<Ts.Relation.GetRelation<string, string>>()
  Ts.Assert.exact.ofAs<'equivalent'>().onAs<Ts.Relation.GetRelation<1, 1>>()
  Ts.Assert.exact.ofAs<'equivalent'>().onAs<Ts.Relation.GetRelation<{ a: 1 }, { a: 1 }>>()

  // Disjoint examples
  Ts.Assert.exact.ofAs<'disjoint'>().onAs<Ts.Relation.GetRelation<string, number>>()
  Ts.Assert.exact.ofAs<'overlapping'>().onAs<Ts.Relation.GetRelation<{ a: 1 }, { b: 2 }>>() // Note: This is actually 'overlapping', not 'disjoint'!

  // Overlapping examples
  Ts.Assert.exact.ofAs<'overlapping'>().onAs<Ts.Relation.GetRelation<{ a: 1; id: 1 }, { b: 2; id: 1 }>>()

  // Subtype examples (B is narrower than A)
  Ts.Assert.exact.ofAs<'subtype'>().onAs<Ts.Relation.GetRelation<'a' | 'b', 'a'>>()

  // Supertype examples (B is wider than A)
  Ts.Assert.exact.ofAs<'supertype'>().onAs<Ts.Relation.GetRelation<'a', 'a' | 'b'>>()
})

test('GetRelation additional examples for clarity', () => {
  // More subtype examples
  Ts.Assert.exact.ofAs<'subtype'>().onAs<Ts.Relation.GetRelation<string | number, string>>()
  Ts.Assert.exact.ofAs<'subtype'>().onAs<Ts.Relation.GetRelation<unknown, string>>()
  Ts.Assert.exact.ofAs<'equivalent'>().onAs<Ts.Relation.GetRelation<any, string>>() // any is special

  // More supertype examples
  Ts.Assert.exact.ofAs<'supertype'>().onAs<Ts.Relation.GetRelation<string, string | number>>()
  Ts.Assert.exact.ofAs<'supertype'>().onAs<Ts.Relation.GetRelation<string, unknown>>()
  Ts.Assert.exact.ofAs<'supertype'>().onAs<Ts.Relation.GetRelation<42, number>>()

  // Primitive vs object is always disjoint
  Ts.Assert.exact.ofAs<'disjoint'>().onAs<Ts.Relation.GetRelation<string, { x: 1 }>>()
  Ts.Assert.exact.ofAs<'disjoint'>().onAs<Ts.Relation.GetRelation<number, []>>()
})
