/**
 * Type guard to check if a value is an array.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const is = (value: unknown): value is any[] => {
  return Array.isArray(value)
}
