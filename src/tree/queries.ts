import type { Predicate } from '#tree/tree.js'
import { isLeaf, type Node } from './data.js'

/**
 * A function that visits a node in the tree during traversal.
 *
 * @typeParam $Value - The type of value stored in tree nodes
 * @typeParam $Result - The return type of the visitor function (defaults to void)
 *
 * @param node - The current node being visited
 * @param depth - The depth of the current node (root is 0)
 * @param path - Array of ancestor values leading to this node (excluding current)
 * @returns The result of visiting the node
 */
export type Visitor<$Value, $Result = void> = (node: Node<$Value>, depth: number, path: $Value[]) => $Result

/**
 * Find the first node in the tree that matches the given predicate.
 * Uses depth-first search to traverse the tree.
 *
 * @param tree - The root node of the tree to search
 * @param predicate - Function that tests each node's value
 * @param depth - Current depth in the tree (used internally, defaults to 0)
 * @param path - Path of ancestor values (used internally, defaults to [])
 * @returns The first matching node, or undefined if no match is found
 *
 * @example
 * ```ts
 * const tree = Node(1, [
 *   Node(2, [Node(4), Node(5)]),
 *   Node(3, [Node(6)])
 * ])
 *
 * // Find node with value 5
 * const node = find(tree, value => value === 5)
 * console.log(node?.value) // 5
 *
 * // Find node at specific depth
 * const deepNode = find(tree, (value, depth) => depth === 2 && value > 4)
 * console.log(deepNode?.value) // 4
 * ```
 */
export const find = <$Value>(
  tree: Node<$Value>,
  predicate: Predicate<$Value>,
  depth = 0,
  path: $Value[] = [],
): Node<$Value> | undefined => {
  if (predicate(tree.value, depth, path)) {
    return tree
  }
  const newPath = [...path, tree.value]
  for (const child of tree.children) {
    const found = find(child, predicate, depth + 1, newPath)
    if (found) return found
  }
  return undefined
}

/**
 * Calculate the maximum depth of the tree.
 * The depth is the length of the longest path from root to any leaf.
 * A single node (leaf) has depth 0.
 *
 * @param tree - The root node of the tree
 * @returns The maximum depth of the tree
 *
 * @example
 * ```ts
 * const leaf = Node('leaf')
 * console.log(depth(leaf)) // 0
 *
 * const tree = Node('root', [
 *   Node('level1', [
 *     Node('level2', [
 *       Node('level3')
 *     ])
 *   ])
 * ])
 * console.log(depth(tree)) // 3
 * ```
 */
export const depth = <$Value>(tree: Node<$Value>): number => {
  if (tree.children.length === 0) return 0
  return 1 + Math.max(...tree.children.map(depth))
}

/**
 * Count the total number of nodes in the tree.
 * Includes the root node and all descendants.
 *
 * @param tree - The root node of the tree
 * @returns The total number of nodes in the tree
 *
 * @example
 * ```ts
 * const single = Node('single')
 * console.log(count(single)) // 1
 *
 * const tree = Node('root', [
 *   Node('child1', [Node('grandchild1')]),
 *   Node('child2')
 * ])
 * console.log(count(tree)) // 4
 * ```
 */
export const count = <$Value>(tree: Node<$Value>): number => {
  return 1 + tree.children.reduce((sum, child) => sum + count(child), 0)
}

/**
 * Get all leaf nodes in the tree.
 * Leaf nodes are nodes that have no children.
 *
 * @param tree - The root node of the tree
 * @returns Array of all leaf nodes in depth-first order
 *
 * @example
 * ```ts
 * const tree = Node('root', [
 *   Node('branch', [
 *     Node('leaf1'),
 *     Node('leaf2')
 *   ]),
 *   Node('leaf3')
 * ])
 *
 * const leafNodes = leaves(tree)
 * console.log(leafNodes.map(n => n.value)) // ['leaf1', 'leaf2', 'leaf3']
 * ```
 */
export const leaves = <$Value>(tree: Node<$Value>): Node<$Value>[] => {
  if (isLeaf(tree)) return [tree]
  return tree.children.flatMap(leaves)
}

/**
 * Visit each node in the tree using depth-first traversal.
 * The visitor function is called for each node with its depth and path information.
 *
 * @param tree - The root node of the tree to traverse
 * @param visitor - Function to call for each node
 * @param depth - Current depth in the tree (used internally, defaults to 0)
 * @param path - Path of ancestor values (used internally, defaults to [])
 *
 * @example
 * ```ts
 * const tree = Node('A', [
 *   Node('B', [Node('D'), Node('E')]),
 *   Node('C')
 * ])
 *
 * // Print each node with its depth
 * visit(tree, (node, depth) => {
 *   console.log('  '.repeat(depth) + node.value)
 * })
 * // Output:
 * // A
 * //   B
 * //     D
 * //     E
 * //   C
 *
 * // Collect all values at depth 2
 * const depth2Values: string[] = []
 * visit(tree, (node, depth) => {
 *   if (depth === 2) depth2Values.push(node.value)
 * })
 * console.log(depth2Values) // ['D', 'E']
 * ```
 */
export const visit = <$Value>(
  tree: Node<$Value>,
  visitor: Visitor<$Value>,
  depth = 0,
  path: $Value[] = [],
): void => {
  visitor(tree, depth, path)
  const newPath = [...path, tree.value]
  tree.children.forEach(child => visit(child, visitor, depth + 1, newPath))
}

/**
 * Test if all nodes in the tree satisfy the given predicate.
 * Returns true only if every node passes the test.
 *
 * @param tree - The root node of the tree to test
 * @param predicate - Function that tests each node's value
 * @param depth - Current depth in the tree (used internally, defaults to 0)
 * @param path - Path of ancestor values (used internally, defaults to [])
 * @returns true if all nodes satisfy the predicate, false otherwise
 *
 * @example
 * ```ts
 * const numberTree = Node(10, [
 *   Node(20, [Node(30)]),
 *   Node(40)
 * ])
 *
 * // Check if all values are positive
 * console.log(every(numberTree, value => value > 0)) // true
 *
 * // Check if all values are less than 35
 * console.log(every(numberTree, value => value < 35)) // false (40 fails)
 *
 * // Check depth constraint
 * console.log(every(numberTree, (value, depth) => depth <= 2)) // true
 * ```
 */
export const every = <$Value>(
  tree: Node<$Value>,
  predicate: Predicate<$Value>,
  depth = 0,
  path: $Value[] = [],
): boolean => {
  if (!predicate(tree.value, depth, path)) return false
  const newPath = [...path, tree.value]
  return tree.children.every(child => every(child, predicate, depth + 1, newPath))
}

/**
 * Test if any node in the tree satisfies the given predicate.
 * Returns true if at least one node passes the test.
 *
 * @param tree - The root node of the tree to test
 * @param predicate - Function that tests each node's value
 * @param depth - Current depth in the tree (used internally, defaults to 0)
 * @param path - Path of ancestor values (used internally, defaults to [])
 * @returns true if any node satisfies the predicate, false otherwise
 *
 * @example
 * ```ts
 * const tree = Node('root', [
 *   Node('apple', [Node('red')]),
 *   Node('banana')
 * ])
 *
 * // Check if any node contains 'apple'
 * console.log(some(tree, value => value.includes('apple'))) // true
 *
 * // Check if any leaf node exists
 * console.log(some(tree, (value, depth, path) =>
 *   path.length > 0 && depth > 1
 * )) // true (for 'red')
 * ```
 */
export const some = <$Value>(
  tree: Node<$Value>,
  predicate: Predicate<$Value>,
  depth = 0,
  path: $Value[] = [],
): boolean => {
  if (predicate(tree.value, depth, path)) return true
  const newPath = [...path, tree.value]
  return tree.children.some(child => some(child, predicate, depth + 1, newPath))
}

/**
 * Get the path from the root to a target node.
 * The path includes all nodes from root to target (inclusive).
 *
 * @param tree - The root node of the tree to search
 * @param target - Either a specific node reference or a predicate function to find the target
 * @param currentPath - Path being built (used internally, defaults to [])
 * @returns Array of nodes from root to target, or undefined if target not found
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
 * // Find path to node with value 'E'
 * const pathToE = path(tree, value => value === 'E')
 * console.log(pathToE?.map(n => n.value)) // ['A', 'B', 'E']
 *
 * // Find path to specific node reference
 * const nodeD = tree.children[0].children[0]
 * const pathToD = path(tree, nodeD)
 * console.log(pathToD?.map(n => n.value)) // ['A', 'B', 'D']
 * ```
 */
export const path = <$Value>(
  tree: Node<$Value>,
  target: Node<$Value> | ((value: $Value) => boolean),
  currentPath: Node<$Value>[] = [],
): Node<$Value>[] | undefined => {
  const newPath = [...currentPath, tree]

  if (typeof target === 'function') {
    if (target(tree.value)) return newPath
  } else if (tree === target) {
    return newPath
  }

  for (const child of tree.children) {
    const found = path(child, target, newPath)
    if (found) return found
  }

  return undefined
}

/**
 * Get the path of values from the root to a node matching the predicate.
 * Similar to {@link path} but returns just the values instead of node objects.
 *
 * @param tree - The root node of the tree to search
 * @param predicate - Function that tests each node's value
 * @param currentPath - Path being built (used internally, defaults to [])
 * @param depth - Current depth in the tree (used internally, defaults to 0)
 * @returns Array of values from root to target, or undefined if no match found
 *
 * @example
 * ```ts
 * const fileTree = Node('/', [
 *   Node('home', [
 *     Node('user', [
 *       Node('documents', [
 *         Node('file.txt')
 *       ])
 *     ])
 *   ])
 * ])
 *
 * // Find path to file.txt
 * const filePath = pathTo(fileTree, value => value === 'file.txt')
 * console.log(filePath) // ['/', 'home', 'user', 'documents', 'file.txt']
 *
 * // Find path to any .txt file
 * const txtPath = pathTo(fileTree, value => value.endsWith('.txt'))
 * console.log(txtPath?.join('/')) // '/home/user/documents/file.txt'
 * ```
 */
export const pathTo = <$Value>(
  tree: Node<$Value>,
  predicate: Predicate<$Value>,
  currentPath: $Value[] = [],
  depth = 0,
): $Value[] | undefined => {
  const newPath = [...currentPath, tree.value]

  if (predicate(tree.value, depth, currentPath)) {
    return newPath
  }

  for (const child of tree.children) {
    const found = pathTo(child, predicate, newPath, depth + 1)
    if (found) return found
  }

  return undefined
}
