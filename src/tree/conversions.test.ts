import { Test } from '#test'
import fc from 'fast-check'
import { describe, expect, test } from 'vitest'
import { arbitrary } from './arbitrary.ts'
import { fromList, manyFromList, toList } from './conversions.ts'
import { Node, Tree } from './data.ts'

describe('toList', () => {
  test('flattens tree to array', () => {
    const tree = Tree(
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

    const flat = toList(tree)
    expect(flat).toEqual(['root', 'a', 'a1', 'a2', 'b', 'b1', 'c'])
  })

  Test.property(
    'toList contains all node values',
    arbitrary(fc.integer()),
    (tree) => {
      const list = toList(tree)

      // List length should equal total node count
      const countNodes = (node: Node<number>): number =>
        1 + node.children.reduce((sum: number, child) => sum + countNodes(child), 0)
      const totalCount = tree.root === null ? 0 : countNodes(tree.root)
      expect(list.length).toBe(totalCount)
    },
  )

  Test.property(
    'toList preserves depth-first order',
    fc.integer(),
    fc.array(fc.integer(), { minLength: 1, maxLength: 3 }),
    (rootValue, childValues) => {
      const children = childValues.map(v => Node(v))
      const tree = Tree(Node(rootValue, children))
      const list = toList(tree)

      // Root should be first
      expect(list[0]).toBe(rootValue)

      // Children values should follow
      childValues.forEach((value, index) => {
        expect(list[index + 1]).toBe(value)
      })
    },
  )
})

describe('fromList', () => {
  test('builds tree from flat list', () => {
    const items = [
      { id: '1', name: 'root' },
      { id: '2', parentId: '1', name: 'child1' },
      { id: '3', parentId: '1', name: 'child2' },
      { id: '4', parentId: '2', name: 'grandchild' },
    ]

    const forest = manyFromList(items, undefined)
    expect(forest).toHaveLength(1)
    expect(forest[0]!.root!.value.name).toBe('root')
    expect(forest[0]!.root!.children).toHaveLength(2)
    expect(forest[0]!.root!.children[0]!.children[0]!.value.name).toBe('grandchild')
  })

  test('handles multiple roots', () => {
    const items = [
      { id: '1', name: 'root1' },
      { id: '2', name: 'root2' },
      { id: '3', parentId: '1', name: 'child1' },
      { id: '4', parentId: '2', name: 'child2' },
    ]

    const forest = manyFromList(items, undefined)
    expect(forest).toHaveLength(2)
    expect(forest[0]!.root!.value.name).toBe('root1')
    expect(forest[1]!.root!.value.name).toBe('root2')
    expect(forest[0]!.root!.children[0]!.value.name).toBe('child1')
    expect(forest[1]!.root!.children[0]!.value.name).toBe('child2')
  })

  test('handles items without parentId when rootId is specified', () => {
    const items = [
      { id: '1', parentId: 'root', name: 'child-of-root' },
      { id: '2', name: 'orphan-1' }, // no parentId
      { id: '3', parentId: '2', name: 'child-of-orphan' },
      { id: '4', name: 'orphan-2' }, // no parentId
    ]

    // When rootId is 'root', items without parentId get lost in current implementation
    const forest = manyFromList(items, 'root')

    // BUG: This test demonstrates that orphan nodes (without parentId) are lost
    // when a specific rootId is provided. They should be included as roots.
    expect(forest).toHaveLength(3) // Should include the orphans as roots
    expect(forest.map((t: any) => t.root!.value.name).sort()).toEqual([
      'child-of-root',
      'orphan-1',
      'orphan-2',
    ])
  })
})

describe('oneFromList', () => {
  test('returns single tree when exactly one root exists', () => {
    const items = [
      { id: '1', name: 'root' },
      { id: '2', parentId: '1', name: 'child1' },
      { id: '3', parentId: '1', name: 'child2' },
      { id: '4', parentId: '2', name: 'grandchild' },
    ]

    const tree = fromList(items)
    expect(tree.root).not.toBe(null)
    expect(tree.root!.value.name).toBe('root')
    expect(tree.root!.children).toHaveLength(2)
    expect(tree.root!.children[0]!.value.name).toBe('child1')
    expect(tree.root!.children[1]!.value.name).toBe('child2')
  })

  test('returns empty tree when no roots found', () => {
    const items = [
      { id: '1', parentId: 'missing', name: 'orphan1' },
      { id: '2', parentId: 'missing', name: 'orphan2' },
    ]

    const tree = fromList(items, 'root')
    expect(tree.root).toBe(null)
  })

  test('throws when multiple roots found', () => {
    const items = [
      { id: '1', name: 'root1' },
      { id: '2', name: 'root2' },
      { id: '3', parentId: '1', name: 'child' },
    ]

    expect(() => fromList(items)).toThrow('Found multiple root nodes, count: 2')
  })

  test('works with specific rootId', () => {
    const items = [
      { id: '1', parentId: 'app', name: 'main' },
      { id: '2', parentId: '1', name: 'sidebar' },
      { id: '3', parentId: '1', name: 'content' },
    ]

    const tree = fromList(items, 'app')
    expect(tree.root).not.toBe(null)
    expect(tree.root!.value.name).toBe('main')
    expect(tree.root!.children).toHaveLength(2)
  })

  test('handles orphan nodes as additional roots causing error', () => {
    const items = [
      { id: '1', parentId: 'root', name: 'proper-child' },
      { id: '2', name: 'orphan' }, // This will also be a root
      { id: '3', parentId: '2', name: 'child-of-orphan' },
    ]

    // With the fix, orphans are treated as roots, so this should throw
    expect(() => fromList(items, 'root')).toThrow('Found multiple root nodes, count: 2')
  })
})
