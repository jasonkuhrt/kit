import { Fn } from '#fn'

/**
 * A lazy value that is computed when called.
 * @template $Value - The type of value that will be returned when the lazy function is invoked
 */
export type Lazy<$Value> = () => $Value

/**
 * Creates a lazy value that returns the given value when invoked.
 * @template value - The type of the value to be lazily returned
 * @param value - The value to wrap in a lazy computation
 * @returns A function that returns the wrapped value when called
 * @example
 * ```ts
 * const lazyNumber = lazy(42)
 * console.log(lazyNumber()) // 42
 *
 * const lazyObject = lazy({ foo: 'bar' })
 * console.log(lazyObject()) // { foo: 'bar' }
 * ```
 */
export const lazy = <const value>(value: value): Lazy<typeof value> => () => value

/**
 * A value that may be either immediate or lazy.
 * @template $Value - The type of the value, whether immediate or lazy
 */
export type LazyMaybe<$Value = unknown> = $Value | Lazy<$Value>

/**
 * Type-level resolution of a LazyMaybe value.
 * Extracts the underlying value type whether it's lazy or immediate.
 * @template $LazyMaybeValue - A value that may be lazy or immediate
 */
// dprint-ignore
export type resolveLazy<$LazyMaybeValue extends LazyMaybe<any>> =
  $LazyMaybeValue extends Lazy<infer __value__> ? __value__ : $LazyMaybeValue

/**
 * Resolves a value that may be lazy or immediate.
 * If the value is a function (lazy), it calls it to get the result.
 * If the value is immediate, it returns it as-is.
 * @template lazyMaybeValue - The type of the potentially lazy value
 * @param lazyMaybeValue - A value that may be lazy (function) or immediate
 * @returns The resolved value
 * @example
 * ```ts
 * console.log(resolveLazy(42)) // 42
 * console.log(resolveLazy(() => 42)) // 42
 *
 * const lazyConfig = () => ({ port: 3000 })
 * console.log(resolveLazy(lazyConfig)) // { port: 3000 }
 * ```
 */
export const resolveLazy = <lazyMaybeValue extends LazyMaybe>(
  lazyMaybeValue: lazyMaybeValue,
): resolveLazy<lazyMaybeValue> => {
  if (Fn.is(lazyMaybeValue)) return lazyMaybeValue()
  return lazyMaybeValue as any
}

/**
 * Creates a factory function that resolves a lazy or immediate value when called.
 * This is useful when you want to defer the resolution of a LazyMaybe value.
 * @template value - The type of the value to be resolved
 * @param lazyMaybeValue - A value that may be lazy (function) or immediate
 * @returns A function that when called, resolves and returns the value
 * @example
 * ```ts
 * const getValue = resolveLazyFactory(42)
 * console.log(getValue()) // 42
 *
 * const getLazyValue = resolveLazyFactory(() => 42)
 * console.log(getLazyValue()) // 42
 *
 * // Useful for configuration that may be lazy
 * const getConfig = resolveLazyFactory(() => ({ apiUrl: 'https://api.example.com' }))
 * console.log(getConfig()) // { apiUrl: 'https://api.example.com' }
 * ```
 */
export const resolveLazyFactory = <value>(lazyMaybeValue: LazyMaybe<value>) => (): value =>
  resolveLazy(lazyMaybeValue) as any
