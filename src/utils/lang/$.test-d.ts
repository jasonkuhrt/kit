import { Ts } from '#ts'

//
// ─── GetRelation (deprecated GetVariance) ──────────────────────────────────────────────────
//

// 'subtype' cases - B is a subtype of A (B extends A)
type _ = Ts.Assert.Cases<
  Ts.Assert.sub.of<'subtype', Ts.Relation.GetRelation<'a' | 'b', 'a'>>,
  Ts.Assert.sub.of<'subtype', Ts.Relation.GetRelation<{ a: 1 }, { a: 1; b: 2 }>>,
  Ts.Assert.sub.of<'subtype', Ts.Relation.GetRelation<unknown, string>>
>

// 'supertype' cases - A is a subtype of B (A extends B)
type _s = Ts.Assert.Cases<
  Ts.Assert.sub.of<'supertype', Ts.Relation.GetRelation<'a', 'a' | 'b'>>,
  Ts.Assert.sub.of<'supertype', Ts.Relation.GetRelation<{ a: 1; b: 2 }, { a: 1 }>>,
  Ts.Assert.sub.of<'supertype', Ts.Relation.GetRelation<string, unknown>>,
  Ts.Assert.sub.of<'supertype', Ts.Relation.GetRelation<42, number>>
>

// 'overlapping' cases - Objects share properties but neither is a subtype
type _so = Ts.Assert.Cases<
  Ts.Assert.sub.of<'overlapping', Ts.Relation.GetRelation<{ a: 1; id: string }, { b: 2; id: string }>>,
  Ts.Assert.sub.of<'overlapping', Ts.Relation.GetRelation<{ x: number; y: number }, { x: number; z: string }>>,
  Ts.Assert.sub.of<
    'overlapping',
    Ts.Relation.GetRelation<{ name: string; age: number }, { name: string; city: string }>
  >
>

// 'equivalent' cases - identical types (both primitive and structure)
type __ = Ts.Assert.Cases<
  Ts.Assert.sub.of<'equivalent', Ts.Relation.GetRelation<any, number>>, // any and number are equivalent
  Ts.Assert.sub.of<'equivalent', Ts.Relation.GetRelation<any, [1]>>, // any and array are equivalent
  // Same primitive types
  Ts.Assert.sub.of<'equivalent', Ts.Relation.GetRelation<string, string>>,
  Ts.Assert.sub.of<'equivalent', Ts.Relation.GetRelation<number, number>>,
  Ts.Assert.sub.of<'equivalent', Ts.Relation.GetRelation<boolean, boolean>>,
  Ts.Assert.sub.of<'equivalent', Ts.Relation.GetRelation<bigint, bigint>>,
  Ts.Assert.sub.of<'equivalent', Ts.Relation.GetRelation<symbol, symbol>>,
  // Same literal primitives
  Ts.Assert.sub.of<'equivalent', Ts.Relation.GetRelation<1, 1>>,
  Ts.Assert.sub.of<'equivalent', Ts.Relation.GetRelation<'hello', 'hello'>>,
  Ts.Assert.sub.of<'equivalent', Ts.Relation.GetRelation<true, true>>,
  Ts.Assert.sub.of<'equivalent', Ts.Relation.GetRelation<false, false>>,
  Ts.Assert.sub.of<'equivalent', Ts.Relation.GetRelation<null, null>>,
  Ts.Assert.sub.of<'equivalent', Ts.Relation.GetRelation<undefined, undefined>>,
  Ts.Assert.sub.of<'equivalent', Ts.Relation.GetRelation<123n, 123n>>,
  // Same object/function types
  Ts.Assert.sub.of<'equivalent', Ts.Relation.GetRelation<{}, {}>>,
  Ts.Assert.sub.of<'equivalent', Ts.Relation.GetRelation<{ a: 1 }, { a: 1 }>>,
  Ts.Assert.sub.of<'equivalent', Ts.Relation.GetRelation<{ a: 1; b: 'x' }, { a: 1; b: 'x' }>>,
  Ts.Assert.sub.of<'equivalent', Ts.Relation.GetRelation<[], []>>,
  Ts.Assert.sub.of<'equivalent', Ts.Relation.GetRelation<[1, 2, 3], [1, 2, 3]>>,
  Ts.Assert.sub.of<'equivalent', Ts.Relation.GetRelation<() => void, () => void>>,
  Ts.Assert.sub.of<'equivalent', Ts.Relation.GetRelation<(x: string) => number, (x: string) => number>>
>

// 'disjoint' cases - types with no intersection
type ____ = Ts.Assert.Cases<
  // Different primitive types
  Ts.Assert.sub.of<'disjoint', Ts.Relation.GetRelation<string, number>>,
  Ts.Assert.sub.of<'disjoint', Ts.Relation.GetRelation<'a', 'b'>>,
  Ts.Assert.sub.of<'disjoint', Ts.Relation.GetRelation<1, 2>>,
  Ts.Assert.sub.of<'disjoint', Ts.Relation.GetRelation<true, false>>,
  Ts.Assert.sub.of<'disjoint', Ts.Relation.GetRelation<string, boolean>>,
  Ts.Assert.sub.of<'disjoint', Ts.Relation.GetRelation<number, null>>,
  // Objects with no shared properties - these have intersection (can be same object with both properties)
  Ts.Assert.sub.of<'overlapping', Ts.Relation.GetRelation<{ a: 1 }, { b: 2 }>>,
  Ts.Assert.sub.of<'overlapping', Ts.Relation.GetRelation<{ x: string }, { y: number }>>,
  Ts.Assert.sub.of<'overlapping', Ts.Relation.GetRelation<{ cat: 'meow' }, { dog: 'bark' }>>,
  // Primitive vs object - TypeScript doesn't reduce these to never
  Ts.Assert.sub.of<'disjoint', Ts.Relation.GetRelation<string, { x: 1 }>>,
  Ts.Assert.sub.of<'disjoint', Ts.Relation.GetRelation<number, { x: 1 }>>,
  Ts.Assert.sub.of<'disjoint', Ts.Relation.GetRelation<boolean, { a: string }>>
>
