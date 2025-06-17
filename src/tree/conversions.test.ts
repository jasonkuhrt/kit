import { Test } from '#test/index.js'
import * as fc from 'fast-check'
import { describe, expect, test } from 'vitest'
import { arbitrary } from './arbitrary.js'
import { fromList, toList } from './conversions.js'
import { Node } from './data.js'

describe('toList', () => {
  test('flattens tree to array', () => {
    const tree = Node('root', [
      Node('a', [
        Node('a1'),
        Node('a2'),
      ]),
      Node('b', [
        Node('b1'),
      ]),
      Node('c'),
    ])

    const flat = toList(tree)
    expect(flat).toEqual(['root', 'a', 'a1', 'a2', 'b', 'b1', 'c'])
  })

  Test.property(
    'toList contains all node values',
    arbitrary(fc.integer()),
    (tree) => {
      const list = toList(tree)

      // List should contain at least the root value
      expect(list).toContain(tree.value)

      // List length should equal total node count
      const countNodes = (node: Node<number>): number =>
        1 + node.children.reduce((sum, child) => sum + countNodes(child), 0)
      expect(list.length).toBe(countNodes(tree))
    },
  )

  Test.property(
    'toList preserves depth-first order',
    fc.integer(),
    fc.array(fc.integer(), { minLength: 1, maxLength: 3 }),
    (rootValue, childValues) => {
      const children = childValues.map(v => Node(v))
      const tree = Node(rootValue, children)
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

    const trees = fromList(items, undefined)
    expect(trees).toHaveLength(1)
    expect(trees[0]!.value.name).toBe('root')
    expect(trees[0]!.children).toHaveLength(2)
    expect(trees[0]!.children[0]!.children[0]!.value.name).toBe('grandchild')
  })

  test('handles multiple roots', () => {
    const items = [
      { id: '1', name: 'root1' },
      { id: '2', name: 'root2' },
      { id: '3', parentId: '1', name: 'child1' },
      { id: '4', parentId: '2', name: 'child2' },
    ]

    const trees = fromList(items, undefined)
    expect(trees).toHaveLength(2)
    expect(trees[0]!.value.name).toBe('root1')
    expect(trees[1]!.value.name).toBe('root2')
    expect(trees[0]!.children[0]!.value.name).toBe('child1')
    expect(trees[1]!.children[0]!.value.name).toBe('child2')
  })
})
