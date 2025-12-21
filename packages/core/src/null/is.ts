/**
 * Type guard to check if a value is null.
 */
export const is = (value: unknown): value is null => {
  return value === null
}
