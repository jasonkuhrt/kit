// import { isShape as Obj_isShape } from '#obj/obj' // Temporarily disabled for migration

/**
 * Type representing a Promise of unknown type.
 * Useful for generic promise handling where the resolved type is not important.
 */
export type Any = Promise<unknown>

/**
 * Type representing a Promise of any type.
 * Less type-safe than {@link Any}, use with caution.
 */
export type AnyAny = Promise<any>

/**
 * Type representing a value that may or may not be wrapped in a Promise.
 *
 * @typeParam $Type - The type that may be wrapped in a Promise.
 *
 * @example
 * ```ts
 * // function that accepts sync or async values
 * function process<T>(value: Maybe<T>): Promise<T> {
 *   return Promise.resolve(value)
 * }
 *
 * process(42) // accepts number
 * process(Promise.resolve(42)) // accepts Promise<number>
 * ```
 */
export type Maybe<$Type> = $Type | Promise<$Type>

/**
 * Check if a value has the shape of a Promise.
 * Tests for the presence of then, catch, and finally methods.
 *
 * @param value - The value to test.
 * @returns True if the value has Promise-like shape.
 *
 * @example
 * ```ts
 * // with a promise
 * isShape(Promise.resolve(42)) // true
 *
 * // with a thenable object
 * isShape({ then: () => {}, catch: () => {}, finally: () => {} }) // true
 *
 * // with non-promise values
 * isShape(42) // false
 * isShape({}) // false
 * ```
 */
export const isShape = (value: unknown): value is AnyAny => {
  return (
    typeof value === 'object'
    && value !== null
    && typeof (value as any).then === 'function'
    && typeof (value as any).catch === 'function'
    && typeof (value as any).finally === 'function'
  )
}

/**
 * Type that adds an additional type to a potentially promised union.
 * If the input is a Promise, the additional type is added to the promised value.
 * If the input is not a Promise, creates a union with the additional type.
 *
 * @typeParam $MaybePromise - A value that may or may not be a Promise.
 * @typeParam $Additional - The type to add to the union.
 *
 * @example
 * ```ts
 * // with promise input
 * type Result1 = AwaitedUnion<Promise<string>, number> // Promise<string | number>
 *
 * // with non-promise input
 * type Result2 = AwaitedUnion<string, number> // string | number
 * ```
 */
// dprint-ignore
export type AwaitedUnion<$MaybePromise, $Additional> =
  $MaybePromise extends Promise<infer __promised__>
    ? Promise<Awaited<__promised__ | $Additional>>
    : $MaybePromise | $Additional
