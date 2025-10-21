import type { Lang } from '#lang'
import type { Obj } from '#obj'
import type { Str } from '#str'
import type { A } from 'ts-toolbelt'
import type { Simplify } from 'type-fest'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Key Alignment
//
//
//
//

/**
 * Align object keys by padding with a character to a specified length.
 *
 * Generic utility for creating visually aligned error messages and structured displays.
 * Ensures consistent key lengths for better readability in IDE tooltips and error messages.
 *
 * @template $T - The type whose keys should be aligned
 * @template $Length - The target length for all keys (defaults to 14)
 * @template $Pad - The character to use for padding (defaults to '_')
 *
 * @example
 * ```ts
 * type Input = { ERROR: string; EXPECTED: number; ACTUAL: number }
 * type Aligned = AlignKeys<Input, 12>
 * // { ERROR_______: string; EXPECTED____: number; ACTUAL______: number }
 *
 * // Custom padding character
 * type DotPadded = AlignKeys<Input, 12, '.'>
 * // { ERROR.......: string; EXPECTED....: number; ACTUAL......: number }
 * ```
 */
export type AlignKeys<$T, $Length extends number = 14, $Pad extends string = '_'> = Obj.AlignKeys<
  $T,
  $Length,
  $Pad
>

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Type Simplification
//
//
//
//

/**
 * Smart type expansion for error displays.
 *
 * Expands user-defined types while preserving specified types and built-in primitives.
 * Prevents error messages from expanding types like `Array`, `Promise`, `Record` into
 * their raw structural definitions.
 *
 * @template $T - The type to selectively expand
 * @template $PreserveTypes - Union of types that should not be expanded (defaults to never)
 *
 * @example
 * ```ts
 * type Custom = { x: number }
 * type A = SimplifyPreserving<Custom>  // { x: number } - expands custom types
 * type B = SimplifyPreserving<Array<number>>  // number[] - preserves built-in
 * type C = SimplifyPreserving<Promise<string>>  // Promise<string> - preserves built-in
 *
 * // With custom preserved types
 * class Foo { value: string }
 * type D = SimplifyPreserving<Foo, Foo>  // Foo - preserves because in union
 * type E = SimplifyPreserving<{ foo: Foo }, Foo>  // { foo: Foo } - preserves nested
 * ```
 */
// dprint-ignore
export type SimplifyPreserving<$T, $PreserveTypes = never> =
  $T extends $PreserveTypes | Lang.BuiltInTypes ? $T
  : $T extends object
    ? { [k in keyof $T]: SimplifyPreserving<$T[k], $PreserveTypes> }
    : $T

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Metadata Formatting
//
//
//
//

/**
 * Convert a tuple of strings into lettered fields.
 *
 * Transforms `[string, string, ...]` into `{ tip_a: string, tip_b: string, ... }`.
 * Useful for displaying multiple pieces of metadata with alphabetic labels.
 *
 * @template $Values - Readonly array of strings
 *
 * @example
 * ```ts
 * type T1 = TupleToLettered<['First', 'Second']>
 * // { tip_a: 'First', tip_b: 'Second' }
 *
 * type T2 = TupleToLettered<['Only one']>
 * // { tip_a: 'Only one' }
 *
 * // Can be used with custom prefix
 * type T3 = { [i in keyof ['A', 'B'] as i extends `${infer n extends number}` ? `item_${Str.Char.LettersLower[n]}` : never]: ['A', 'B'][i] }
 * // { item_a: 'A', item_b: 'B' }
 * ```
 */
export type TupleToLettered<$Values extends readonly string[], $Prefix extends string = 'tip'> = {
  [
    i in keyof $Values as i extends `${infer __n__ extends number}` ? `${$Prefix}_${Str.Char.LettersLower[__n__]}`
      : never
  ]: $Values[i]
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Structural Diff
//
//
//
//

/**
 * Compute structured diff between two object types.
 *
 * Returns a flat object with prefixed fields showing the differences:
 * - `${prefix}_missing` - Properties in Expected but not in Actual (omitted if empty)
 * - `${prefix}_excess` - Properties in Actual but not in Expected (omitted if empty)
 * - `${prefix}_mismatch` - Properties in both but with different types (omitted if empty)
 *
 * Empty diff fields are completely omitted from the result.
 * If either type is not an object, returns an empty object (no diff).
 *
 * @template $Expected - The expected object type
 * @template $Actual - The actual object type
 * @template $Prefix - Prefix for diff field names (defaults to 'diff')
 * @template $PreserveTypes - Types to preserve during simplification (defaults to never)
 *
 * @example
 * ```ts
 * type Expected = { a: string; b: number }
 * type Actual = { b: string; c: boolean }
 *
 * type Diff = ComputeDiff<Expected, Actual>
 * // {
 * //   diff_missing: { a: string }
 * //   diff_excess: { c: boolean }
 * //   diff_mismatch: { b: { expected: number; actual: string } }
 * // }
 * ```
 */
// dprint-ignore
export type ComputeDiff<
  $Expected,
  $Actual,
  $Prefix extends string = 'diff',
  $PreserveTypes = never
> =
  $Expected extends object
    ? $Actual extends object
      ? {
          [k in keyof DiffFields<$Expected, $Actual, $PreserveTypes> as Obj.IsEmpty<DiffFields<$Expected, $Actual, $PreserveTypes>[k]> extends true ? never : k extends string ? `${$Prefix}_${k}` : k]: DiffFields<$Expected, $Actual, $PreserveTypes>[k]
        }
      : {}
    : {}

// dprint-ignore
type DiffFields<$Expected extends object, $Actual extends object, $PreserveTypes = never> = {
  missing: SimplifyPreserving<A.Compute<Obj.ExcludeKeys<$Expected, Obj.SharedKeys<$Expected, $Actual>>>, $PreserveTypes>
  excess: SimplifyPreserving<A.Compute<Obj.ExcludeKeys<$Actual, Obj.SharedKeys<$Expected, $Actual>>>, $PreserveTypes>
  mismatch: SimplifyPreserving<A.Compute<Obj.OmitNever<Obj.Mismatched<$Expected, $Actual>>>, $PreserveTypes>
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Unicode Symbols
//
//
//
//

/**
 * Cross mark - indicates an error or type mismatch occurred.
 * Used in error messages to denote failures or incompatibilities.
 */
export const CROSS = `✕`

/**
 * Warning sign - indicates a potential issue or cautionary note.
 * Used when types are equivalent but not structurally exact.
 */
export const WARNING = `⚠`

/**
 * Lightning bolt - indicates type coercion or transformation.
 * Used when automatic type conversions occur.
 */
export const LIGHTNING = `⚡`

/**
 * Exclusion symbol - indicates type exclusion or prohibition.
 * Used when certain types are explicitly not allowed.
 */
export const EXCLUSION = `⊘`

/**
 * Empty set - indicates an empty type or no valid values.
 * Used when a type has no inhabitants (like never in certain contexts).
 */
export const EMPTY_SET = `∅`
