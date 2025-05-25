import { Bool } from '#bool/index.js'
import { Fn } from '#fn/index.js'
import { Pat } from '#pat/index.js'

export type Any = unknown[]

export type AnyAny = any[]

export type AnyAny2 = [any, any]
export type AnyAny3 = [any, any, any]
export type AnyAny4 = [any, any, any, any]
export type AnyAny5 = [any, any, any, any, any]

export const is = (value: unknown): value is Any => {
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

export type sure<$Type> = $Type extends AnyAny ? $Type : $Type[]

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
export type ReplaceInner<$Array extends AnyAny, $NewType> =
    $Array extends AnyAny2       ? [$NewType, $NewType]
  : $Array extends AnyAny3       ? [$NewType, $NewType, $NewType]
  : $Array extends AnyAny4       ? [$NewType, $NewType, $NewType, $NewType]
  : $Array extends AnyAny5       ? [$NewType, $NewType, $NewType, $NewType, $NewType]
  : $Array extends NonEmpty      ? NonEmpty<$NewType>
                                 : $NewType[]

export type JsMapper<
  $Array extends AnyAny,
  $NewType,
> = (value: $Array[number], index: number) => $NewType

export const map = <array extends AnyAny, newType>(
  array: array,
  fn: JsMapper<array, newType>,
): ReplaceInner<array, newType> => {
  return array.map(fn) as any
}

// dprint-ignore
export const mapOn =
  <array extends AnyAny, newType>(array: array) =>
    (fn: JsMapper<NoInfer<array>, newType>):ReplaceInner<array, newType> => {
      return array.map(fn) as any
    }

// dprint-ignore
export const mapWith =
  <array extends AnyAny, newType>(fn: JsMapper<array, newType>) =>
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
