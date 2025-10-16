import { Ts } from '#ts'
import { Lang } from './$.js'

//
// ─── GetRelation (deprecated GetVariance) ──────────────────────────────────────────────────
//

// 'subtype' cases - B is a subtype of A (B extends A)
type _ = Ts.Test.Cases<
  Ts.Test.sub<'subtype', Ts.Relation.GetRelation<'a' | 'b', 'a'>>,
  Ts.Test.sub<'subtype', Ts.Relation.GetRelation<{ a: 1 }, { a: 1; b: 2 }>>,
  Ts.Test.sub<'subtype', Ts.Relation.GetRelation<unknown, string>>
>

// 'supertype' cases - A is a subtype of B (A extends B)
type _s = Ts.Test.Cases<
  Ts.Test.sub<'supertype', Ts.Relation.GetRelation<'a', 'a' | 'b'>>,
  Ts.Test.sub<'supertype', Ts.Relation.GetRelation<{ a: 1; b: 2 }, { a: 1 }>>,
  Ts.Test.sub<'supertype', Ts.Relation.GetRelation<string, unknown>>,
  Ts.Test.sub<'supertype', Ts.Relation.GetRelation<42, number>>
>

// 'overlapping' cases - Objects share properties but neither is a subtype
type _so = Ts.Test.Cases<
  Ts.Test.sub<'overlapping', Ts.Relation.GetRelation<{ a: 1; id: string }, { b: 2; id: string }>>,
  Ts.Test.sub<'overlapping', Ts.Relation.GetRelation<{ x: number; y: number }, { x: number; z: string }>>,
  Ts.Test.sub<'overlapping', Ts.Relation.GetRelation<{ name: string; age: number }, { name: string; city: string }>>
>

// 'equivalent' cases - identical types (both primitive and structure)
type __ = Ts.Test.Cases<
  Ts.Test.sub<'equivalent', Ts.Relation.GetRelation<any, number>>, // any and number are equivalent
  Ts.Test.sub<'equivalent', Ts.Relation.GetRelation<any, [1]>>, // any and array are equivalent
  // Same primitive types
  Ts.Test.sub<'equivalent', Ts.Relation.GetRelation<string, string>>,
  Ts.Test.sub<'equivalent', Ts.Relation.GetRelation<number, number>>,
  Ts.Test.sub<'equivalent', Ts.Relation.GetRelation<boolean, boolean>>,
  Ts.Test.sub<'equivalent', Ts.Relation.GetRelation<bigint, bigint>>,
  Ts.Test.sub<'equivalent', Ts.Relation.GetRelation<symbol, symbol>>,
  // Same literal primitives
  Ts.Test.sub<'equivalent', Ts.Relation.GetRelation<1, 1>>,
  Ts.Test.sub<'equivalent', Ts.Relation.GetRelation<'hello', 'hello'>>,
  Ts.Test.sub<'equivalent', Ts.Relation.GetRelation<true, true>>,
  Ts.Test.sub<'equivalent', Ts.Relation.GetRelation<false, false>>,
  Ts.Test.sub<'equivalent', Ts.Relation.GetRelation<null, null>>,
  Ts.Test.sub<'equivalent', Ts.Relation.GetRelation<undefined, undefined>>,
  Ts.Test.sub<'equivalent', Ts.Relation.GetRelation<123n, 123n>>,
  // Same object/function types
  Ts.Test.sub<'equivalent', Ts.Relation.GetRelation<{}, {}>>,
  Ts.Test.sub<'equivalent', Ts.Relation.GetRelation<{ a: 1 }, { a: 1 }>>,
  Ts.Test.sub<'equivalent', Ts.Relation.GetRelation<{ a: 1; b: 'x' }, { a: 1; b: 'x' }>>,
  Ts.Test.sub<'equivalent', Ts.Relation.GetRelation<[], []>>,
  Ts.Test.sub<'equivalent', Ts.Relation.GetRelation<[1, 2, 3], [1, 2, 3]>>,
  Ts.Test.sub<'equivalent', Ts.Relation.GetRelation<() => void, () => void>>,
  Ts.Test.sub<'equivalent', Ts.Relation.GetRelation<(x: string) => number, (x: string) => number>>
>

// 'disjoint' cases - types with no intersection
type ____ = Ts.Test.Cases<
  // Different primitive types
  Ts.Test.sub<'disjoint', Ts.Relation.GetRelation<string, number>>,
  Ts.Test.sub<'disjoint', Ts.Relation.GetRelation<'a', 'b'>>,
  Ts.Test.sub<'disjoint', Ts.Relation.GetRelation<1, 2>>,
  Ts.Test.sub<'disjoint', Ts.Relation.GetRelation<true, false>>,
  Ts.Test.sub<'disjoint', Ts.Relation.GetRelation<string, boolean>>,
  Ts.Test.sub<'disjoint', Ts.Relation.GetRelation<number, null>>,
  // Objects with no shared properties - these have intersection (can be same object with both properties)
  Ts.Test.sub<'overlapping', Ts.Relation.GetRelation<{ a: 1 }, { b: 2 }>>,
  Ts.Test.sub<'overlapping', Ts.Relation.GetRelation<{ x: string }, { y: number }>>,
  Ts.Test.sub<'overlapping', Ts.Relation.GetRelation<{ cat: 'meow' }, { dog: 'bark' }>>,
  // Primitive vs object - TypeScript doesn't reduce these to never
  Ts.Test.sub<'disjoint', Ts.Relation.GetRelation<string, { x: 1 }>>,
  Ts.Test.sub<'disjoint', Ts.Relation.GetRelation<number, { x: 1 }>>,
  Ts.Test.sub<'disjoint', Ts.Relation.GetRelation<boolean, { a: string }>>
>
