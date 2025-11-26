/**
 * Create a new object with the same keys but with values transformed by a function.
 *
 * @category Transformation
 *
 * @param obj - The object to map values from
 * @param fn - Function to transform each value, receives the value and key
 * @returns A new object with transformed values
 *
 * @example
 * ```ts
 * const prices = { apple: 1.5, banana: 0.75, orange: 2 }
 * const doublePrices = mapValues(prices, (price) => price * 2)
 * // Result: { apple: 3, banana: 1.5, orange: 4 }
 * ```
 *
 * @example
 * ```ts
 * // Using the key parameter
 * const data = { a: 1, b: 2, c: 3 }
 * const withKeys = mapValues(data, (value, key) => `${key}: ${value}`)
 * // Result: { a: 'a: 1', b: 'b: 2', c: 'c: 3' }
 * ```
 */
export const mapValues = <rec extends Record<PropertyKey, any>, newValue>(
  obj: rec,
  fn: (value: rec[keyof rec], key: keyof rec) => newValue,
): Record<keyof rec, newValue> => {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, fn(v, k as keyof rec)]),
  ) as Record<keyof rec, newValue>
}
