import type { Num } from '#num'
import { Ts } from '#ts'
import type * as Kind from './kind.js'
import type * as Simplify from './simplify.js'

// Depth control
type _depths = Ts.Assert.Cases<
  // @ts-expect-error - invalid depth
  Ts.Assert.exact<{}, Simplify.To<99, {}>>,
  Ts.Assert.exact<{ a: 1 } & { b: 2 }, Simplify.To<0, { a: 1 } & { b: 2 }>>,
  Ts.Assert.exact<{ a: 1; b: 2 }, Simplify.To<1, { a: 1 } & { b: 2 }>>,
  Ts.Assert.exact<{ a: 1; b: { c: 2; d: 3 } }, Simplify.To<2, { a: 1 } & { b: { c: 2 } & { d: 3 } }>>,
  Ts.Assert.exact<{ a: 1; b: { c: 2 } & { d: 3 } }, Simplify.Top<{ a: 1 } & { b: { c: 2 } & { d: 3 } }>>,
  Ts.Assert.exact<{ a: 1; b: { c: 2; d: 3 } }, Simplify.All<{ a: 1 } & { b: { c: 2 } & { d: 3 } }>>
>

// Nullable distribution
type _nullable = Ts.Assert.Cases<
  Ts.Assert.exact<{ a: 1; b: 2 } | null, Simplify.Top<({ a: 1 } & { b: 2 }) | null>>,
  Ts.Assert.exact<{ a: 1; b: 2 } | undefined, Simplify.Top<({ a: 1 } & { b: 2 }) | undefined>>,
  Ts.Assert.exact<{ a: 1; b: { c: 2; d: 3 } | null }, Simplify.All<{ a: 1 } & { b: ({ c: 2 } & { d: 3 }) | null }>>
>

// Container traversal
type _containers = Ts.Assert.Cases<
  Ts.Assert.exact<Array<{ a: 1; b: 2 }>, Simplify.All<Array<{ a: 1 } & { b: 2 }>>>,
  Ts.Assert.exact<ReadonlyArray<{ a: 1; b: 2 }>, Simplify.All<ReadonlyArray<{ a: 1 } & { b: 2 }>>>,
  Ts.Assert.exact<Set<{ a: 1; b: 2 }>, Simplify.All<Set<{ a: 1 } & { b: 2 }>>>,
  Ts.Assert.exact<Map<{ k: 1; v: 2 }, { a: 3; b: 4 }>, Simplify.All<Map<{ k: 1 } & { v: 2 }, { a: 3 } & { b: 4 }>>>,
  Ts.Assert.exact<WeakSet<{ a: 1; b: 2 }>, Simplify.All<WeakSet<{ a: 1 } & { b: 2 }>>>,
  Ts.Assert.exact<
    WeakMap<{ k: 1; v: 2 }, { a: 3; b: 4 }>,
    Simplify.All<WeakMap<{ k: 1 } & { v: 2 }, { a: 3 } & { b: 4 }>>
  >,
  Ts.Assert.exact<Promise<{ a: 1; b: 2 }>, Simplify.All<Promise<{ a: 1 } & { b: 2 }>>>,
  Ts.Assert.exact<Map<string, Array<{ a: 1; b: 2 }>>, Simplify.All<Map<string, Array<{ a: 1 } & { b: 2 }>>>>
>

// Primitive optimization
type _primitives = Ts.Assert.Cases<
  Ts.Assert.exact<Array<number>, Simplify.All<Array<number>>>,
  Ts.Assert.exact<Set<boolean>, Simplify.All<Set<boolean>>>,
  Ts.Assert.exact<Map<string, number>, Simplify.All<Map<string, number>>>,
  Ts.Assert.exact<Promise<string>, Simplify.All<Promise<string>>>
>

// Preserved built-ins
type _preserved = Ts.Assert.Cases<
  Ts.Assert.exact<
    { created: Date; nested: { pattern: RegExp } },
    Simplify.All<{ created: Date; nested: { pattern: RegExp } }>
  >,
  Ts.Assert.exact<{ err: Error; fn: Function }, Simplify.All<{ err: Error; fn: Function }>>
>

// Custom preserved type
interface CustomBrand {
  readonly __brand: 'custom'
  value: string
}

declare global {
  namespace KitLibrarySettings {
    namespace Ts {
      interface PreserveTypes {
        _custom: CustomBrand
      }
    }
  }
}

type _custom_preserved = Ts.Assert.Cases<
  Ts.Assert.exact<CustomBrand, Simplify.All<CustomBrand>>,
  Ts.Assert.exact<
    { custom: CustomBrand; other: { a: 1; b: 2 } },
    Simplify.All<{ custom: CustomBrand; other: { a: 1 } & { b: 2 } }>
  >
>

// HKT custom traverser
interface Box<T> {
  readonly value: T
}

interface BoxTraverser extends Kind.Kind {
  return: this['parameters'] extends [infer $T, infer $DN extends Num.Literal, infer $SN]
    ? $T extends Box<infer V> ? Box<Simplify.To<$DN, V, $SN>>
    : never
    : never
}

declare global {
  namespace KitLibrarySettings {
    namespace Simplify {
      interface Traversables {
        _box: { extends: Box<any>; traverse: BoxTraverser }
      }
    }
  }
}

type _hkt_traverser = Ts.Assert.Cases<
  Ts.Assert.exact<Box<{ a: 1; b: 2 }>, Simplify.All<Box<{ a: 1 } & { b: 2 }>>>,
  Ts.Assert.exact<{ data: Box<{ a: 1; b: 2 }> }, Simplify.All<{ data: Box<{ a: 1 } & { b: 2 }> }>>
>

// Edge cases
type _edge = Ts.Assert.Cases<
  Ts.Assert.exact<{}, Simplify.All<{} & {}>>,
  Ts.Assert.exact<SelfRef, Simplify.All<SelfRef>>
>

type SelfRef = { self: SelfRef; data: string }
