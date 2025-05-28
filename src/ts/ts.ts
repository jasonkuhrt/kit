import type { Arr } from '#arr/index.js'
import type { IsAny, IsNever, IsUnknown, UnionToTuple } from 'type-fest'

/**
 * Types that TypeScript accepts being interpolated into a Template Literal Type
 */
export type Interpolatable =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | symbol
  | object
  | unknown
  | any
  | never

/**
 * Represents a type error that can be surfaced at the type level.
 * This is useful for providing more informative error messages directly in TypeScript's
 * type checking, often used with conditional types or generic constraints.
 *
 * @template $Message A string literal type describing the error.
 * @template $Context An object type providing additional context about the error,
 *                    often including the types involved.
 */
export interface StaticError<$Message extends string = string, $Context extends object = {}> {
  ERROR: $Message
  CONTEXT: $Context
}

/**
 * Like {@link Print} but adds additional stlying to display the rendred type in a sentence.
 *
 * Useful for type-level error messages.
 *
 * Styling performed:
 *
 * - Wrap printed type with backticks ala markdown.
 */
export type Show<$Type> = `\`${Print<$Type>}\``

// TODO: I believe there is a library we can use for a very robust type printing solution.
// dprint-ignore
export type Print<$Type, $Fallback extends string | undefined = undefined> =
  // Language base category types
    IsAny<$Type> extends true     ? 'any'
  : IsUnknown<$Type> extends true ? 'unknown'
  : IsNever<$Type> extends true   ? 'never'

  // Special union type boolean which we display as boolean insead of true | false
  : [$Type] extends [boolean]      ? ([boolean] extends [$Type] ? 'boolean' : `${$Type}`)

  // General unions types
  : UnionToTuple<$Type> extends Arr.Any2OrMoreRO ? _PrintUnion<UnionToTuple<$Type>>

  // Primitive and literal types
  : $Type extends true             ? 'true'
  : $Type extends false            ? 'false'
  : $Type extends void             ? ($Type extends undefined ? 'undefined' : 'void')
  : $Type extends string           ? (string extends $Type    ? 'string'  : `'${$Type}'`)
  : $Type extends number           ? (number extends $Type    ? 'number'  : `${$Type}`)
  : $Type extends bigint           ? (bigint extends $Type    ? 'bigint'  : `${$Type}n`)
  : $Type extends null             ? 'null'
  : $Type extends undefined        ? 'undefined'

  // User-provided fallback takes precedence if type is not a primitive
  : $Fallback extends string       ? $Fallback

  // Common object types and specific generic patterns
  : $Type extends Promise<infer T> ? `Promise<${Print<T>}>`
  : $Type extends (infer T)[]      ? `Array<${Print<T>}>`
  : $Type extends readonly (infer T)[]      ? `ReadonlyArray<${Print<T>}>`
  : $Type extends Date             ? 'Date'
  : $Type extends RegExp           ? 'RegExp'
  //
  : $Type extends Function         ? 'Function'
  : $Type extends symbol           ? 'symbol'

  // General object fallback
  : $Type extends object           ? 'object'

  // Ultimate fallback
  : '?'

export type Simplify<$Type> =
  & {
    [_ in keyof $Type]: $Type[_]
  }
  & unknown

// dprint-ignore
export type _PrintUnion<$Type extends Arr.AnyRO> =
  $Type extends readonly [infer __first__, ...infer __rest__ extends Arr.Any1OrMoreRO]
    ? `${Print<__first__>} | ${_PrintUnion<__rest__>}`
    : $Type extends readonly [infer __first__]
      ? `${Print<__first__>}`
      : $Type extends Arr.EmptyRO
        ? ''
        : never

// export const as = <T>(): T => value as T;
