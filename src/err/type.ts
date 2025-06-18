export const is = (value: unknown): value is Error => {
  // TODO: use upcoming Error.isError() once its widely available.
  // See: https://github.com/tc39/proposal-is-error
  return value instanceof Error
}

/**
 * Check if a value is an AggregateError instance.
 */
export const isAggregateError = (value: unknown): value is AggregateError => {
  return value instanceof AggregateError
}

/**
 * Ensure that the given value is an error and return it. If it is not an error than
 * wrap it in one, passing the given value as the error message.
 */
export const ensure = (value: unknown): Error => {
  if (value instanceof Error) return value

  try {
    return new Error(String(value))
  } catch {
    // Handle cases where String() fails (e.g., objects with toString: null)
    return new Error('[Unrepresentable value]')
  }
}
