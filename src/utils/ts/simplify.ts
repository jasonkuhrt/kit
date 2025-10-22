import type * as Err_ from './err.js'
import type { GetPreservedTypes } from './test-settings.js'
import type { IsHas } from './union.js'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Internal Implementation
//
//
//
//

/**
 * Internal implementation for smart type expansion with preservation and circular reference detection.
 *
 * @internal
 * @template $T - The type to selectively expand
 * @template $PreserveTypes - Union of types that should not be expanded
 * @template ___Seen - Accumulator for circular reference detection
 */
// dprint-ignore
type SimplifyPreservingInternal<$T, $PreserveTypes = never, ___Seen = never> =
  // Check if it's an error type first - preserve errors intact
  Err_.Is<$T> extends true ? $T
  // Check for circular reference - prevent infinite recursion
  : IsHas<___Seen, $T> extends true ? $T
  // Check if type should be preserved (includes built-ins + user-registered types)
  : $T extends $PreserveTypes ? $T
  // Handle arrays specially - simplify element types
  : $T extends Array<infer __element__>
    ? __element__ extends object
      ? Array<{ [k in keyof __element__]: SimplifyPreservingInternal<__element__[k], $PreserveTypes, $T | ___Seen> } & unknown>
      : Array<__element__>
  // Handle readonly arrays
  : $T extends ReadonlyArray<infer __element__>
    ? __element__ extends object
      ? ReadonlyArray<{ [k in keyof __element__]: SimplifyPreservingInternal<__element__[k], $PreserveTypes, $T | ___Seen> } & unknown>
      : ReadonlyArray<__element__>
  // Recursively expand objects, tracking seen types
  : $T extends object
    ? { [k in keyof $T]: SimplifyPreservingInternal<$T[k], $PreserveTypes, $T | ___Seen> } & unknown
    : $T

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Public API
//
//
//
//

/**
 * Basic one-level type flattening with automatic preservation.
 *
 * Flattens intersections and mapped types at the top level only.
 * Automatically preserves types registered in {@link KitLibrarySettings.Ts.PreserveTypes}
 * (including built-in types like Date, Error, Function, etc.).
 *
 * Use this when you need a quick flatten without recursion, such as:
 * - Making type aliases more readable in IDE tooltips
 * - Flattening simple intersections
 * - When you know nested types don't need expansion
 *
 * @template $T - The type to simplify
 *
 * @example
 * ```ts
 * // Basic flattening
 * type Complex = { a: string } & { b: number } & { c: boolean }
 * type Simple = Simplify.Shallow<Complex>
 * // { a: string; b: number; c: boolean }
 *
 * // Does not recurse into nested types
 * type Nested = { user: { name: string } & { age: number } }
 * type Flat = Simplify.Shallow<Nested>
 * // { user: { name: string } & { age: number } } - inner intersection not flattened
 *
 * // Preserves built-ins
 * type WithDate = Simplify.Shallow<{ created: Date }>
 * // { created: Date } - Date not expanded
 * ```
 *
 * @category Type Simplification
 */
export type Shallow<$T> = $T extends GetPreservedTypes ? $T
  :
    & {
      [k in keyof $T]: $T[k]
    }
    & unknown

/**
 * Deep recursive type expansion with automatic preservation of globally registered types.
 *
 * Recursively expands user-defined types while preserving:
 * - Error types ({@link Ts.Err.StaticErrorLike})
 * - Built-in primitives (Array, Promise, Date, etc.)
 * - Globally registered types ({@link KitLibrarySettings.Ts.PreserveTypes})
 * - Functions
 *
 * Includes circular reference detection to prevent infinite recursion.
 * Handles arrays and readonly arrays with special logic to simplify element types.
 *
 * @template $T - The type to simplify
 *
 * @example
 * ```typescript
 * // Recursive expansion
 * type Complex = { a: 1 } & { b: { c: 2 } & { d: 3 } }
 * type Simple = Simplify.Deep<Complex>
 * // { a: 1; b: { c: 2; d: 3 } } - all levels flattened
 *
 * // Preserves registered types
 * type WithDate = Simplify.Deep<{ created: Date }>
 * // { created: Date } - Date not expanded
 *
 * // Handles arrays
 * type UserArray = Array<{ name: string } & { age: number }>
 * type SimpleArray = Simplify.Deep<UserArray>
 * // Array<{ name: string; age: number }>
 * ```
 *
 * @category Type Simplification
 */
export type Deep<$T> = SimplifyPreservingInternal<$T, GetPreservedTypes>

/**
 * Type simplification that preserves `| null` and `| undefined` unions.
 *
 * Solves a subtle problem with basic simplification: when you have `Type | null`,
 * the intersection with `& unknown` can absorb or transform the `null` in unexpected ways.
 * This utility checks for null/undefined first, then explicitly reconstructs the union
 * to ensure `| null` and `| undefined` remain intact.
 *
 * Automatically preserves globally registered types from {@link KitLibrarySettings.Ts.PreserveTypes}.
 *
 * **When to use:**
 * - When simplifying types that may contain `| null` or `| undefined`
 * - When you need to preserve optional/nullable semantics
 * - With API responses that may be null
 *
 * @template $T - The type to simplify
 *
 * @example
 * ```ts
 * // Preserves null union
 * type User = { name: string } & { age: number }
 * type MaybeUser = User | null
 * type Simple = Simplify.Nullable<MaybeUser>
 * // { name: string; age: number } | null
 *
 * // Works with non-nullable types too
 * type NonNull = Simplify.Nullable<{ a: 1 } & { b: 2 }>
 * // { a: 1; b: 2 }
 *
 * // Handles undefined
 * type Optional = ({ x: string } & { y: number }) | undefined
 * type SimpleOpt = Simplify.Nullable<Optional>
 * // { x: string; y: number } | undefined
 * ```
 *
 * @category Type Simplification
 */
export type Nullable<$T> = null extends $T ? (Shallow<$T> & {}) | null
  : undefined extends $T ? (Shallow<$T> & {}) | undefined
  : Shallow<$T> & {}

/**
 * Smart type expansion for error displays with automatic preservation.
 *
 * Alias for {@link Deep}. Used in error messages and type displays to show
 * clean, expanded types while preserving built-ins and registered types.
 *
 * Automatically preserves types registered in {@link KitLibrarySettings.Ts.PreserveTypes}.
 *
 * @template $T - The type to selectively expand
 *
 * @example
 * ```ts
 * // In error messages
 * type Custom = { x: number } & { y: string }
 * type DisplayType = Simplify.Display<Custom>
 * // Shows: { x: number; y: string }
 *
 * // Preserves built-ins
 * type WithBuiltIn = Simplify.Display<{ data: Array<number>; created: Date }>
 * // Shows: { data: number[]; created: Date }
 * ```
 *
 * @category Type Simplification
 */
export type Display<$T> = Deep<$T>
