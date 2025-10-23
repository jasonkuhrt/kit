import type { E } from '#deps/effect'
import { Ts } from '#ts'
import type * as Simplify from './simplify.js'

// Top - flattens one level
type _top = Ts.Assert.Cases<
  Ts.Assert.exact<{ a: string; b: number }, Simplify.Top<{ a: string } & { b: number }>>,
  Ts.Assert.exact<{ a: 1; b: { c: 2 } & { d: 3 } }, Simplify.Top<{ a: 1 } & { b: { c: 2 } & { d: 3 } }>>
>

// All - flattens all levels
type _all = Ts.Assert.Cases<
  Ts.Assert.exact<{ a: 1; b: { c: 2; d: 3 } }, Simplify.All<{ a: 1 } & { b: { c: 2 } & { d: 3 } }>>,
  Ts.Assert.exact<
    { created: Date; nested: { pattern: RegExp } },
    Simplify.All<{ created: Date; nested: { pattern: RegExp } }>
  >
>

// To - specific depths
type _to_depths = Ts.Assert.Cases<
  // Invalid Depth
  // @ts-expect-error
  Ts.Assert.exact<{}, Simplify.To<99, {}>>,
  // Depth 0 - no change
  Ts.Assert.exact<{ a: 1 } & { b: 2 }, Simplify.To<0, { a: 1 } & { b: 2 }>>,
  // Depth 1 - one level
  Ts.Assert.exact<{ a: 1; b: 2 }, Simplify.To<1, { a: 1 } & { b: 2 }>>,
  // Depth 2 - two levels
  Ts.Assert.exact<{ a: 1; b: { c: 2; d: 3 } }, Simplify.To<2, { a: 1 } & { b: { c: 2 } & { d: 3 } }>>
>

// All - traverses generic containers
type _all_containers = Ts.Assert.Cases<
  Ts.Assert.exact<Map<{ a: 1; b: 2 }, string>, Simplify.All<Map<{ a: 1 } & { b: 2 }, string>>>,
  Ts.Assert.exact<Set<{ a: 1; b: 2 }>, Simplify.All<Set<{ a: 1 } & { b: 2 }>>>,
  Ts.Assert.exact<Promise<{ a: 1; b: 2 }>, Simplify.All<Promise<{ a: 1 } & { b: 2 }>>>,
  Ts.Assert.exact<Array<{ a: 1; b: 2 }>, Simplify.All<Array<{ a: 1 } & { b: 2 }>>>
>

// All - traverses Effect types
type _all_effect = Ts.Assert.Cases<
  Ts.Assert.exact<
    E.Effect<{ a: 1; b: 2 }, { c: 3; d: 4 }, { e: 5; f: 6 }>,
    Simplify.All<E.Effect<{ a: 1 } & { b: 2 }, { c: 3 } & { d: 4 }, { e: 5 } & { f: 6 }>>
  >
>

// Distribution handles nullable unions automatically
type _nullable = Ts.Assert.Cases<
  // Top level nullable with intersection
  Ts.Assert.exact<{ a: 1; b: 2 } | null, Simplify.Top<({ a: 1 } & { b: 2 }) | null>>,
  Ts.Assert.exact<{ a: 1; b: 2 } | undefined, Simplify.Top<({ a: 1 } & { b: 2 }) | undefined>>,
  Ts.Assert.exact<{ a: 1; b: 2 } | null | undefined, Simplify.Top<({ a: 1 } & { b: 2 }) | null | undefined>>,
  // Deep nullable - nested intersection with null
  Ts.Assert.exact<{ a: 1; b: { c: 2; d: 3 } | null }, Simplify.All<{ a: 1 } & { b: ({ c: 2 } & { d: 3 }) | null }>>,
  // All levels nullable - entire type is nullable
  Ts.Assert.exact<{ a: 1; b: { c: 2; d: 3 } } | null, Simplify.All<({ a: 1 } & { b: { c: 2 } & { d: 3 } }) | null>>
>

// Complete container coverage - all supported generic types
type _containers_complete = Ts.Assert.Cases<
  // Standard collections
  Ts.Assert.exact<Array<{ a: 1; b: 2 }>, Simplify.All<Array<{ a: 1 } & { b: 2 }>>>,
  Ts.Assert.exact<ReadonlyArray<{ a: 1; b: 2 }>, Simplify.All<ReadonlyArray<{ a: 1 } & { b: 2 }>>>,
  Ts.Assert.exact<Map<{ k: 1; v: 2 }, { a: 3; b: 4 }>, Simplify.All<Map<{ k: 1 } & { v: 2 }, { a: 3 } & { b: 4 }>>>,
  Ts.Assert.exact<Set<{ a: 1; b: 2 }>, Simplify.All<Set<{ a: 1 } & { b: 2 }>>>,
  Ts.Assert.exact<
    WeakMap<{ k: 1; v: 2 }, { a: 3; b: 4 }>,
    Simplify.All<WeakMap<{ k: 1 } & { v: 2 }, { a: 3 } & { b: 4 }>>
  >,
  Ts.Assert.exact<WeakSet<{ a: 1; b: 2 }>, Simplify.All<WeakSet<{ a: 1 } & { b: 2 }>>>,
  // Async
  Ts.Assert.exact<Promise<{ a: 1; b: 2 }>, Simplify.All<Promise<{ a: 1 } & { b: 2 }>>>
> // Note: Layer and Stream tests omitted - need proper imports from effect

// Primitive optimization - containers with primitives return unchanged
type _primitive_optimization = Ts.Assert.Cases<
  // Arrays
  Ts.Assert.exact<Array<number>, Simplify.All<Array<number>>>,
  Ts.Assert.exact<ReadonlyArray<string>, Simplify.All<ReadonlyArray<string>>>,
  // Collections
  Ts.Assert.exact<Set<boolean>, Simplify.All<Set<boolean>>>,
  Ts.Assert.exact<Map<string, number>, Simplify.All<Map<string, number>>>,
  // Async
  Ts.Assert.exact<Promise<string>, Simplify.All<Promise<string>>>
>

// Depth boundaries
type _depth_boundaries = Ts.Assert.Cases<
  // Max depth (20)
  Ts.Assert.exact<
    {
      a: {
        b: {
          c: {
            d: {
              e: {
                f: {
                  g: { h: { i: { j: { k: { l: { m: { n: { o: { p: { q: { r: { s: { t: number } } } } } } } } } } } } }
                }
              }
            }
          }
        }
      }
    },
    Simplify.To<
      20,
      {
        a: {
          b: {
            c: {
              d: {
                e: {
                  f: {
                    g: { h: { i: { j: { k: { l: { m: { n: { o: { p: { q: { r: { s: { t: number } } } } } } } } } } } } }
                  }
                }
              }
            }
          }
        }
      }
    >
  >,
  // Infinity literal
  Ts.Assert.exact<{ a: 1; b: { c: 2; d: 3 } }, Simplify.All<{ a: 1 } & { b: { c: 2 } & { d: 3 } }>>
>

// Preserved types - built-ins not expanded
type _preserved_types = Ts.Assert.Cases<
  Ts.Assert.exact<{ date: Date }, Simplify.All<{ date: Date }>>,
  Ts.Assert.exact<{ err: Error }, Simplify.All<{ err: Error }>>,
  Ts.Assert.exact<{ regex: RegExp }, Simplify.All<{ regex: RegExp }>>,
  Ts.Assert.exact<{ fn: Function }, Simplify.All<{ fn: Function }>>
>

// Edge cases
type _edge_cases = Ts.Assert.Cases<
  // Empty objects
  Ts.Assert.exact<{}, Simplify.All<{}>>,
  Ts.Assert.exact<{}, Simplify.All<{} & {}>>,
  // Nested containers
  Ts.Assert.exact<
    Map<string, Array<{ a: 1; b: 2 }>>,
    Simplify.All<Map<string, Array<{ a: 1 } & { b: 2 }>>>
  >,
  Ts.Assert.exact<
    Set<Promise<{ x: 1; y: 2 }>>,
    Simplify.All<Set<Promise<{ x: 1 } & { y: 2 }>>>
  >
>

// Circular reference detection - types with self-references should terminate
type SelfRef = { self: SelfRef; data: string }
type _circular = Ts.Assert.Cases<
  Ts.Assert.exact<SelfRef, Simplify.All<SelfRef>>
>
