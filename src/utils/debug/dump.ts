import { Lang } from '#lang'

/**
 * Dump a value to the console with deep inspection and colors.
 * Useful for debugging complex objects and data structures.
 *
 * @param value - The value to dump to the console.
 *
 * @example
 * ```ts
 * const complexObject = {
 *   users: [
 *     { id: 1, name: 'Alice', roles: ['admin', 'user'] },
 *     { id: 2, name: 'Bob', roles: ['user'] }
 *   ],
 *   settings: {
 *     theme: 'dark',
 *     nested: { deep: { value: 42 } }
 *   }
 * }
 *
 * Debug.dump(complexObject) // outputs colorized, deeply inspected object
 * ```
 */
export const dump = (value: any) => {
  console.log(Lang.inspect(value, { depth: 20, colors: true }))
}

/**
 * Quick debug logging with separator lines.
 * Useful for temporary debugging during development.
 *
 * @param args - Values to log
 *
 * @example
 * ```ts
 * zz('Starting process', { id: 123 })
 * // Outputs:
 * // ---------------------------------------------
 * // Starting process { id: 123 }
 * // ---------------------------------------------
 * ```
 */
export const zz = (...args: any[]) => {
  console.log('---------------------------------------------')
  console.log(...args)
  console.log('---------------------------------------------')
}

/**
 * Quick debug dumping with separator lines and deep inspection.
 * Combines zz's separators with dump's deep inspection.
 *
 * @param args - Values to deeply inspect and log
 *
 * @example
 * ```ts
 * const nested = { a: { b: { c: { d: 'deep' } } } }
 * zd(nested, 'another value')
 * // Outputs each value with deep inspection between separator lines
 * ```
 */
export const zd = (...args: any[]) => {
  console.log('---------------------------------------------')
  args.forEach(value => console.log(Lang.inspect(value, { depth: 20, colors: true })))
  console.log('---------------------------------------------')
}
