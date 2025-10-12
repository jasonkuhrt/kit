/**
 * A deep object value can be any JSON-serializable value including nested objects and arrays.
 */
export type DeepObjectValue = string | boolean | null | number | DeepObject | DeepObjectValue[]

/**
 * A deep object is a plain object with string keys and deep object values.
 */
export type DeepObject = { [key: string]: DeepObjectValue }

/**
 * Recursively traverse a nested object structure and transform key-value pairs.
 *
 * This utility applies a visitor function to every object entry in a deeply nested structure,
 * allowing you to transform both keys and values. The visitor can return undefined to leave
 * the entry unchanged, or return a new {key, value} pair to transform it.
 *
 * @category Transformation
 *
 * @param value - The value to traverse (can be primitive, object, or array)
 * @param visitor - Function called for each object entry. Return undefined to keep unchanged,
 *                  or return {key, value} to transform the entry.
 * @returns A new structure with transformations applied
 *
 * @example
 * ```typescript
 * // Strip dollar signs from all object keys
 * mapEntriesDeep(data, (key, value) =>
 *   key.startsWith('$') ? { key: key.slice(1), value } : undefined
 * )
 * ```
 *
 * @example
 * ```typescript
 * // Convert all string values to uppercase
 * mapEntriesDeep(data, (key, value) =>
 *   typeof value === 'string' ? { key, value: value.toUpperCase() } : undefined
 * )
 * ```
 */
export const mapEntriesDeep = <$value extends DeepObjectValue>(
  value: $value,
  visitor: (key: string, value: DeepObjectValue) => undefined | { key: string; value: DeepObjectValue },
): $value => {
  const impl = (val: any, visited = new WeakSet()): any => {
    if (Array.isArray(val)) {
      return val.map(item => impl(item, visited))
    }

    if (typeof val === 'object' && val !== null) {
      // Circular reference guard
      if (visited.has(val)) return '[Circular]'
      visited.add(val)

      const newObject: DeepObject = {}
      for (const currentKey in val) {
        const currentValue = val[currentKey]!
        // Visit BEFORE recursing (top-down traversal)
        const visitorResult = visitor(currentKey, currentValue)
        if (visitorResult) {
          // Transform applied - recurse with transformed value
          const recursedValue = impl(visitorResult.value, visited)
          newObject[visitorResult.key] = recursedValue
        } else {
          // No transform - recurse with original value
          const recursedValue = impl(currentValue, visited)
          newObject[currentKey] = recursedValue
        }
      }
      return newObject
    }

    return val
  }

  return impl(value) as $value
}
