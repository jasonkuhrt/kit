import { Ts } from '#ts'
import { Lang } from './$.js'

//
// ─── GetVariance ──────────────────────────────────────────────────
//

// 'covariant' cases - B is a subtype of A (B extends A)
type _ = Ts.Test.Cases<
  Ts.Test.sub<'covariant', Lang.GetVariance<'a' | 'b', 'a'>>,
  Ts.Test.sub<'covariant', Lang.GetVariance<{ a: 1 }, { a: 1; b: 2 }>>,
  Ts.Test.sub<'covariant', Lang.GetVariance<unknown, string>>
>

// 'contravariant' cases - A is a subtype of B (A extends B)
type _s = Ts.Test.Cases<
  Ts.Test.sub<'contravariant', Lang.GetVariance<'a', 'a' | 'b'>>,
  Ts.Test.sub<'contravariant', Lang.GetVariance<{ a: 1; b: 2 }, { a: 1 }>>,
  Ts.Test.sub<'contravariant', Lang.GetVariance<string, unknown>>,
  Ts.Test.sub<'contravariant', Lang.GetVariance<42, number>>
>

// 'invariant' cases - Objects share properties but neither is a subtype
type _so = Ts.Test.Cases<
  Ts.Test.sub<'invariant', Lang.GetVariance<{ a: 1; id: string }, { b: 2; id: string }>>,
  Ts.Test.sub<'invariant', Lang.GetVariance<{ x: number; y: number }, { x: number; z: string }>>,
  Ts.Test.sub<'invariant', Lang.GetVariance<{ name: string; age: number }, { name: string; city: string }>>
>

// 'bivariant' cases - identical types (both primitive and structure)
type __ = Ts.Test.Cases<
  Ts.Test.sub<'bivariant', Lang.GetVariance<any, number>>, // any and number are bivariant
  Ts.Test.sub<'bivariant', Lang.GetVariance<any, [1]>>, // any and array are bivariant
  // Same primitive types
  Ts.Test.sub<'bivariant', Lang.GetVariance<string, string>>,
  Ts.Test.sub<'bivariant', Lang.GetVariance<number, number>>,
  Ts.Test.sub<'bivariant', Lang.GetVariance<boolean, boolean>>,
  Ts.Test.sub<'bivariant', Lang.GetVariance<bigint, bigint>>,
  Ts.Test.sub<'bivariant', Lang.GetVariance<symbol, symbol>>,
  // Same literal primitives
  Ts.Test.sub<'bivariant', Lang.GetVariance<1, 1>>,
  Ts.Test.sub<'bivariant', Lang.GetVariance<'hello', 'hello'>>,
  Ts.Test.sub<'bivariant', Lang.GetVariance<true, true>>,
  Ts.Test.sub<'bivariant', Lang.GetVariance<false, false>>,
  Ts.Test.sub<'bivariant', Lang.GetVariance<null, null>>,
  Ts.Test.sub<'bivariant', Lang.GetVariance<undefined, undefined>>,
  Ts.Test.sub<'bivariant', Lang.GetVariance<123n, 123n>>,
  // Same object/function types
  Ts.Test.sub<'bivariant', Lang.GetVariance<{}, {}>>,
  Ts.Test.sub<'bivariant', Lang.GetVariance<{ a: 1 }, { a: 1 }>>,
  Ts.Test.sub<'bivariant', Lang.GetVariance<{ a: 1; b: 'x' }, { a: 1; b: 'x' }>>,
  Ts.Test.sub<'bivariant', Lang.GetVariance<[], []>>,
  Ts.Test.sub<'bivariant', Lang.GetVariance<[1, 2, 3], [1, 2, 3]>>,
  Ts.Test.sub<'bivariant', Lang.GetVariance<() => void, () => void>>,
  Ts.Test.sub<'bivariant', Lang.GetVariance<(x: string) => number, (x: string) => number>>
>

// 'disjoint' cases - types with no intersection
type ____ = Ts.Test.Cases<
  // Different primitive types
  Ts.Test.sub<'disjoint', Lang.GetVariance<string, number>>,
  Ts.Test.sub<'disjoint', Lang.GetVariance<'a', 'b'>>,
  Ts.Test.sub<'disjoint', Lang.GetVariance<1, 2>>,
  Ts.Test.sub<'disjoint', Lang.GetVariance<true, false>>,
  Ts.Test.sub<'disjoint', Lang.GetVariance<string, boolean>>,
  Ts.Test.sub<'disjoint', Lang.GetVariance<number, null>>,
  // Objects with no shared properties - these have intersection (can be same object with both properties)
  Ts.Test.sub<'invariant', Lang.GetVariance<{ a: 1 }, { b: 2 }>>,
  Ts.Test.sub<'invariant', Lang.GetVariance<{ x: string }, { y: number }>>,
  Ts.Test.sub<'invariant', Lang.GetVariance<{ cat: 'meow' }, { dog: 'bark' }>>,
  // Primitive vs object - TypeScript doesn't reduce these to never
  Ts.Test.sub<'disjoint', Lang.GetVariance<string, { x: 1 }>>,
  Ts.Test.sub<'disjoint', Lang.GetVariance<number, { x: 1 }>>,
  Ts.Test.sub<'disjoint', Lang.GetVariance<boolean, { a: string }>>
>
