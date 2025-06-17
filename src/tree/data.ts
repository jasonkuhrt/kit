/**
 * A tree data structure represented as a Node with a value and children.
 * Trees are hierarchical structures where each node can have zero or more child nodes.
 *
 * @typeParam $Value - The type of value stored in each node
 *
 * @example
 * ```ts
 * type FileTree = Tree<string>
 * const fileSystem: FileTree = {
 *   value: 'root',
 *   children: [
 *     { value: 'src', children: [] },
 *     { value: 'docs', children: [] }
 *   ]
 * }
 * ```
 */
export type Tree<$Value> = Node<$Value>

/**
 * A node in a tree structure containing a value and an array of child nodes.
 *
 * @typeParam $Value - The type of value stored in the node
 *
 * @property value - The data stored in this node
 * @property children - Array of child nodes (empty array for leaf nodes)
 *
 * @example
 * ```ts
 * const node: Node<number> = {
 *   value: 42,
 *   children: [
 *     { value: 10, children: [] },
 *     { value: 20, children: [] }
 *   ]
 * }
 * ```
 */
export interface Node<$Value> {
  value: $Value
  children: Node<$Value>[]
}

/**
 * Create a new tree node with the given value and optional children.
 * This is a convenience constructor function for creating Node objects.
 *
 * @param value - The value to store in the node
 * @param children - Optional array of child nodes (defaults to empty array)
 * @returns A new Node object with the specified value and children
 *
 * @example
 * ```ts
 * // Create a leaf node
 * const leaf = Node('leaf-value')
 *
 * // Create a node with children
 * const parent = Node('parent', [
 *   Node('child1'),
 *   Node('child2')
 * ])
 *
 * // Create a complex tree
 * const tree = Node('root', [
 *   Node('branch1', [
 *     Node('leaf1'),
 *     Node('leaf2')
 *   ]),
 *   Node('branch2', [
 *     Node('leaf3')
 *   ])
 * ])
 * ```
 */
export const Node = <value>(value: value, children: Node<value>[] = []): Node<value> => ({
  value,
  children,
})

/**
 * Check if a node is a leaf (has no children).
 * Leaf nodes are the terminal nodes in a tree that have no descendants.
 *
 * @param node - The node to check
 * @returns `true` if the node has no children, `false` otherwise
 *
 * @example
 * ```ts
 * const leaf = Node('leaf')
 * const parent = Node('parent', [Node('child')])
 *
 * console.log(isLeaf(leaf))   // true
 * console.log(isLeaf(parent)) // false
 * ```
 */
export const isLeaf = <T>(node: Node<T>): boolean => {
  return node.children.length === 0
}
