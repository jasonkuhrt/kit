import { Bool } from '#bool/index.js'
import { Fn } from '#fn/index.js'
import { Pat } from '#pat/index.js'

export type Unknown = unknown[]

export type Any = any[]

export type Empty = []

export type Any1 = [any]
export type Any2 = [any, any]
export type Any3 = [any, any, any]
export type Any4 = [any, any, any, any]
export type Any5 = [any, any, any, any, any]

export type Any1OrMore = readonly [any, ...readonly any[]]
export type Any2OrMore = readonly [any, any, ...readonly any[]]
export type Any3OrMore = readonly [any, any, any, ...readonly any[]]
export type Any4OrMore = readonly [any, any, any, any, ...readonly any[]]
export type Any5OrMore = readonly [any, any, any, any, any, ...readonly any[]]

// Readonly

export type UnknownRO = readonly unknown[]

export type AnyRO = readonly any[]

export type EmptyRO = readonly []

export type Any0RO = readonly []
export type Any1RO = readonly [any]
export type Any2RO = readonly [any, any]
export type Any3RO = readonly [any, any, any]
export type Any4RO = readonly [any, any, any, any]
export type Any5RO = readonly [any, any, any, any, any]

export type Any1OrMoreRO = readonly [any, ...readonly any[]]
export type Any2OrMoreRO = readonly [any, any, ...readonly any[]]
export type Any3OrMoreRO = readonly [any, any, any, ...readonly any[]]
export type Any4OrMoreRO = readonly [any, any, any, any, ...readonly any[]]
export type Any5OrMoreRO = readonly [any, any, any, any, any, ...readonly any[]]

export const is = (value: unknown): value is Unknown => {
  return Array.isArray(value)
}

export const find = <value>(arr: value[], predicate: Bool.PredicateMaybe<value>): value | undefined => {
  const predicate_ = Bool.ensurePredicate(predicate)
  return arr.find((value) => {
    return predicate_(value as any)
  })
}

export const findFirstMatching = <value>(arr: value[], pattern: Pat.Pattern<value>): value | undefined => {
  return arr.find(Pat.isMatchWith(pattern))
}

export type Maybe<$Type> = $Type | $Type[]

export const sure = <value>(value: value): sure<value> => {
  return is(value) ? value as any : [value] as any
}

export type sure<$Type> = $Type extends Any ? $Type : $Type[]

// dprint-ignore
export type FlattenShallow<$Type> =
  $Type extends (infer __inner_type__)[]
    ? __inner_type__
    : $Type

export const partitionOne = <item, itemSub extends item>(
  items: item[],
  predicate: (value: item) => value is itemSub,
): [Exclude<item, itemSub>[], itemSub | null] => {
  const [itemsA, itemsB] = partition(items, predicate)
  if (itemsB.length > 1) throw new Error(`Expected at most one item to match predicate`)

  return [itemsA, itemsB[0] ?? null]
}

export const partition = <item, itemSub extends item>(
  items: item[],
  predicate: (value: item) => value is itemSub,
): [Exclude<item, itemSub>[], itemSub[]] => {
  const itemsA: Exclude<item, itemSub>[] = []
  const itemsB: itemSub[] = []

  for (const value of items) {
    if (predicate(value)) itemsB.push(value)
    else itemsA.push(value as Exclude<item, itemSub>)
  }

  return [itemsA, itemsB]
}

export const partitionErrors = <T>(array: T[]): [Exclude<T, Error>[], Extract<T, Error>[]] => {
  const errors: Extract<T, Error>[] = []
  const values: Exclude<T, Error>[] = []
  for (const item of array) {
    if (item instanceof Error) {
      errors.push(item as any)
    } else {
      values.push(item as any)
    }
  }
  return [values, errors]
}

// Empty

export type NonEmpty<$Type = any> = [$Type, ...$Type[]]

export type NonEmptyRO<$Type = any> = readonly [$Type, ...readonly $Type[]]

export const isEmpty = (array: unknown[]): array is [] => {
  return array.length === 0
}

export const isNotEmpty = <value>(array: value[]): array is NonEmpty<value> => {
  return array.length > 0
}

// export const mapNonEmptyArray = <nonEmptyArray extends NonEmpty<any>, T2>(
//   nonEmptyArray: nonEmptyArray,
//   fn: (value: nonEmptyArray[number]) => T2,
// ): NonEmpty<T2> => {
//   return nonEmptyArray.map(fn) as NonEmpty<T2>
// }

// Map

// dprint-ignore
export type ReplaceInner<$Array extends Any, $NewType> =
    $Array extends Any2       ? [$NewType, $NewType]
  : $Array extends Any3       ? [$NewType, $NewType, $NewType]
  : $Array extends Any4       ? [$NewType, $NewType, $NewType, $NewType]
  : $Array extends Any5       ? [$NewType, $NewType, $NewType, $NewType, $NewType]
  : $Array extends NonEmpty      ? NonEmpty<$NewType>
                                 : $NewType[]

export type JsMapper<
  $Array extends Any,
  $NewType,
> = (value: $Array[number], index: number) => $NewType

export const map = <array extends Any, newType>(
  array: array,
  fn: JsMapper<array, newType>,
): ReplaceInner<array, newType> => {
  return array.map(fn) as any
}

// dprint-ignore
export const mapOn =
  <array extends Any, newType>(array: array) =>
    (fn: JsMapper<NoInfer<array>, newType>):ReplaceInner<array, newType> => {
      return array.map(fn) as any
    }

// dprint-ignore
export const mapWith =
  <array extends Any, newType>(fn: JsMapper<array, newType>) =>
    (array: array): ReplaceInner<array, newType> => {
      return array.map(fn) as any
    }

// Utils

export const includesUnknown = <T>(array: T[], value: unknown): value is T => {
  return array.includes(value as any)
}

export const dedupe = <arr extends unknown[]>(arr: arr): arr => {
  // Using filter to iterate through the array once, keeping only the first occurrence of each item
  let i = 0
  const seen = new Set<unknown>()

  while (i < arr.length) {
    const item = arr[i]
    if (seen.has(item)) {
      arr.splice(i, 1)
    } else {
      seen.add(item)
      i++
    }
  }

  return arr
}

// join

export const join = (values: unknown[], separator: string): string => {
  return values.join(separator)
}

export const joinOn = Fn.curry(join)

export const joinWith = Fn.flipCurried(joinOn)

// merge

export const merge = <T>(array1: T[], array2: T[]): T[] => {
  return array1.concat(array2)
}

export const mergeOn = Fn.curry(merge)

export const pickRandomly = <const value>(arr: readonly value[]): value => {
  return arr[Math.floor(Math.random() * arr.length)]!
}

// dprint-ignore
export type ReduceWithIntersection<$Items extends UnknownRO> =
  $Items extends readonly [infer First, ...infer Rest]
    ? First & ReduceWithIntersection<Rest>
    : $Items extends EmptyRO
      ? {}
      // Means we got something like {x:1}[]
      // in which case we just strip the array
      : $Items[number]
