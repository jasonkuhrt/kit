import { Ts } from '#ts'
import { Lang } from './$.js'

//
// ─── GetVariance ──────────────────────────────────────────────────
//

// 'covariant' cases - B is a subtype of A (B extends A)
type _ = Ts.Test<
  Ts.Assert<'covariant', Lang.GetVariance<'a' | 'b', 'a'>>,
  Ts.Assert<'covariant', Lang.GetVariance<{ a: 1 }, { a: 1; b: 2 }>>,
  Ts.Assert<'covariant', Lang.GetVariance<unknown, string>>
>

// 'contravariant' cases - A is a subtype of B (A extends B)
type _s = Ts.Test<
  Ts.Assert<'contravariant', Lang.GetVariance<'a', 'a' | 'b'>>,
  Ts.Assert<'contravariant', Lang.GetVariance<{ a: 1; b: 2 }, { a: 1 }>>,
  Ts.Assert<'contravariant', Lang.GetVariance<string, unknown>>,
  Ts.Assert<'contravariant', Lang.GetVariance<42, number>>
>

// 'invariant' cases - Objects share properties but neither is a subtype
type _so = Ts.Test<
  Ts.Assert<'invariant', Lang.GetVariance<{ a: 1; id: string }, { b: 2; id: string }>>,
  Ts.Assert<'invariant', Lang.GetVariance<{ x: number; y: number }, { x: number; z: string }>>,
  Ts.Assert<'invariant', Lang.GetVariance<{ name: string; age: number }, { name: string; city: string }>>
>

// 'bivariant' cases - identical types (both primitive and structure)
type __ = Ts.Test<
  Ts.Assert<'bivariant', Lang.GetVariance<any, number>>, // any and number are bivariant
  Ts.Assert<'bivariant', Lang.GetVariance<any, [1]>>, // any and array are bivariant
  // Same primitive types
  Ts.Assert<'bivariant', Lang.GetVariance<string, string>>,
  Ts.Assert<'bivariant', Lang.GetVariance<number, number>>,
  Ts.Assert<'bivariant', Lang.GetVariance<boolean, boolean>>,
  Ts.Assert<'bivariant', Lang.GetVariance<bigint, bigint>>,
  Ts.Assert<'bivariant', Lang.GetVariance<symbol, symbol>>,
  // Same literal primitives
  Ts.Assert<'bivariant', Lang.GetVariance<1, 1>>,
  Ts.Assert<'bivariant', Lang.GetVariance<'hello', 'hello'>>,
  Ts.Assert<'bivariant', Lang.GetVariance<true, true>>,
  Ts.Assert<'bivariant', Lang.GetVariance<false, false>>,
  Ts.Assert<'bivariant', Lang.GetVariance<null, null>>,
  Ts.Assert<'bivariant', Lang.GetVariance<undefined, undefined>>,
  Ts.Assert<'bivariant', Lang.GetVariance<123n, 123n>>,
  // Same object/function types
  Ts.Assert<'bivariant', Lang.GetVariance<{}, {}>>,
  Ts.Assert<'bivariant', Lang.GetVariance<{ a: 1 }, { a: 1 }>>,
  Ts.Assert<'bivariant', Lang.GetVariance<{ a: 1; b: 'x' }, { a: 1; b: 'x' }>>,
  Ts.Assert<'bivariant', Lang.GetVariance<[], []>>,
  Ts.Assert<'bivariant', Lang.GetVariance<[1, 2, 3], [1, 2, 3]>>,
  Ts.Assert<'bivariant', Lang.GetVariance<() => void, () => void>>,
  Ts.Assert<'bivariant', Lang.GetVariance<(x: string) => number, (x: string) => number>>
>

// 'disjoint' cases - types with no intersection
type ____ = Ts.Test<
  // Different primitive types
  Ts.Assert<'disjoint', Lang.GetVariance<string, number>>,
  Ts.Assert<'disjoint', Lang.GetVariance<'a', 'b'>>,
  Ts.Assert<'disjoint', Lang.GetVariance<1, 2>>,
  Ts.Assert<'disjoint', Lang.GetVariance<true, false>>,
  Ts.Assert<'disjoint', Lang.GetVariance<string, boolean>>,
  Ts.Assert<'disjoint', Lang.GetVariance<number, null>>,
  // Objects with no shared properties - these have intersection (can be same object with both properties)
  Ts.Assert<'invariant', Lang.GetVariance<{ a: 1 }, { b: 2 }>>,
  Ts.Assert<'invariant', Lang.GetVariance<{ x: string }, { y: number }>>,
  Ts.Assert<'invariant', Lang.GetVariance<{ cat: 'meow' }, { dog: 'bark' }>>,
  // Primitive vs object - TypeScript doesn't reduce these to never
  Ts.Assert<'disjoint', Lang.GetVariance<string, { x: 1 }>>,
  Ts.Assert<'disjoint', Lang.GetVariance<number, { x: 1 }>>,
  Ts.Assert<'disjoint', Lang.GetVariance<boolean, { a: string }>>
>
