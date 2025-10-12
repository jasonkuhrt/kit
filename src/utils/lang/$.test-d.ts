import { Ts } from '#ts'
import { Lang } from './$.js'

//
// ─── GetRelation (deprecated GetVariance) ──────────────────────────────────────────────────
//

// 'subtype' cases - B is a subtype of A (B extends A)
type _ = Ts.Test.Cases<
  Ts.Test.sub<'subtype', Ts.GetRelation<'a' | 'b', 'a'>>,
  Ts.Test.sub<'subtype', Ts.GetRelation<{ a: 1 }, { a: 1; b: 2 }>>,
  Ts.Test.sub<'subtype', Ts.GetRelation<unknown, string>>
>

// 'supertype' cases - A is a subtype of B (A extends B)
type _s = Ts.Test.Cases<
  Ts.Test.sub<'supertype', Ts.GetRelation<'a', 'a' | 'b'>>,
  Ts.Test.sub<'supertype', Ts.GetRelation<{ a: 1; b: 2 }, { a: 1 }>>,
  Ts.Test.sub<'supertype', Ts.GetRelation<string, unknown>>,
  Ts.Test.sub<'supertype', Ts.GetRelation<42, number>>
>

// 'overlapping' cases - Objects share properties but neither is a subtype
type _so = Ts.Test.Cases<
  Ts.Test.sub<'overlapping', Ts.GetRelation<{ a: 1; id: string }, { b: 2; id: string }>>,
  Ts.Test.sub<'overlapping', Ts.GetRelation<{ x: number; y: number }, { x: number; z: string }>>,
  Ts.Test.sub<'overlapping', Ts.GetRelation<{ name: string; age: number }, { name: string; city: string }>>
>

// 'equivalent' cases - identical types (both primitive and structure)
type __ = Ts.Test.Cases<
  Ts.Test.sub<'equivalent', Ts.GetRelation<any, number>>, // any and number are equivalent
  Ts.Test.sub<'equivalent', Ts.GetRelation<any, [1]>>, // any and array are equivalent
  // Same primitive types
  Ts.Test.sub<'equivalent', Ts.GetRelation<string, string>>,
  Ts.Test.sub<'equivalent', Ts.GetRelation<number, number>>,
  Ts.Test.sub<'equivalent', Ts.GetRelation<boolean, boolean>>,
  Ts.Test.sub<'equivalent', Ts.GetRelation<bigint, bigint>>,
  Ts.Test.sub<'equivalent', Ts.GetRelation<symbol, symbol>>,
  // Same literal primitives
  Ts.Test.sub<'equivalent', Ts.GetRelation<1, 1>>,
  Ts.Test.sub<'equivalent', Ts.GetRelation<'hello', 'hello'>>,
  Ts.Test.sub<'equivalent', Ts.GetRelation<true, true>>,
  Ts.Test.sub<'equivalent', Ts.GetRelation<false, false>>,
  Ts.Test.sub<'equivalent', Ts.GetRelation<null, null>>,
  Ts.Test.sub<'equivalent', Ts.GetRelation<undefined, undefined>>,
  Ts.Test.sub<'equivalent', Ts.GetRelation<123n, 123n>>,
  // Same object/function types
  Ts.Test.sub<'equivalent', Ts.GetRelation<{}, {}>>,
  Ts.Test.sub<'equivalent', Ts.GetRelation<{ a: 1 }, { a: 1 }>>,
  Ts.Test.sub<'equivalent', Ts.GetRelation<{ a: 1; b: 'x' }, { a: 1; b: 'x' }>>,
  Ts.Test.sub<'equivalent', Ts.GetRelation<[], []>>,
  Ts.Test.sub<'equivalent', Ts.GetRelation<[1, 2, 3], [1, 2, 3]>>,
  Ts.Test.sub<'equivalent', Ts.GetRelation<() => void, () => void>>,
  Ts.Test.sub<'equivalent', Ts.GetRelation<(x: string) => number, (x: string) => number>>
>

// 'disjoint' cases - types with no intersection
type ____ = Ts.Test.Cases<
  // Different primitive types
  Ts.Test.sub<'disjoint', Ts.GetRelation<string, number>>,
  Ts.Test.sub<'disjoint', Ts.GetRelation<'a', 'b'>>,
  Ts.Test.sub<'disjoint', Ts.GetRelation<1, 2>>,
  Ts.Test.sub<'disjoint', Ts.GetRelation<true, false>>,
  Ts.Test.sub<'disjoint', Ts.GetRelation<string, boolean>>,
  Ts.Test.sub<'disjoint', Ts.GetRelation<number, null>>,
  // Objects with no shared properties - these have intersection (can be same object with both properties)
  Ts.Test.sub<'overlapping', Ts.GetRelation<{ a: 1 }, { b: 2 }>>,
  Ts.Test.sub<'overlapping', Ts.GetRelation<{ x: string }, { y: number }>>,
  Ts.Test.sub<'overlapping', Ts.GetRelation<{ cat: 'meow' }, { dog: 'bark' }>>,
  // Primitive vs object - TypeScript doesn't reduce these to never
  Ts.Test.sub<'disjoint', Ts.GetRelation<string, { x: 1 }>>,
  Ts.Test.sub<'disjoint', Ts.GetRelation<number, { x: 1 }>>,
  Ts.Test.sub<'disjoint', Ts.GetRelation<boolean, { a: string }>>
>
