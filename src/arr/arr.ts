import { Bool } from '#bool'
import { Fn } from '#fn'
import { Pat } from '#pat'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Type
//
//

export type Unknown = unknown[]

export type Any = any[]

export type Empty = []
/**
 * Empty array constant.
 * @example
 * ```ts
 * const result = someCondition ? [1, 2, 3] : Empty
 * ```
 */
export const Empty: Empty = []

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

// ━ Readonly

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

/**
 * Type predicate to check if a value is an array.
 * @param value - The value to check
 * @returns True if the value is an array.
 * @example
 * ```ts
 * is([1, 2, 3]) // true
 * is('not array') // false
 * is(null) // false
 * ```
 */
export const is = (value: unknown): value is Unknown => {
  return Array.isArray(value)
}

/**
 * Check that one array is structurally equal _one level deep_. This means items are compared with strict equality operator (`===`).
 *
 * @param array1 Must be subtype of {@link array2}
 * @param array2 Array to check against. Must be supertype of {@link array1}.
 *
 * @returns True if arrays are equal.
 */
export const equalShallowly = <array1_ extends Any, array2_ extends array1_>(
  array1: array1_,
  array2: array2_,
): array1 is array2_ => {
  if (array1.length !== array2.length) return false
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) return false
  }
  return true
}

/**
 * Create a new empty array of the specified type.
 * @returns A new empty array.
 * @example
 * ```ts
 * const numbers = create<number>() // number[]
 * const strings = create<string>() // string[]
 * ```
 */
export const create = <item>(): item[] => {
  return [] as any
}

/**
 * Find the first element in an array that matches a predicate.
 * @param arr - The array to search
 * @param predicate - Predicate function or value to match
 * @returns The found element or undefined.
 * @example
 * ```ts
 * find([1, 2, 3], x => x > 2) // 3
 * find(['a', 'b', 'c'], 'b') // 'b'
 * find([1, 2, 3], x => x > 10) // undefined
 * ```
 */
export const find = <value>(arr: value[], predicate: Bool.PredicateMaybe<value>): value | undefined => {
  const predicate_ = Bool.ensurePredicate(predicate)
  return arr.find((value) => {
    return predicate_(value as any)
  })
}

/**
 * Find the first element in an array that matches a pattern.
 * @param arr - The array to search
 * @param pattern - Pattern to match against
 * @returns The found element or undefined.
 * @example
 * ```ts
 * findFirstMatching([{ id: 1 }, { id: 2 }], { id: 2 }) // { id: 2 }
 * findFirstMatching(['hello', 'world'], /^w/) // 'world'
 * ```
 */
export const findFirstMatching = <value>(arr: value[], pattern: Pat.Pattern<value>): value | undefined => {
  return arr.find(Pat.isMatchOn(pattern))
}

export type Maybe<$Type> = $Type | $Type[]

/**
 * Ensure a value is an array. If already an array, returns it; otherwise wraps it in an array.
 * @param value - The value to ensure is an array
 * @returns The value as an array.
 * @example
 * ```ts
 * sure([1, 2, 3]) // [1, 2, 3]
 * sure(42) // [42]
 * sure('hello') // ['hello']
 * ```
 */
export const sure = <value>(value: value): sure<value> => {
  return is(value) ? value as any : [value] as any
}

export type sure<$Type> = $Type extends Any ? $Type : $Type[]

// dprint-ignore
export type FlattenShallow<$Type> =
  $Type extends (infer __inner_type__)[]
    ? __inner_type__
    : $Type

/**
 * Partition an array into two arrays based on a predicate, expecting at most one match.
 * @param items - The array to partition
 * @param predicate - Type predicate to test elements
 * @returns Tuple of [non-matching items, matched item or null].
 * @throws Error if more than one item matches the predicate
 * @example
 * ```ts
 * const isError = (x: unknown): x is Error => x instanceof Error
 * const [values, error] = partitionOne([1, new Error(), 2], isError)
 * // values: number[], error: Error | null
 * ```
 */
export const partitionOne = <item, itemSub extends item>(
  items: item[],
  predicate: (value: item) => value is itemSub,
): [Exclude<item, itemSub>[], itemSub | null] => {
  const [itemsA, itemsB] = partition(items, predicate)
  if (itemsB.length > 1) throw new Error(`Expected at most one item to match predicate`)

  return [itemsA, itemsB[0] ?? null]
}

/**
 * Partition an array into two arrays based on a predicate.
 * @param items - The array to partition
 * @param predicate - Type predicate to test elements
 * @returns Tuple of [non-matching items, matching items].
 * @example
 * ```ts
 * const isEven = (n: number): n is number => n % 2 === 0
 * const [odds, evens] = partition([1, 2, 3, 4], isEven)
 * // odds: [1, 3], evens: [2, 4]
 * ```
 */
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

/**
 * Partition an array into values and errors.
 * @param array - The array to partition
 * @returns Tuple of [non-error values, errors].
 * @example
 * ```ts
 * const [values, errors] = partitionErrors([1, new Error('oops'), 'hello', new Error('fail')])
 * // values: [1, 'hello'], errors: [Error('oops'), Error('fail')]
 * ```
 */
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

/**
 * Type predicate to check if an array is empty.
 * @param array - The array to check
 * @returns True if the array is empty.
 * @example
 * ```ts
 * isEmpty([]) // true
 * isEmpty([1, 2, 3]) // false
 * ```
 */
export const isEmpty = (array: unknown[]): array is Empty => {
  return array.length === 0
}

/**
 * Type predicate to check if an array is not empty.
 * @param array - The array to check
 * @returns True if the array is not empty.
 * @example
 * ```ts
 * isntEmpty([1, 2, 3]) // true
 * isntEmpty([]) // false
 * if (isntEmpty(arr)) {
 *   const first = arr[0] // guaranteed to exist
 * }
 * ```
 */
export const isntEmpty = <value>(array: value[]): array is NonEmpty<value> => {
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

/**
 * Map over an array with a function, preserving array shape.
 * @param array - The array to map over
 * @param fn - The mapping function
 * @returns A new array with mapped values.
 * @example
 * ```ts
 * map([1, 2, 3], x => x * 2) // [2, 4, 6]
 * map(['a', 'b'], (s, i) => `${s}${i}`) // ['a0', 'b1']
 * ```
 */
export const map = <array extends Any, newType>(
  array: array,
  fn: JsMapper<array, newType>,
): ReplaceInner<array, newType> => {
  return array.map(fn) as any
}

/**
 * Curried version of {@link map} with array first.
 * @param array - The array to map over
 * @returns Function that takes a mapper and returns the mapped array.
 * @example
 * ```ts
 * const mapNumbers = mapOn([1, 2, 3])
 * mapNumbers(x => x * 2) // [2, 4, 6]
 * ```
 */
// dprint-ignore
export const mapOn =
  <array extends Any, newType>(array: array) =>
    (fn: JsMapper<NoInfer<array>, newType>):ReplaceInner<array, newType> => {
      return array.map(fn) as any
    }

/**
 * Curried version of {@link map} with mapper first.
 * @param fn - The mapping function
 * @returns Function that takes an array and returns the mapped array.
 * @example
 * ```ts
 * const double = mapWith((x: number) => x * 2)
 * double([1, 2, 3]) // [2, 4, 6]
 * ```
 */
// dprint-ignore
export const mapWith =
  <array extends Any, newType>(fn: JsMapper<array, newType>) =>
    (array: array): ReplaceInner<array, newType> => {
      return array.map(fn) as any
    }

// Utils

/**
 * Check if an array includes a value, with type predicate.
 * @param array - The array to search in
 * @param value - The value to search for
 * @returns True if the value is in the array.
 * @example
 * ```ts
 * const nums = [1, 2, 3] as const
 * if (includesUnknown(nums, value)) {
 *   // value is typed as 1 | 2 | 3
 * }
 * ```
 */
export const includesUnknown = <T>(array: T[], value: unknown): value is T => {
  return array.includes(value as any)
}

/**
 * Remove duplicate values from an array in-place.
 * @param arr - The array to deduplicate
 * @returns The same array with duplicates removed.
 * @example
 * ```ts
 * dedupe([1, 2, 2, 3, 3, 3]) // [1, 2, 3]
 * dedupe(['a', 'b', 'a', 'c']) // ['a', 'b', 'c']
 * ```
 */
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

/**
 * Join array elements into a string with a separator.
 * @param values - The array to join
 * @param separator - The separator string
 * @returns The joined string.
 * @example
 * ```ts
 * join(['a', 'b', 'c'], ',') // 'a,b,c'
 * join([1, 2, 3], ' - ') // '1 - 2 - 3'
 * ```
 */
export const join = (values: unknown[], separator: string): string => {
  return values.join(separator)
}

/**
 * Curried version of {@link join} with values first.
 * @param values - The array to join
 * @returns Function that takes separator and returns the joined string.
 */
export const joinOn = Fn.curry(join)

/**
 * Curried version of {@link join} with separator first.
 * @param separator - The separator string
 * @returns Function that takes values and returns the joined string.
 * @example
 * ```ts
 * const joinWithComma = joinWith(',')
 * joinWithComma(['a', 'b', 'c']) // 'a,b,c'
 * ```
 */
export const joinWith = Fn.flipCurried(joinOn)

// merge

/**
 * Merge two arrays into a new array.
 * @param array1 - The first array
 * @param array2 - The second array
 * @returns A new array containing all elements from both arrays.
 * @example
 * ```ts
 * merge([1, 2], [3, 4]) // [1, 2, 3, 4]
 * merge(['a'], ['b', 'c']) // ['a', 'b', 'c']
 * ```
 */
export const merge = <T>(array1: T[], array2: T[]): T[] => {
  return array1.concat(array2)
}

/**
 * Curried version of {@link merge} with array1 first.
 * @param array1 - The first array
 * @returns Function that takes array2 and returns the merged array.
 * @example
 * ```ts
 * const mergeWithBase = mergeOn([1, 2])
 * mergeWithBase([3, 4]) // [1, 2, 3, 4]
 * ```
 */
export const mergeOn = Fn.curry(merge)

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Random
//
//

/**
 * Get a random index from an array.
 * @param arr - The array to get a random index from
 * @returns A random valid index, or undefined for empty arrays.
 * @example
 * ```ts
 * randomIndex([1, 2, 3, 4, 5]) // 0-4 (random)
 * randomIndex([]) // undefined
 * ```
 */
export const randomIndex = <const arr extends AnyRO>(arr: arr): arr extends Any1OrMoreRO ? number : undefined => {
  return Math.floor(Math.random() * arr.length) as any
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

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Access
//
//

/**
 * Get a random element from an array.
 * @param arr - The array to get a random element from
 * @returns A random element, or undefined for empty arrays.
 * @example
 * ```ts
 * getRandomly([1, 2, 3, 4, 5]) // 1-5 (random)
 * getRandomly(['a', 'b', 'c']) // 'a', 'b', or 'c' (random)
 * getRandomly([]) // undefined
 * ```
 */
export const getRandomly = <const arr extends AnyRO>(
  arr: arr,
): arr[number] | (arr extends Any1OrMoreRO ? never : undefined) => {
  if (arr.length === 0) return undefined
  return arr[randomIndex(arr)!]
}

// todo: support typings for RO, non-empty, etc.

/**
 * Get an element at a specific index.
 * @param array - The array to access
 * @param index - The index to access
 * @returns The element at the index, or undefined if out of bounds.
 * @example
 * ```ts
 * getAt(['a', 'b', 'c'], 1) // 'b'
 * getAt(['a', 'b', 'c'], 5) // undefined
 * getAt(['a', 'b', 'c'], -1) // undefined
 * ```
 */
export const getAt = <item>(array: readonly item[], index: number): item | undefined => {
  return array[index]
}

/**
 * Get the first element of an array.
 * @param array - The array to access
 * @returns The first element, or undefined for empty arrays.
 * @example
 * ```ts
 * getFirst([1, 2, 3]) // 1
 * getFirst([]) // undefined
 * ```
 */
export const getFirst = <item>(array: readonly item[]): item | undefined => {
  return array[0]
}

/**
 * Get the last element of an array.
 * @param array - The array to access
 * @returns The last element, or undefined for empty arrays.
 * @example
 * ```ts
 * getLast([1, 2, 3]) // 3
 * getLast([]) // undefined
 * ```
 */
export const getLast = <item>(array: readonly item[]): item | undefined => {
  return array[array.length - 1]
}
