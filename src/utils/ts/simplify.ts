import type { E, L, St } from '#deps/effect'
import { type Num } from '#num'
import type { GetPreservedTypes } from './global-settings.ts'
import type * as Union from './union.js'

/**
 * Simplify a type to a specific depth.
 *
 * Recursively flattens intersections and mapped types while preserving:
 * - Error types ({@link Ts.Err.StaticErrorLike})
 * - Built-in primitives (Date, Error, RegExp, Function)
 * - Globally registered types ({@link KitLibrarySettings.Ts.PreserveTypes})
 *
 * Includes circular reference detection to prevent infinite recursion.
 * Traverses into generic containers (Array, Map, Set, Promise, Effect, etc.).
 *
 * @template $DepthRemaining - How many levels deep to simplify (use -1 for infinite)
 * @template $T - The type to simplify
 * @template $Seen - Internal accumulator for circular reference detection
 *
 * @example
 * ```typescript
 * // Depth 1 - flatten one level
 * type One = Simplify.To<1, { a: 1 } & { b: { c: 2 } & { d: 3 } }>
 * // { a: 1; b: { c: 2 } & { d: 3 } } - inner not flattened
 *
 * // Depth 2 - flatten two levels
 * type Two = Simplify.To<2, { a: 1 } & { b: { c: 2 } & { d: 3 } }>
 * // { a: 1; b: { c: 2; d: 3 } } - all levels flattened
 *
 * // Infinite depth
 * type All = Simplify.To<-1, DeepType>
 * // Flattens all levels
 *
 * // Preserves built-ins
 * type WithDate = Simplify.To<-1, { created: Date }>
 * // { created: Date } - Date not expanded
 *
 * // Traverses containers
 * type Container = Simplify.To<-1, Map<{ a: 1 } & { b: 2 }, string>>
 * // Map<{ a: 1; b: 2 }, string>
 * ```
 *
 * @category Type Simplification
 */
// dprint-ignore
export type To<
  $DepthRemaining extends Num.Literal,
  $T,
  $Seen = never,
  DN extends Num.Literal = Num.NatDec<$DepthRemaining>,
  SN = $T | $Seen
> =
  // Depth 0 - stop recursing
  $DepthRemaining extends Num.LiteralZero                                                              ? $T :
  // Check for circular reference - prevent infinite recursion
  Union.IsHas<$Seen, $T> extends true                                                           ? $T :
  // Check if type should be preserved (includes built-ins + user-registered types)
  $T extends GetPreservedTypes                                                                  ? $T :
  // Handle arrays - traverse element types
  $T extends Array<infer __element__>                                                           ? __element__ extends object
      ? Array<{ [k in keyof __element__]: To<DN, __element__[k], SN> } & {}>
      : $T :
  // Handle readonly arrays
  $T extends ReadonlyArray<infer __element__>                                                   ? __element__ extends object
      ? ReadonlyArray<{ [k in keyof __element__]: To<DN, __element__[k], SN> } & {}>
      : $T :
  // Handle Map - traverse both key and value types
  $T extends Map<infer __key__, infer __value__>                                                ? Map<To<DN, __key__, SN>, To<DN, __value__, SN>> :
  // Handle Set - traverse element type
  $T extends Set<infer __element__>                                                             ? Set<To<DN, __element__, SN>> :
  // Handle Promise - traverse resolved type
  $T extends Promise<infer __resolved__>                                                        ? Promise<To<DN, __resolved__, SN>> :
  // Handle WeakMap - traverse both key and value types
  $T extends WeakMap<infer __key__, infer __value__>                                            ? WeakMap<To<DN, __key__, SN>, To<DN, __value__, SN>> :
  // Handle WeakSet - traverse element type
  $T extends WeakSet<infer __element__>                                                         ? WeakSet<To<DN, __element__, SN>> :
  // Handle Effect - traverse all three type parameters
  $T extends E.Effect<infer __success__, infer __error__, infer __requirements__>               ? E.Effect<To<DN, __success__, SN>, To<DN, __error__, SN>, To<DN, __requirements__, SN>> :
  // Handle Layer - traverse all three type parameters
  $T extends L.Layer<infer __out__, infer __error__, infer __in__>                              ? L.Layer<To<DN, __out__, SN>, To<DN, __error__, SN>, To<DN, __in__, SN>> :
  // Handle Stream - traverse all three type parameters
  $T extends St.Stream<infer __success__, infer __error__, infer __requirements__>              ? St.Stream<To<DN, __success__, SN>, To<DN, __error__, SN>, To<DN, __requirements__, SN>> :
  // Recursively expand objects, tracking seen types
  $T extends object                                                                             ? { [k in keyof $T]: To<DN, $T[k], SN> } & {} :
  $T

/**
 * Simplify one level only (top level flattening).
 *
 * Alias for {@link To}<1, $T>.
 *
 * @template $T - The type to simplify
 *
 * @example
 * ```typescript
 * type Complex = { a: 1 } & { b: { c: 2 } & { d: 3 } }
 * type Simple = Simplify.Top<Complex>
 * // { a: 1; b: { c: 2 } & { d: 3 } } - inner not flattened
 * ```
 *
 * @category Type Simplification
 */
export type Top<$T> = To<1, $T>

/**
 * Simplify using the configured default depth.
 *
 * Alias for {@link To}<{@link KitLibrarySettings.Perf.Settings.depth}, $T>.
 *
 * Default depth is 10, configurable via global settings.
 *
 * @template $T - The type to simplify
 *
 * @example
 * ```typescript
 * // With default depth: 10
 * type Simple = Simplify.Auto<DeepType>
 *
 * // Customize depth globally
 * declare global {
 *   namespace KitLibrarySettings {
 *     namespace Perf {
 *       interface Settings {
 *         depth: 5
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @category Type Simplification
 */
export type Auto<$T> = To<KitLibrarySettings.Perf.Settings['depth'], $T>

/**
 * Simplify all levels (infinite depth).
 *
 * Alias for {@link To}<-1, $T>.
 *
 * @template $T - The type to simplify
 *
 * @example
 * ```typescript
 * type Complex = { a: 1 } & { b: { c: 2 } & { d: 3 } }
 * type Simple = Simplify.All<Complex>
 * // { a: 1; b: { c: 2; d: 3 } } - all levels flattened
 * ```
 *
 * @category Type Simplification
 */
export type All<$T> = To<Num.LiteralInfinity, $T>
