/**
 * A predicate function for testing tree node values.
 * Used throughout the tree module for filtering, finding, and testing nodes.
 *
 * @param value - The current node's value to test
 * @param depth - The depth of the current node in the tree (root is 0)
 * @param path - Array of ancestor values from root to current node (excluding current)
 * @returns true if the value matches the predicate condition, false otherwise
 *
 * @example
 * ```ts
 * // Simple value check
 * const isEven: Predicate<number> = value => value % 2 === 0
 *
 * // Check using depth
 * const isDeepNode: Predicate<string> = (value, depth) => depth > 2
 *
 * // Check using path context
 * const hasParentNamed: Predicate<string> = (value, depth, path) =>
 *   path.includes('parent')
 * ```
 */
export type Predicate<$Value> = (value: $Value, depth: number, path: $Value[]) => boolean
