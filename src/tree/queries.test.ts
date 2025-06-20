import { Test } from '#test'
import fc from 'fast-check'
import { describe, expect, test } from 'vitest'
import { arbitrary } from './arbitrary.ts'
import { Node } from './data.ts'
import { count, depth, every, find, leaves, path, pathTo, some, visit } from './queries.ts'

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

describe('visit', () => {
  test('traverses all nodes', () => {
    const visited: string[] = []
    visit(sampleTree, node => visited.push(node.value))

    expect(visited).toEqual(['root', 'a', 'a1', 'a2', 'b', 'b1', 'c'])
  })
})

describe('find', () => {
  test('locates node', () => {
    const found = find(sampleTree, value => value === 'b1')
    expect(found?.value).toBe('b1')

    const notFound = find(sampleTree, value => value === 'x')
    expect(notFound).toBeUndefined()
  })
})

describe('depth', () => {
  test('calculates tree depth', () => {
    expect(depth(Node('single'))).toBe(0)
    expect(depth(sampleTree)).toBe(2)
  })

  Test.property(
    'leaf nodes always have depth 0',
    fc.anything(),
    (value) => {
      const leaf = Node(value)
      expect(depth(leaf)).toBe(0)
    },
  )

  Test.property(
    'depth is max of children depths + 1',
    arbitrary(fc.integer()),
    (tree) => {
      const treeDepth = depth(tree)
      if (tree.children.length === 0) {
        expect(treeDepth).toBe(0)
      } else {
        const childDepths = tree.children.map(depth)
        expect(treeDepth).toBe(Math.max(...childDepths) + 1)
      }
    },
  )
})

describe('count', () => {
  test('counts all nodes', () => {
    expect(count(Node('single'))).toBe(1)
    expect(count(sampleTree)).toBe(7)
  })

  Test.property(
    'count equals 1 + sum of children counts',
    arbitrary(fc.integer()),
    (tree) => {
      const totalCount = count(tree)
      const childrenCount = tree.children.reduce((sum, child) => sum + count(child), 0)
      expect(totalCount).toBe(1 + childrenCount)
    },
  )

  Test.property(
    'count is always at least 1',
    arbitrary(fc.anything()),
    (tree) => {
      expect(count(tree)).toBeGreaterThanOrEqual(1)
    },
  )
})

describe('leaves', () => {
  test('gets all leaf nodes', () => {
    const leafNodes = leaves(sampleTree)
    expect(leafNodes.map(n => n.value)).toEqual(['a1', 'a2', 'b1', 'c'])
  })
})

describe('every', () => {
  test('tests if all nodes match predicate', () => {
    expect(every(sampleTree, value => value.length > 0)).toBe(true)
    expect(every(sampleTree, value => value.includes('a'))).toBe(false)
  })

  Test.property(
    'every with always-true predicate returns true',
    arbitrary(fc.anything()),
    (tree) => {
      expect(every(tree, () => true)).toBe(true)
    },
  )

  Test.property(
    'every with always-false predicate returns false',
    arbitrary(fc.anything()),
    (tree) => {
      expect(every(tree, () => false)).toBe(false)
    },
  )
})

describe('some', () => {
  test('tests if any node matches predicate', () => {
    expect(some(sampleTree, value => value === 'b1')).toBe(true)
    expect(some(sampleTree, value => value === 'x')).toBe(false)
  })

  Test.property(
    'some with always-true predicate returns true',
    arbitrary(fc.anything()),
    (tree) => {
      expect(some(tree, () => true)).toBe(true)
    },
  )

  Test.property(
    'some with always-false predicate returns false',
    arbitrary(fc.anything()),
    (tree) => {
      expect(some(tree, () => false)).toBe(false)
    },
  )

  Test.property(
    'some and every are consistent',
    arbitrary(fc.integer()),
    fc.func(fc.boolean()),
    (tree, predicate) => {
      const someResult = some(tree, predicate)
      const everyResult = every(tree, (v, d, p) => !predicate(v, d, p))
      // If some match, then NOT every doesn't match
      expect(someResult).toBe(!everyResult)
    },
  )
})

describe('path', () => {
  test('returns path to node', () => {
    const targetNode = sampleTree.children[0]!.children[0]! // a1
    const result = path(sampleTree, targetNode)

    expect(result?.map(n => n.value)).toEqual(['root', 'a', 'a1'])
  })
})

describe('pathTo', () => {
  test('returns path values to node matching predicate', () => {
    const result = pathTo(sampleTree, value => value === 'a1')

    expect(result).toEqual(['root', 'a', 'a1'])
  })
})
