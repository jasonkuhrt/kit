/**
 * Recursively traverse and transform values in a nested structure with early exit.
 *
 * The visitor is called for each value BEFORE recursing (top-down traversal).
 * This allows the visitor to transform a value and stop recursion early.
 *
 * @category Transformation
 *
 * @param value - Any value to traverse (primitive, object, or array)
 * @param visitor - Transformation function called for each value.
 *                  - Return `undefined`: Continue recursing into the original value
 *                  - Return any other value: Use as replacement and STOP recursing
 * @returns Transformed structure with circular references preserved
 *
 * @example
 * ```typescript
 * // Encode schema instances, recurse into everything else
 * mapValuesDeep(data, (v) => {
 *   for (const schema of schemas) {
 *     if (S.is(schema)(v)) return S.encode(schema)(v)
 *   }
 *   // Return undefined to keep recursing
 * })
 * ```
 *
 * @example
 * ```typescript
 * // Replace all Error instances with their messages
 * mapValuesDeep(data, (v) => {
 *   if (v instanceof Error) return v.message
 * })
 * ```
 *
 * @example
 * ```typescript
 * // Truncate all long strings
 * mapValuesDeep(data, (v) => {
 *   if (typeof v === 'string' && v.length > 100) {
 *     return v.slice(0, 100) + '...'
 *   }
 * })
 * ```
 */
export const mapValuesDeep = (
  value: any,
  visitor: (value: any) => any | undefined,
  visited = new WeakSet(),
): any => {
  // Primitives pass through
  if (value === null || value === undefined) return value
  if (typeof value !== 'object') return value

  // Circular reference guard
  if (visited.has(value)) return '[Circular]'
  visited.add(value)

  // Visit BEFORE recursing (allows early exit)
  const transformed = visitor(value)
  if (transformed !== undefined) {
    return transformed // Stop recursing
  }

  // No transformation - recurse into structure
  if (Array.isArray(value)) {
    return value.map(item => mapValuesDeep(item, visitor, visited))
  }

  // Any object - recurse into all properties
  const result: any = {}
  for (const [key, val] of Object.entries(value)) {
    result[key] = mapValuesDeep(val, visitor, visited)
  }
  return result
}
