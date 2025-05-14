export type Any = unknown[]

export const is = (value: unknown): value is Any => {
  return Array.isArray(value)
}

export const ensure = <value>(value: value): FlattenShallow<value>[] => {
  return Array.isArray(value) ? value : [value as any]
}

export type FlattenShallow<$Type> = $Type extends (infer __inner_type__)[] ? __inner_type__ : $Type

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

export type NonEmpty<T> = [T, ...T[]]

export const isEmpty = (array: unknown[]): array is [] => array.length === 0

export const isNotEmpty = <T>(
  array: T[],
): array is NonEmpty<T> => {
  return array.length > 0
}

export const mapNonEmptyArray = <nonEmptyArray extends NonEmpty<any>, T2>(
  nonEmptyArray: nonEmptyArray,
  fn: (value: nonEmptyArray[number]) => T2,
): NonEmpty<T2> => {
  return nonEmptyArray.map(fn) as NonEmpty<T2>
}

export type AnyTuple2 = [any, any]
export type AnyTuple3 = [any, any, any]
export type AnyTuple4 = [any, any, any, any]
export type AnyTuple5 = [any, any, any, any, any]

export const map = <array extends any[], newType>(
  array: array,
  fn: (value: array[number], index: number) => newType,
): array extends AnyTuple2 ? [newType, newType]
  : array extends AnyTuple3 ? [newType, newType, newType]
  : array extends AnyTuple4 ? [newType, newType, newType, newType]
  : array extends AnyTuple5 ? [newType, newType, newType, newType, newType]
  : array extends NonEmpty<any> ? NonEmpty<newType>
  : newType[] =>
{
  return array.map(fn) as any
}

export const mapWith =
  <array extends any[], newType>(fn: (value: array[number], index: number) => newType) =>
  (array: array): array extends AnyTuple2 ? [newType, newType]
    : array extends AnyTuple3 ? [newType, newType, newType]
    : array extends AnyTuple4 ? [newType, newType, newType, newType]
    : array extends AnyTuple5 ? [newType, newType, newType, newType, newType]
    : array extends NonEmpty<any> ? NonEmpty<newType>
    : newType[] =>
  {
    return array.map(fn) as any
  }

export const includesUnknown = <T>(array: T[], value: unknown): value is T => {
  return array.includes(value as any)
}

export type Maybe<$Type> = $Type | $Type[]

export const sure = <T>(value: T | T[]) => Array.isArray(value) ? value : [value]

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
