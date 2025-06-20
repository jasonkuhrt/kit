import { Arr } from '#arr'
import { Language } from '#language'
import type { Rec } from '#rec'
import { type Any, is } from './type.ts'

interface MergeOptions {
  undefined?: boolean
  defaults?: boolean
  array?: (arr1: unknown[], arr2: unknown[]) => Language.SideEffect
}

/**
 * Create a customized merge function with specific merge behavior options.
 * Allows control over how undefined values, defaults, and arrays are handled.
 *
 * @param mergers - Options to customize merge behavior
 * @returns A merge function with the specified behavior
 *
 * @example
 * ```ts
 * // Create a merger that ignores undefined values
 * const mergeIgnoreUndefined = mergeWith({ undefined: false })
 * mergeIgnoreUndefined({ a: 1 }, { a: undefined, b: 2 })
 * // Returns: { a: 1, b: 2 }
 * ```
 *
 * @example
 * ```ts
 * // Create a merger that concatenates arrays
 * const mergeArrays = mergeWith({
 *   array: (a, b) => { a.push(...b) }
 * })
 * mergeArrays({ items: [1, 2] }, { items: [3, 4] })
 * // Returns: { items: [1, 2, 3, 4] }
 * ```
 */
// dprint-ignore
/*@__NO_SIDE_EFFECTS__*/
export const mergeWith =
	(mergers?: MergeOptions) =>
		<obj1 extends Any, obj2 extends Any>(obj1: obj1, obj2: obj2): obj1 & obj2 =>
			_mergeWith<obj1, obj2>(mergers ?? {}, obj1, obj2)

/**
 * Deep merge two objects, with properties from the second object overwriting the first.
 * Recursively merges nested objects, but arrays and other non-object values are replaced.
 *
 * @param obj1 - The base object to merge into
 * @param obj2 - The object to merge from
 * @returns A new object with properties from both objects merged
 *
 * @example
 * ```ts
 * merge({ a: 1, b: 2 }, { b: 3, c: 4 })
 * // Returns: { a: 1, b: 3, c: 4 }
 * ```
 *
 * @example
 * ```ts
 * // Deep merging of nested objects
 * merge(
 *   { user: { name: 'Alice', age: 30 } },
 *   { user: { age: 31, city: 'NYC' } }
 * )
 * // Returns: { user: { name: 'Alice', age: 31, city: 'NYC' } }
 * ```
 *
 * @example
 * ```ts
 * // Arrays are replaced, not merged
 * merge({ tags: ['a', 'b'] }, { tags: ['c', 'd'] })
 * // Returns: { tags: ['c', 'd'] }
 * ```
 */
export const merge: <obj1 extends Any, obj2 extends Any>(obj1: obj1, obj2: obj2) => obj1 & obj2 = mergeWith() as any

/**
 * Deep merge two objects with special handling for arrays.
 * When both objects have an array at the same path, concatenates them instead of replacing.
 *
 * @example
 * ```ts
 * mergeWithArrayPush(
 *   { tags: ['react', 'typescript'] },
 *   { tags: ['nodejs', 'express'] }
 * )
 * // Returns: { tags: ['react', 'typescript', 'nodejs', 'express'] }
 * ```
 *
 * @example
 * ```ts
 * // Works with nested arrays
 * mergeWithArrayPush(
 *   { user: { skills: ['js'] } },
 *   { user: { skills: ['ts'] } }
 * )
 * // Returns: { user: { skills: ['js', 'ts'] } }
 * ```
 */
export const mergeWithArrayPush = mergeWith({
  array: (a, b) => {
    a.push(...b)
  },
})

/**
 * Deep merge two objects with array concatenation and deduplication.
 * When both objects have an array at the same path, concatenates and removes duplicates.
 *
 * @example
 * ```ts
 * mergeWithArrayPushDedupe(
 *   { tags: ['react', 'vue', 'react'] },
 *   { tags: ['react', 'angular'] }
 * )
 * // Returns: { tags: ['react', 'vue', 'angular'] }
 * ```
 *
 * @example
 * ```ts
 * // Preserves order with first occurrence kept
 * mergeWithArrayPushDedupe(
 *   { ids: [1, 2, 3] },
 *   { ids: [3, 4, 2, 5] }
 * )
 * // Returns: { ids: [1, 2, 3, 4, 5] }
 * ```
 */
export const mergeWithArrayPushDedupe = mergeWith({
  array: (a, b) => {
    a.push(...b)
    Arr.dedupe(a)
  },
})

/**
 * Merge default values into an object, only filling in missing properties.
 * Existing properties in the base object are preserved, even if undefined.
 *
 * @param obj1 - The base object with potentially missing properties
 * @param obj1Defaults - The default values to fill in
 * @returns The object with defaults applied
 *
 * @example
 * ```ts
 * mergeDefaults(
 *   { name: 'Alice', age: undefined },
 *   { name: 'Unknown', age: 0, city: 'NYC' }
 * )
 * // Returns: { name: 'Alice', age: undefined, city: 'NYC' }
 * // Note: existing properties (even undefined) are not overwritten
 * ```
 *
 * @example
 * ```ts
 * // Useful for configuration objects
 * const config = { port: 3000 }
 * const defaults = { port: 8080, host: 'localhost', debug: false }
 * mergeDefaults(config, defaults)
 * // Returns: { port: 3000, host: 'localhost', debug: false }
 * ```
 */
export const mergeDefaults: <
  obj1 extends Any,
  obj1Defaults extends Partial<obj1>,
>(
  obj1: obj1,
  obj1Defaults: obj1Defaults,
) => obj1 & obj1Defaults = mergeWith({ defaults: true })

// dprint-ignore
export type MergeShallow<
  $Object1 extends Any,
  $Object2 extends Any,
  __ =
    {} extends $Object1
      ? $Object2
      : & $Object2
        // Keys from $Object1 that are NOT in $Object2
        & {
            [__k__ in keyof $Object1 as __k__ extends keyof $Object2 ? never : __k__]: $Object1[__k__]
          }
> = __

// ---- INTERNALS ----

const _mergeWith = <obj1 extends Any, obj2 extends Any>(
  options: MergeOptions,
  obj1: obj1,
  obj2: obj2,
): obj1 & obj2 => {
  const obj1_AS = obj1 as Rec.Value
  const obj2_AS = obj2 as Rec.Value

  for (const k2 in obj2_AS) {
    const obj1Value = obj1_AS[k2]
    const obj2Value = obj2_AS[k2]

    if (is(obj2Value) && is(obj1Value)) {
      obj1_AS[k2] = _mergeWith(options, obj1Value, obj2Value)
      continue
    }

    if (Arr.is(obj2Value) && Arr.is(obj1Value) && options.array) {
      options.array(obj1Value, obj2Value)
      obj1_AS[k2] = obj1Value
      continue
    }

    if (obj2Value === undefined && options.undefined !== true) {
      continue
    }

    if (obj1Value !== undefined && options.defaults === true) {
      continue
    }

    obj1_AS[k2] = obj2Value
  }

  return obj1 as any
}
