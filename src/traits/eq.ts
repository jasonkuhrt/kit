import { Lang } from '#lang'
import { Traitor } from '#traitor'
import type { Ts } from '#ts'
import type { Type } from '#type'

/**
 * Eq trait interface for type-safe equality operations.
 *
 * The Eq trait provides a standard interface for equality comparison
 * across different data types in Kit. It enables polymorphic equality
 * operations through a consistent interface. Implementations should
 * provide deep structural equality where appropriate.
 *
 * @template $A - The type of values this Eq instance can compare
 *
 * @example
 * ```ts
 * import { Arr, Str } from '@wollybeard/kit'
 *
 * // Domain-specific equality via namespaces
 * Arr.Eq.is([1, 2], [1, 2]) // true
 * Str.Eq.is('hello', 'hello') // true
 *
 * // Polymorphic equality (requires Rollup plugin)
 * Eq.is([1, 2], [1, 2]) // true
 * Eq.is('hello', 'hello') // true
 * ```
 */
export interface Eq<$A = any> extends
  Traitor.Definition<
    'Eq',
    [Type],
    {
      /**
       * Check structural equality between two values.
       *
       * For primitive types, this is typically value equality (`===`).
       * For complex types like arrays and objects, this performs deep
       * structural comparison by recursively dispatching to appropriate
       * Eq implementations for nested values.
       *
       * @param a - First value to compare
       * @param b - Second value to compare (can be any type)
       * @returns `true` if values are structurally equal, `false` otherwise
       *
       * @example
       * ```ts
       * // Primitive equality
       * Str.Eq.is('hello', 'hello') // true
       * Num.Eq.is(42, 42) // true
       *
       * // Cross-type comparisons
       * Str.Eq.is('hello', 123) // false
       * Undefined.Eq.is(undefined, null) // false
       * Undefined.Eq.is(undefined, undefined) // true
       * ```
       */
      is<a extends $A, b = a>(a: a, b: ValidateComparable<a, b>): boolean
    },
    {
      // todo: Fn.Partialize<
      is: (value1: $A, value2: $A) => boolean
    }
  >
{
  // @ts-expect-error - PrivateKind pattern: unknown will be overridden via intersection
  [Ts.Kind.PrivateKindReturn]: Eq<this[Ts.Kind.PrivateKindParameters][0]>
  [Ts.Kind.PrivateKindParameters]: unknown
}

/**
 * Validate that two types can be meaningfully compared for equality.
 * Prevents comparing disjoint types (no overlap).
 */
type ValidateComparable<A, B> = Ts.Relation.GetRelation<A, B> extends Ts.Relation.disjoint
  ? Ts.Simplify<ErrorDisjointTypes<A, B>>
  : B

/**
 * Error type for comparing types with no overlap.
 */
type ErrorDisjointTypes<A, B> = Ts.StaticError<
  `Cannot compare disjoint types ${Ts.ShowInTemplate<A>} and ${Ts.ShowInTemplate<B>}`,
  { TypeA: A; TypeB: B },
  `These types have no overlap. This comparison will always return false.`
>

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Runtime
//
//

export const Eq = Traitor.define<Eq>('Eq', {
  is: {
    domainMissing: () => false,
    laws: {
      reflexivity: true,
      symmetry: true,
      transitivity: true,
    },
  },
})
