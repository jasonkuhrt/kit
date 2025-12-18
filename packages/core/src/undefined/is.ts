/**
 * Type guard to check if a value is undefined.
 */
export const is = (value: unknown): value is undefined => {
  return value === undefined
}

/**
 * Type guard to check if a value is NOT undefined (i.e., defined).
 */
export const isnt = <$value>(value: $value): value is Exclude<$value, undefined> => {
  return value !== undefined
}
