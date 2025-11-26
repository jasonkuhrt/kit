/**
 * Type guard to check if a value is an object (non-null, non-array).
 */
export const is = (value: unknown): value is object => {
  return typeof value === `object` && value !== null && !Array.isArray(value)
}
