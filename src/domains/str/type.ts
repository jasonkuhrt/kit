/**
 * Type guard to check if a string is empty.
 * @deprecated Use `String.isEmpty` from Effect instead
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
