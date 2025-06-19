import { Language } from '#language/index.js'

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
  console.log(Language.inspect(value, { depth: 20, colors: true }))
}
