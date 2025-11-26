import { Test } from '#test'
import fc from 'fast-check'
import { describe, expect, test } from 'vitest'
import { arbitrary } from './arbitrary.js'
import { Node, Tree } from './data.js'
import { filter, filterPaths, map, merge, prune, reduce, sort, updateAt } from './transformations.js'

const sampleTree = Tree(
  Node('root', [
    Node('a', [
      Node('a1'),
      Node('a2'),
    ]),
    Node('b', [
      Node('b1'),
    ]),
    Node('c'),
  ]),
)

describe('map', () => {
  test('transforms node values', () => {
    const upperTree = map(sampleTree, value => value.toUpperCase())

    expect(upperTree.root!.value).toBe('ROOT')
    expect(upperTree.root!.children[0]!.value).toBe('A')
    expect(upperTree.root!.children[0]!.children[0]!.value).toBe('A1')
  })

  test('provides depth and path', () => {
    const depths: number[] = []
    const paths: string[][] = []

    map(sampleTree, (value, depth, path) => {
      depths.push(depth)
      paths.push(path)
      return value
    })

    expect(depths).toEqual([0, 1, 2, 2, 1, 2, 1])
    expect(paths[0]).toEqual([])
    expect(paths[1]).toEqual(['root'])
    expect(paths[2]).toEqual(['root', 'a'])
  })

  Test.property(
    'map preserves tree structure',
    arbitrary(fc.integer()),
    fc.func(fc.string()),
    (tree, mapper) => {
      const mapped = map(tree, mapper)

      // Structure is preserved
      if (tree.root === null) {
        expect(mapped.root).toBe(null)
      } else {
        expect(mapped.root).not.toBe(null)
        expect(mapped.root!.children.length).toBe(tree.root.children.length)
      }
    },
  )

  Test.property(
    'identity map returns structurally equal tree',
    arbitrary(fc.anything()),
    (tree) => {
      const mapped = map(tree, x => x)

      // Structure should be the same
      if (tree.root === null) {
        expect(mapped.root).toBe(null)
      } else {
        expect(mapped.root).not.toBe(null)
        expect(mapped.root!.children.length).toBe(tree.root.children.length)
      }
    },
  )
})

describe('filter', () => {
  test('short-circuits on non-matching nodes', () => {
    const tree = Tree(
      Node(1, [
        Node(2, [
          Node(4),
          Node(5),
        ]),
        Node(3, [Node(6)]),
      ]),
    )

    // Keep only even numbers - since root (1) doesn't match, entire tree is pruned
    const filtered = filter(tree, value => value % 2 === 0)
    expect(filtered.root).toBe(null)
  })

  test('preserves matching subtrees when root matches', () => {
    const tree = Tree(
      Node(2, [
        Node(3, [
          Node(6),
          Node(7),
        ]),
        Node(4, [Node(8)]),
      ]),
    )

    // Keep only even numbers
    const filtered = filter(tree, value => value % 2 === 0)

    const values: number[] = []
    const collectValues = (node: Node<number>) => {
      values.push(node.value)
      node.children.forEach(collectValues)
    }
    if (filtered.root) collectValues(filtered.root)

    // Root 2 matches, so we get 2 and its even descendants
    expect(values).toEqual([2, 4, 8])
  })

  Test.property(
    'filter with always-true predicate returns same structure',
    arbitrary(fc.integer()),
    (tree) => {
      const filtered = filter(tree, () => true)
      expect(filtered).toBeDefined()
      if (tree.root === null) {
        expect(filtered.root).toBe(null)
      } else {
        expect(filtered.root).not.toBe(null)
      }
    },
  )

  Test.property(
    'filter with always-false predicate returns empty tree',
    fc.anything(),
    (value) => {
      const tree = Tree(Node(value))
      const filtered = filter(tree, () => false)
      expect(filtered.root).toBe(null)
    },
  )
})

describe('filterPaths', () => {
  test('preserves paths to matching nodes', () => {
    const tree = Tree(
      Node(1, [
        Node(2, [
          Node(4),
          Node(5),
        ]),
        Node(3, [Node(6)]),
      ]),
    )

    // Keep only even numbers but preserve paths
    const filtered = filterPaths(tree, value => value % 2 === 0)

    const values: number[] = []
    const collectValues = (node: Node<number>) => {
      values.push(node.value)
      node.children.forEach(collectValues)
    }
    if (filtered.root) collectValues(filtered.root)

    // Should have 1, 2, 4, 3, 6 (odd ancestors preserved)
    expect(values).toEqual([1, 2, 4, 3, 6])
  })

  test('removes branches with no matches', () => {
    const filtered = filterPaths(sampleTree, value => value.includes('1'))

    const values: string[] = []
    const collectValues = (node: Node<string>) => {
      values.push(node.value)
      node.children.forEach(collectValues)
    }
    if (filtered.root) collectValues(filtered.root)

    // Should preserve paths to 'a1' and 'b1'
    expect(values).toEqual(['root', 'a', 'a1', 'b', 'b1'])
  })
})

describe('sort', () => {
  test('orders children', () => {
    const sorted = sort(sampleTree, (a: string, b: string) => b.localeCompare(a))

    expect(sorted.root!.children.map(c => c.value)).toEqual(['c', 'b', 'a'])
    expect(sorted.root!.children[2]!.children.map(c => c.value)).toEqual(['a2', 'a1'])
  })
})

describe('reduce', () => {
  test('accumulates values', () => {
    const concatenated = reduce(
      sampleTree,
      (acc, value) => acc + value,
      '',
    )

    expect(concatenated).toBe('rootaa1a2bb1c')
  })

  Test.property(
    'reduce with count accumulator equals count function',
    arbitrary(fc.integer()),
    (tree) => {
      const reducedCount = reduce(tree, (acc) => acc + 1, 0)
      // Count all nodes in the tree
      const countNodes = (node: Node<number>): number =>
        1 + node.children.reduce((sum, child) => sum + countNodes(child), 0)
      const directCount = tree.root === null ? 0 : countNodes(tree.root)
      expect(reducedCount).toBe(directCount)
    },
  )
})

describe('updateAt', () => {
  test('updates node at path', () => {
    const updated = updateAt(
      sampleTree,
      [0, 1], // path to 'a2' (root -> 'a' -> 'a2')
      node => Node(node.value.toUpperCase(), node.children),
    )

    expect(updated.root!.children[0]!.children[1]!.value).toBe('A2')
  })
})

describe('prune', () => {
  test('removes leaf nodes by default', () => {
    const tree = Tree(
      Node('root', [
        Node('a'), // leaf node
        Node('b', [
          Node('b1'), // leaf node
        ]),
      ]),
    )

    // Default behavior: prune removes all leaf nodes
    const pruned = prune(tree)
    // After pruning leaves, only 'root' and 'b' remain, then 'b' becomes a leaf and is pruned
    expect(pruned.root).toBe(null) // Empty tree after all leaves pruned
  })

  test('removes empty branches with custom isEmpty', () => {
    const withEmpty = Tree(
      Node('root', [
        Node('a', []), // empty branch (no children)
        Node('b', [
          Node('b1'),
        ]),
      ]),
    )

    // Custom isEmpty that only considers nodes with zero children AND a specific value pattern
    const isEmpty = (node: Node<string>) => node.children.length === 0 && node.value !== 'b1'

    const pruned = prune(withEmpty, isEmpty)
    expect(pruned).toBeDefined()
    expect(pruned.root).not.toBe(null)
    expect(pruned.root!.value).toBe('root')
    expect(pruned.root!.children.length).toBe(1)
    expect(pruned.root!.children[0]!.value).toBe('b')
    expect(pruned.root!.children[0]!.children[0]!.value).toBe('b1')
  })
})

describe('merge', () => {
  test('combines two trees', () => {
    const tree1 = Tree(
      Node('root', [
        Node('a', [Node('a1')]),
        Node('b'),
      ]),
    )

    const tree2 = Tree(
      Node('root', [
        Node('a', [Node('a2')]),
        Node('c'),
      ]),
    )

    const merged = merge(tree1, tree2, (a, b) => `${a}+${b}`)

    expect(merged.root).not.toBe(null)
    expect(merged.root!.value).toBe('root+root')
    expect(merged.root!.children.map(c => c.value)).toEqual(['a+a', 'b', 'c'])
    // Since 'a1' and 'a2' are different values, they won't be merged
    // Instead, both will be present as children of the merged 'a' node
    expect(merged.root!.children[0]!.children.map(c => c.value)).toEqual(['a1', 'a2'])
  })
})
