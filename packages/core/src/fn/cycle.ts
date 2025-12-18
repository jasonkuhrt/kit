/**
 * A tracker for detecting cycles during recursive traversals.
 *
 * Unlike memoization (which caches results across calls), cycle tracking
 * handles references within a SINGLE recursive traversal:
 * - Detects when the same object is visited twice (cycle)
 * - Returns the in-progress result to allow cycles to close properly
 * - Uses WeakMap so objects can be garbage collected after traversal
 */
export interface CycleTracker<$key extends object, $value> {
  /**
   * Check if a key has been seen. Returns the cached value if so, undefined otherwise.
   * Use this at the start of recursive processing to short-circuit cycles.
   */
  getIfSeen: (key: $key) => $value | undefined

  /**
   * Store a result and return it. Fluent API for use in return statements.
   * Call this BEFORE recursing into children so cycles can resolve.
   */
  track: <$v extends $value>(key: $key, value: $v) => $v
}

/**
 * Create a cycle tracker for recursive traversals.
 *
 * Use this when you need to:
 * - Traverse a potentially cyclic object graph
 * - Return a transformed result (not just detect cycles)
 * - Store results early so cycles can resolve
 *
 * @example
 * ```ts
 * // Recursive schema transformation with cycle support
 * const processSchema = (schema: Schema): Schema => {
 *   const tracker = Fn.createCycleTracker<Schema, Schema>()
 *
 *   const recurse = (s: Schema): Schema => {
 *     // Check if already processing this schema (cycle detected)
 *     const seen = tracker.getIfSeen(s)
 *     if (seen !== undefined) return seen
 *
 *     // Store result immediately (before recursing) so cycles can resolve
 *     if (isStruct(s)) {
 *       const result = createStruct()
 *       tracker.track(s, result) // Store early!
 *       result.fields = s.fields.map(f => recurse(f.type))
 *       return result
 *     }
 *
 *     return tracker.track(s, s) // Unchanged
 *   }
 *
 *   return recurse(schema)
 * }
 * ```
 *
 * @see {@link memo} for caching results across multiple function calls
 */
export const createCycleTracker = <$key extends object, $value>(): CycleTracker<$key, $value> => {
  const cache = new WeakMap<$key, $value>()
  return {
    getIfSeen: (key) => cache.get(key),
    track: (key, value) => {
      cache.set(key, value)
      return value
    },
  }
}
