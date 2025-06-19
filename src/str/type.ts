/**
 * Type guard to check if a value is a string.
 * @param value - The value to check
 * @returns True if the value is a string
 * @example
 * ```typescript
 * is('hello') // true
 * is(123) // false
 * is(null) // false
 * ```
 */
export const is = (value: unknown): value is string => typeof value === `string`

/**
 * Type guard to check if a string is empty.
 * @param value - The string to check
 * @returns True if the string is empty
 * @example
 * ```typescript
 * isEmpty('') // true
 * isEmpty('hello') // false
 * isEmpty(' ') // false
 * ```
 */
export const isEmpty = (value: string): value is '' => value.length === 0

/**
 * Type for an empty string.
 */
export type Empty = ''

/**
 * Empty string constant.
 * @example
 * ```typescript
 * const result = someCondition ? 'hello' : Empty
 * ```
 */
export const Empty: Empty = ''
