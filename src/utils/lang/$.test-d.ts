import { Ts } from '#ts'
import { Lang } from './$.js'

//
// ─── GetVariance ──────────────────────────────────────────────────
//

// 'covariant' cases - B is a subtype of A (B extends A)
type _ = Ts.Test.Cases<
  Ts.Test.sub<'covariant', Ts.GetVariance<'a' | 'b', 'a'>>,
  Ts.Test.sub<'covariant', Ts.GetVariance<{ a: 1 }, { a: 1; b: 2 }>>,
  Ts.Test.sub<'covariant', Ts.GetVariance<unknown, string>>
>

// 'contravariant' cases - A is a subtype of B (A extends B)
type _s = Ts.Test.Cases<
  Ts.Test.sub<'contravariant', Ts.GetVariance<'a', 'a' | 'b'>>,
  Ts.Test.sub<'contravariant', Ts.GetVariance<{ a: 1; b: 2 }, { a: 1 }>>,
  Ts.Test.sub<'contravariant', Ts.GetVariance<string, unknown>>,
  Ts.Test.sub<'contravariant', Ts.GetVariance<42, number>>
>

// 'invariant' cases - Objects share properties but neither is a subtype
type _so = Ts.Test.Cases<
  Ts.Test.sub<'invariant', Ts.GetVariance<{ a: 1; id: string }, { b: 2; id: string }>>,
  Ts.Test.sub<'invariant', Ts.GetVariance<{ x: number; y: number }, { x: number; z: string }>>,
  Ts.Test.sub<'invariant', Ts.GetVariance<{ name: string; age: number }, { name: string; city: string }>>
>

// 'bivariant' cases - identical types (both primitive and structure)
type __ = Ts.Test.Cases<
  Ts.Test.sub<'bivariant', Ts.GetVariance<any, number>>, // any and number are bivariant
  Ts.Test.sub<'bivariant', Ts.GetVariance<any, [1]>>, // any and array are bivariant
  // Same primitive types
  Ts.Test.sub<'bivariant', Ts.GetVariance<string, string>>,
  Ts.Test.sub<'bivariant', Ts.GetVariance<number, number>>,
  Ts.Test.sub<'bivariant', Ts.GetVariance<boolean, boolean>>,
  Ts.Test.sub<'bivariant', Ts.GetVariance<bigint, bigint>>,
  Ts.Test.sub<'bivariant', Ts.GetVariance<symbol, symbol>>,
  // Same literal primitives
  Ts.Test.sub<'bivariant', Ts.GetVariance<1, 1>>,
  Ts.Test.sub<'bivariant', Ts.GetVariance<'hello', 'hello'>>,
  Ts.Test.sub<'bivariant', Ts.GetVariance<true, true>>,
  Ts.Test.sub<'bivariant', Ts.GetVariance<false, false>>,
  Ts.Test.sub<'bivariant', Ts.GetVariance<null, null>>,
  Ts.Test.sub<'bivariant', Ts.GetVariance<undefined, undefined>>,
  Ts.Test.sub<'bivariant', Ts.GetVariance<123n, 123n>>,
  // Same object/function types
  Ts.Test.sub<'bivariant', Ts.GetVariance<{}, {}>>,
  Ts.Test.sub<'bivariant', Ts.GetVariance<{ a: 1 }, { a: 1 }>>,
  Ts.Test.sub<'bivariant', Ts.GetVariance<{ a: 1; b: 'x' }, { a: 1; b: 'x' }>>,
  Ts.Test.sub<'bivariant', Ts.GetVariance<[], []>>,
  Ts.Test.sub<'bivariant', Ts.GetVariance<[1, 2, 3], [1, 2, 3]>>,
  Ts.Test.sub<'bivariant', Ts.GetVariance<() => void, () => void>>,
  Ts.Test.sub<'bivariant', Ts.GetVariance<(x: string) => number, (x: string) => number>>
>

// 'disjoint' cases - types with no intersection
type ____ = Ts.Test.Cases<
  // Different primitive types
  Ts.Test.sub<'disjoint', Ts.GetVariance<string, number>>,
  Ts.Test.sub<'disjoint', Ts.GetVariance<'a', 'b'>>,
  Ts.Test.sub<'disjoint', Ts.GetVariance<1, 2>>,
  Ts.Test.sub<'disjoint', Ts.GetVariance<true, false>>,
  Ts.Test.sub<'disjoint', Ts.GetVariance<string, boolean>>,
  Ts.Test.sub<'disjoint', Ts.GetVariance<number, null>>,
  // Objects with no shared properties - these have intersection (can be same object with both properties)
  Ts.Test.sub<'invariant', Ts.GetVariance<{ a: 1 }, { b: 2 }>>,
  Ts.Test.sub<'invariant', Ts.GetVariance<{ x: string }, { y: number }>>,
  Ts.Test.sub<'invariant', Ts.GetVariance<{ cat: 'meow' }, { dog: 'bark' }>>,
  // Primitive vs object - TypeScript doesn't reduce these to never
  Ts.Test.sub<'disjoint', Ts.GetVariance<string, { x: 1 }>>,
  Ts.Test.sub<'disjoint', Ts.GetVariance<number, { x: 1 }>>,
  Ts.Test.sub<'disjoint', Ts.GetVariance<boolean, { a: string }>>
>
