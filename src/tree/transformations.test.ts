import { Test } from '#test'
import fc from 'fast-check'
import { describe, expect, test } from 'vitest'
import { arbitrary } from './arbitrary.ts'
import { Node } from './data.ts'
import { filter, map, merge, prune, reduce, sort, updateAt } from './transformations.ts'

const sampleTree = Node('root', [
  Node('a', [
    Node('a1'),
    Node('a2'),
  ]),
  Node('b', [
    Node('b1'),
  ]),
  Node('c'),
])

describe('map', () => {
  test('transforms node values', () => {
    const upperTree = map(sampleTree, value => value.toUpperCase())

    expect(upperTree.value).toBe('ROOT')
    expect(upperTree.children[0]!.value).toBe('A')
    expect(upperTree.children[0]!.children[0]!.value).toBe('A1')
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
      expect(mapped.children.length).toBe(tree.children.length)
    },
  )

  Test.property(
    'identity map returns structurally equal tree',
    arbitrary(fc.anything()),
    (tree) => {
      const mapped = map(tree, x => x)

      // Values should be the same
      expect(mapped.value).toBe(tree.value)
      expect(mapped.children.length).toBe(tree.children.length)
    },
  )
})

describe('filter', () => {
  test('removes non-matching nodes', () => {
    const filtered = filter(sampleTree, value => !value.includes('2'))

    expect(filtered).toBeDefined()
    const values: string[] = []
    const collectValues = (node: Node<string>) => {
      values.push(node.value)
      node.children.forEach(collectValues)
    }
    collectValues(filtered!)
    expect(values).toEqual(['root', 'a', 'a1', 'b', 'b1', 'c'])
  })

  Test.property(
    'filter with always-true predicate returns same structure',
    arbitrary(fc.integer()),
    (tree) => {
      const filtered = filter(tree, () => true)
      expect(filtered).toBeDefined()
      expect(filtered!.value).toBe(tree.value)
    },
  )

  Test.property(
    'filter with always-false predicate returns undefined for leaf',
    fc.anything(),
    (value) => {
      const leaf = Node(value)
      const filtered = filter(leaf, () => false)
      expect(filtered).toBeUndefined()
    },
  )
})

describe('sort', () => {
  test('orders children', () => {
    const sorted = sort(sampleTree, (a: string, b: string) => b.localeCompare(a))

    expect(sorted.children.map(c => c.value)).toEqual(['c', 'b', 'a'])
    expect(sorted.children[2]!.children.map(c => c.value)).toEqual(['a2', 'a1'])
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
      const directCount = tree.children.reduce((sum, child) => sum + reduce(child, (acc) => acc + 1, 0), 1)
      expect(reducedCount).toBe(directCount)
    },
  )
})

describe('updateAt', () => {
  test('updates node at path', () => {
    const updated = updateAt(
      sampleTree,
      [0, 1], // path to 'a2'
      node => Node(node.value.toUpperCase(), node.children),
    )

    expect(updated.children[0]!.children[1]!.value).toBe('A2')
  })
})

describe('prune', () => {
  test('removes leaf nodes by default', () => {
    const tree = Node('root', [
      Node('a'), // leaf node
      Node('b', [
        Node('b1'), // leaf node
      ]),
    ])

    // Default behavior: prune removes all leaf nodes
    const pruned = prune(tree)
    expect(pruned).toBeUndefined() // All nodes become leaves eventually
  })

  test('removes empty branches with custom isEmpty', () => {
    const withEmpty = Node('root', [
      Node('a', []), // empty branch (no children)
      Node('b', [
        Node('b1'),
      ]),
    ])

    // Custom isEmpty that only considers nodes with zero children AND a specific value pattern
    const isEmpty = (node: Node<string>) => node.children.length === 0 && node.value !== 'b1'

    const pruned = prune(withEmpty, isEmpty)
    expect(pruned).toBeDefined()
    expect(pruned!.value).toBe('root')
    expect(pruned!.children.length).toBe(1)
    expect(pruned!.children[0]!.value).toBe('b')
    expect(pruned!.children[0]!.children[0]!.value).toBe('b1')
  })
})

describe('merge', () => {
  test('combines two trees', () => {
    const tree1 = Node('root', [
      Node('a', [Node('a1')]),
      Node('b'),
    ])

    const tree2 = Node('ROOT', [
      Node('a', [Node('a2')]),
      Node('c'),
    ])

    const merged = merge(tree1, tree2, (a, b) => `${a}+${b}`)

    expect(merged.value).toBe('root+ROOT')
    expect(merged.children.map(c => c.value)).toEqual(['a+a', 'b', 'c'])
    // Since 'a1' and 'a2' are different values, they won't be merged
    // Instead, both will be present as children of the merged 'a' node
    expect(merged.children[0]!.children.map(c => c.value)).toEqual(['a1', 'a2'])
  })
})
