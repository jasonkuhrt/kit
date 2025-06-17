import { Node } from './data.js'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • List
//
//

/**
 * Flatten a tree into an array using depth-first traversal.
 * The root value comes first, followed by all descendant values
 * in the order they would be visited in a depth-first search.
 *
 * @param tree - The root node of the tree to flatten
 * @returns Array containing all values in depth-first order
 *
 * @example
 * ```ts
 * const tree = Node('A', [
 *   Node('B', [
 *     Node('D'),
 *     Node('E')
 *   ]),
 *   Node('C', [Node('F')])
 * ])
 *
 * const list = toList(tree)
 * console.log(list) // ['A', 'B', 'D', 'E', 'C', 'F']
 *
 * // Works with any value type
 * const numTree = Node(1, [
 *   Node(2, [Node(4), Node(5)]),
 *   Node(3)
 * ])
 * console.log(toList(numTree)) // [1, 2, 4, 5, 3]
 * ```
 */
export const toList = <$Value>(tree: Node<$Value>): $Value[] => {
  const result: $Value[] = [tree.value]
  tree.children.forEach(child => {
    result.push(...toList(child))
  })
  return result
}

/**
 * Build a tree (or forest) from a flat list of items with parent references.
 * Each item must have an `id` and optionally a `parentId` to establish hierarchy.
 * Items with no parent or matching rootId become root nodes.
 *
 * @param values - Array of items with id and parentId properties
 * @param rootId - Optional ID to use as the root parent (defaults to undefined)
 * @returns Array of root nodes forming a forest
 *
 * @example
 * ```ts
 * const items = [
 *   { id: '1', name: 'Root' },
 *   { id: '2', parentId: '1', name: 'Child A' },
 *   { id: '3', parentId: '1', name: 'Child B' },
 *   { id: '4', parentId: '2', name: 'Grandchild' },
 *   { id: '5', name: 'Another Root' }
 * ]
 *
 * const forest = fromList(items)
 * // Result: Two trees:
 * // 1. Root -> [Child A -> [Grandchild], Child B]
 * // 2. Another Root
 *
 * // Build tree with specific root
 * const categories = [
 *   { id: 'electronics', parentId: 'root' },
 *   { id: 'computers', parentId: 'electronics' },
 *   { id: 'phones', parentId: 'electronics' },
 *   { id: 'laptops', parentId: 'computers' }
 * ]
 *
 * const categoryTree = fromList(categories, 'root')
 * // Result: [electronics -> [computers -> [laptops], phones]]
 * ```
 */
export const fromList = <value extends { id: string; parentId?: string }>(
  values: value[],
  rootId?: string,
): Node<value>[] => {
  // const itemMap = new Map(items.map(item => [item.id, item]))
  const roots: Node<value>[] = []
  const nodeMap = new Map<string, Node<value>>()

  // Create all nodes
  values.forEach(item => {
    nodeMap.set(item.id, Node(item))
  })

  // Build hierarchy
  values.forEach(item => {
    const itemNode = nodeMap.get(item.id)!
    if (item.parentId === rootId || !item.parentId) {
      // Items match the rootId OR have no parent (orphans) become roots
      roots.push(itemNode)
    } else if (item.parentId) {
      const parent = nodeMap.get(item.parentId)
      if (parent) {
        parent.children.push(itemNode)
      }
    }
  })

  return roots
}

/**
 * Build a single tree from a flat list of items with parent references.
 * This is a variant of {@link fromList} that ensures exactly one root node is found.
 * Throws an error if zero or multiple root nodes are found.
 *
 * @param values - Array of items with id and parentId properties
 * @param rootId - Optional ID to use as the root parent (defaults to undefined)
 * @returns Single root node
 * @throws Error if not exactly one root is found
 *
 * @example
 * ```ts
 * const items = [
 *   { id: '1', name: 'Root' },
 *   { id: '2', parentId: '1', name: 'Child A' },
 *   { id: '3', parentId: '1', name: 'Child B' },
 *   { id: '4', parentId: '2', name: 'Grandchild' }
 * ]
 *
 * const tree = oneFromList(items)
 * console.log(tree.value.name) // 'Root'
 *
 * // Error cases:
 * const multipleRoots = [
 *   { id: '1', name: 'Root 1' },
 *   { id: '2', name: 'Root 2' }
 * ]
 * oneFromList(multipleRoots) // Throws: Expected exactly one root node, found 2
 *
 * const noRoots = [
 *   { id: '1', parentId: 'missing', name: 'Orphan' }
 * ]
 * oneFromList(noRoots, 'root') // Throws: Expected exactly one root node, found 0
 * ```
 */
export const oneFromList = <value extends { id: string; parentId?: string }>(
  values: value[],
  rootId?: string,
): Node<value> => {
  const roots = fromList(values, rootId)

  if (roots.length === 0) {
    throw new Error('Expected exactly one root node, found 0')
  }

  if (roots.length > 1) {
    throw new Error(`Expected exactly one root node, found ${roots.length}`)
  }

  return roots[0]!
}
