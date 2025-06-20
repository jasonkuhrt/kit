import type { Arr } from '#arr'
import type { IsAny, IsNever, IsUnknown, UnionToTuple } from 'type-fest'

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

// dprint-ignore
export type _PrintUnion<$Type extends Arr.AnyRO> =
    $Type extends readonly [infer __first__, ...infer __rest__ extends Arr.Any1OrMoreRO]
      ? `${Print<__first__>} | ${_PrintUnion<__rest__>}`
      : $Type extends readonly [infer __first__]
        ? `${Print<__first__>}`
        : $Type extends Arr.EmptyRO
          ? ''
          : never
