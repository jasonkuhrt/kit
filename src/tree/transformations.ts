import type { Node } from '#tree/data.js'
import type { Predicate } from '#tree/tree.js'

/**
 * A function that transforms a value from one type to another during tree mapping.
 *
 * @typeParam $FromValue - The input value type
 * @typeParam $ToValue - The output value type
 *
 * @param value - The current value to transform
 * @param depth - The depth of the current node (root is 0)
 * @param path - Array of ancestor values leading to this node (excluding current)
 * @returns The transformed value
 */
export type Mapper<$FromValue, $ToValue> = (value: $FromValue, depth: number, path: $FromValue[]) => $ToValue

/**
 * Filter tree nodes based on a predicate, preserving the tree structure.
 * A node is kept if it matches the predicate OR if it has any matching descendants.
 * This ensures the tree remains connected from root to matching nodes.
 *
 * @param tree - The root node of the tree to filter
 * @param predicate - Function that tests each node's value
 * @param depth - Current depth in the tree (used internally, defaults to 0)
 * @param path - Path of ancestor values (used internally, defaults to [])
 * @returns The filtered tree, or undefined if no nodes match
 *
 * @example
 * ```ts
 * const tree = Node(1, [
 *   Node(2, [
 *     Node(4),
 *     Node(5)
 *   ]),
 *   Node(3, [Node(6)])
 * ])
 *
 * // Keep only even numbers (but preserve path to them)
 * const evenTree = filter(tree, value => value % 2 === 0)
 * // Result structure:
 * // 1 (kept because it has matching descendants)
 * // ├─ 2 (matches)
 * // │  └─ 4 (matches)
 * // └─ 3 (kept because child matches)
 * //    └─ 6 (matches)
 * ```
 */
export const filter = <$Value>(
  tree: Node<$Value>,
  predicate: Predicate<$Value>,
  depth = 0,
  path: $Value[] = [],
): Node<$Value> | undefined => {
  const newPath = [...path, tree.value]
  const filteredChildren = tree.children
    .map(child => filter(child, predicate, depth + 1, newPath))
    .filter((child): child is Node<$Value> => child !== undefined)

  // Keep node if it matches or has matching children
  if (predicate(tree.value, depth, path) || filteredChildren.length > 0) {
    return {
      value: tree.value,
      children: filteredChildren,
    }
  }

  return undefined
}

/**
 * Sort a tree's children at each level using a comparison function.
 * Recursively sorts all levels of the tree while preserving the hierarchy.
 *
 * @param tree - The root node of the tree to sort
 * @param compareFn - Function to compare node values (same as Array.sort)
 * @returns A new tree with sorted children at each level
 *
 * @example
 * ```ts
 * const tree = Node('root', [
 *   Node('zebra', [Node('cat'), Node('ant')]),
 *   Node('apple', [Node('dog'), Node('bee')])
 * ])
 *
 * // Sort alphabetically
 * const sorted = sort(tree, (a, b) => a.localeCompare(b))
 * // Result: root -> [apple -> [bee, dog], zebra -> [ant, cat]]
 *
 * // Sort numbers in descending order
 * const numTree = Node(0, [Node(3), Node(1), Node(2)])
 * const descending = sort(numTree, (a, b) => b - a)
 * // Result: 0 -> [3, 2, 1]
 * ```
 */
export const sort = <$Value>(
  tree: Node<$Value>,
  compareFn: (a: $Value, b: $Value) => number,
): Node<$Value> => ({
  value: tree.value,
  children: tree.children
    .map(child => sort(child, compareFn))
    .sort((a, b) => compareFn(a.value, b.value)),
})

/**
 * Transform a tree by applying a mapping function to each node's value.
 * The tree structure is preserved, only values are transformed.
 *
 * @param tree - The root node of the tree to map
 * @param mapper - Function to transform each value
 * @param depth - Current depth in the tree (used internally, defaults to 0)
 * @param path - Path of ancestor values (used internally, defaults to [])
 * @returns A new tree with transformed values
 *
 * @example
 * ```ts
 * const stringTree = Node('hello', [
 *   Node('world', [Node('foo')]),
 *   Node('bar')
 * ])
 *
 * // Transform to uppercase
 * const upperTree = map(stringTree, value => value.toUpperCase())
 * // Result: HELLO -> [WORLD -> [FOO], BAR]
 *
 * // Transform to lengths
 * const lengthTree = map(stringTree, value => value.length)
 * // Result: 5 -> [5 -> [3], 3]
 *
 * // Transform with depth info
 * const depthTree = map(stringTree, (value, depth) => `${value}@${depth}`)
 * // Result: hello@0 -> [world@1 -> [foo@2], bar@1]
 * ```
 */
export const map = <$FromValue, $ToValue>(
  tree: Node<$FromValue>,
  mapper: Mapper<$FromValue, $ToValue>,
  depth = 0,
  path: $FromValue[] = [],
): Node<$ToValue> => {
  const newPath = [...path, tree.value]
  return {
    value: mapper(tree.value, depth, path),
    children: tree.children.map(child => map(child, mapper, depth + 1, newPath)),
  }
}

/**
 * Update a specific node in the tree at the given path.
 * The path is an array of child indices from root to target node.
 *
 * @param tree - The root node of the tree
 * @param path - Array of child indices leading to the target node
 * @param updater - Function to transform the target node
 * @returns A new tree with the updated node
 *
 * @example
 * ```ts
 * const tree = Node('A', [
 *   Node('B', [
 *     Node('D'),
 *     Node('E')
 *   ]),
 *   Node('C')
 * ])
 *
 * // Update node E at path [0, 1] (first child, second grandchild)
 * const updated = updateAt(tree, [0, 1], node =>
 *   Node('E-updated', node.children)
 * )
 *
 * // Update node B and add a child
 * const withNewChild = updateAt(tree, [0], node =>
 *   Node(node.value, [...node.children, Node('F')])
 * )
 * ```
 */
export const updateAt = <$Value>(
  tree: Node<$Value>,
  path: number[],
  updater: (node: Node<$Value>) => Node<$Value>,
): Node<$Value> => {
  if (path.length === 0) {
    return updater(tree)
  }

  const [index, ...rest] = path
  const children = [...tree.children]

  if (index !== undefined && index >= 0 && index < children.length) {
    children[index] = updateAt(children[index]!, rest, updater)
  }

  return { ...tree, children }
}

/**
 * Remove empty branches from a tree based on a custom emptiness check.
 * By default, removes all leaf nodes (nodes with no children).
 * Works bottom-up: prunes children first, then checks if parent becomes empty.
 *
 * @param tree - The root node of the tree to prune
 * @param isEmpty - Function to determine if a node should be pruned (defaults to checking for no children)
 * @returns The pruned tree, or undefined if the entire tree is pruned
 *
 * @example
 * ```ts
 * const tree = Node('root', [
 *   Node('branch1', [
 *     Node('leaf1'),
 *     Node('leaf2')
 *   ]),
 *   Node('branch2'),  // empty branch
 *   Node('branch3', [Node('leaf3')])
 * ])
 *
 * // Remove all leaves (default behavior)
 * const noLeaves = prune(tree)
 * // Result: undefined (all branches become empty after removing leaves)
 *
 * // Remove nodes with specific values
 * const filtered = prune(tree, node =>
 *   node.value.includes('leaf') ||
 *   (node.children.length === 0 && node.value === 'branch2')
 * )
 *
 * // Keep at least one level
 * const keepBranches = prune(tree, node =>
 *   node.children.length === 0 && !node.value.includes('branch')
 * )
 * ```
 */
export const prune = <$Value>(
  tree: Node<$Value>,
  isEmpty: (node: Node<$Value>) => boolean = node => node.children.length === 0,
): Node<$Value> | undefined => {
  const prunedChildren = tree.children
    .map(child => prune(child, isEmpty))
    .filter((child): child is Node<$Value> => child !== undefined)

  const prunedNode = { ...tree, children: prunedChildren }

  // Remove this node if it's empty after pruning children
  if (isEmpty(prunedNode)) {
    return undefined
  }

  return prunedNode
}

/**
 * Reduce a tree to a single value by applying a reducer function to each node.
 * Processes nodes in depth-first order, accumulating a result.
 *
 * @param tree - The root node of the tree to reduce
 * @param reducer - Function to accumulate values
 * @param initial - The initial accumulator value
 * @param depth - Current depth in the tree (used internally, defaults to 0)
 * @param path - Path of ancestor values (used internally, defaults to [])
 * @returns The final accumulated value
 *
 * @example
 * ```ts
 * const tree = Node(1, [
 *   Node(2, [Node(3), Node(4)]),
 *   Node(5)
 * ])
 *
 * // Sum all values
 * const sum = reduce(tree, (acc, value) => acc + value, 0)
 * console.log(sum) // 15
 *
 * // Collect all values at depth 2
 * const depth2Values = reduce(tree,
 *   (acc, value, depth) => depth === 2 ? [...acc, value] : acc,
 *   [] as number[]
 * )
 * console.log(depth2Values) // [3, 4]
 *
 * // Build a path string
 * const pathString = reduce(tree,
 *   (acc, value, depth, path) =>
 *     acc + '  '.repeat(depth) + value + '\n',
 *   ''
 * )
 * ```
 */
export const reduce = <$Value, $Result>(
  tree: Node<$Value>,
  reducer: (acc: $Result, value: $Value, depth: number, path: $Value[]) => $Result,
  initial: $Result,
  depth = 0,
  path: $Value[] = [],
): $Result => {
  const acc = reducer(initial, tree.value, depth, path)
  const newPath = [...path, tree.value]
  return tree.children.reduce(
    (acc, child) => reduce(child, reducer, acc, depth + 1, newPath),
    acc,
  )
}

/**
 * A function that defines how to merge two values when combining trees.
 *
 * @typeParam $Value - The type of values being merged
 *
 * @param a - The value from the first tree
 * @param b - The value from the second tree
 * @returns The merged value
 *
 * @example
 * ```ts
 * // Take the second value (default)
 * const takeSecond: MergeStrategy<string> = (a, b) => b
 *
 * // Concatenate strings
 * const concat: MergeStrategy<string> = (a, b) => `${a}+${b}`
 *
 * // Sum numbers
 * const sum: MergeStrategy<number> = (a, b) => a + b
 * ```
 */
export type MergeStrategy<$Value> = (a: $Value, b: $Value) => $Value

/**
 * Merge two trees by combining nodes with matching values.
 * Children are matched by their values and merged recursively.
 * Unmatched children from both trees are preserved.
 *
 * @param tree1 - The first tree
 * @param tree2 - The second tree
 * @param mergeValues - Strategy for merging node values (defaults to taking second value)
 * @returns A new merged tree
 *
 * @example
 * ```ts
 * const tree1 = Node('root', [
 *   Node('shared', [Node('a1')]),
 *   Node('only1')
 * ])
 *
 * const tree2 = Node('root', [
 *   Node('shared', [Node('a2')]),
 *   Node('only2')
 * ])
 *
 * // Default merge (take second value)
 * const merged = merge(tree1, tree2)
 * // Result: root -> [shared -> [a1, a2], only1, only2]
 *
 * // Custom merge strategy
 * const sumTree1 = Node(1, [Node(2), Node(3)])
 * const sumTree2 = Node(10, [Node(2), Node(4)])
 * const summed = merge(sumTree1, sumTree2, (a, b) => a + b)
 * // Result: 11 -> [4, 3, 4]
 * //   (2+2=4 for matching child, 3 from tree1, 4 from tree2)
 * ```
 */
export const merge = <$Value>(
  tree1: Node<$Value>,
  tree2: Node<$Value>,
  mergeValues: MergeStrategy<$Value> = (a, b) => b, // default: take second value
): Node<$Value> => {
  // Merge the values using the provided strategy
  const mergedValue = mergeValues(tree1.value, tree2.value)

  // Create a map of tree2's children for efficient lookup
  const tree2ChildMap = new Map<unknown, Node<$Value>>()
  tree2.children.forEach(child => {
    // Use value as key, or could use a key extractor function
    tree2ChildMap.set(child.value, child)
  })

  // Merge children
  const mergedChildren: Node<$Value>[] = []

  // Process tree1's children
  tree1.children.forEach(child1 => {
    const matchingChild2 = tree2ChildMap.get(child1.value)
    if (matchingChild2) {
      mergedChildren.push(merge(child1, matchingChild2, mergeValues))
      tree2ChildMap.delete(child1.value)
    } else {
      mergedChildren.push(child1)
    }
  })

  // Add remaining children from tree2
  tree2ChildMap.forEach(child2 => {
    mergedChildren.push(child2)
  })

  return {
    value: mergedValue,
    children: mergedChildren,
  }
}
