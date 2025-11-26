/**
 * Check if a value is a function.
 *
 * Type guard that checks if a value is any kind of function, including
 * regular functions, arrow functions, async functions, generator functions, etc.
 *
 * @param value - The value to check
 * @returns True if the value is a function, with type narrowing to function type
 *
 * @example
 * ```ts
 * const value: unknown = someValue()
 * if (isAnyFunction(value)) {
 *   // value is (...args: any[]) => any here
 *   const result = value(1, 2, 3)
 * }
 * ```
 *
 * @example
 * ```ts
 * // Filtering functions from mixed arrays
 * const items: unknown[] = ['string', 42, () => {}, function() {}, async () => {}]
 * const functions = items.filter(isAnyFunction)
 * // functions: ((...args: any[]) => any)[]
 * ```
 *
 * @example
 * ```ts
 * // Type-safe function detection
 * const maybeCallback: string | (() => void) = getCallback()
 * if (isAnyFunction(maybeCallback)) {
 *   maybeCallback()  // Safe to call
 * } else {
 *   console.log(maybeCallback)  // It's a string
 * }
 * ```
 */
export const isAnyFunction = (value: unknown): value is (...args: any[]) => any => {
  return typeof value === 'function'
}
