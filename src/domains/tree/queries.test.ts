import { Test } from '#test'
import fc from 'fast-check'
import { describe, expect, test } from 'vitest'
import { arbitrary } from './arbitrary.js'
import { Node, Tree } from './data.js'
import { count, depth, every, find, leaves, path, pathTo, some, visit } from './queries.js'

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
    expect(depth(Tree(Node('single')))).toBe(0)
    expect(depth(sampleTree)).toBe(2)
  })

  Test.property(
    'single node trees have depth 0',
    fc.anything(),
    (value) => {
      const tree = Tree(Node(value))
      expect(depth(tree)).toBe(0)
    },
  )

  Test.property(
    'depth is max of children depths + 1',
    arbitrary(fc.integer()),
    (tree) => {
      const treeDepth = depth(tree)
      if (tree.root === null) {
        expect(treeDepth).toBe(-1) // Empty tree has depth -1
      } else {
        // Calculate node depth
        const nodeDepth = (node: Node<number>): number => {
          if (node.children.length === 0) return 0
          return 1 + Math.max(...node.children.map(nodeDepth))
        }
        const calculatedDepth = nodeDepth(tree.root)
        expect(treeDepth).toBe(calculatedDepth)
      }
    },
  )
})

describe('count', () => {
  test('counts all nodes', () => {
    expect(count(Tree(Node('single')))).toBe(1)
    expect(count(sampleTree)).toBe(7)
  })

  Test.property(
    'count equals 1 + sum of children counts',
    arbitrary(fc.integer()),
    (tree) => {
      const totalCount = count(tree)
      const countNode = (node: Node<number>): number =>
        1 + node.children.reduce((sum, child) => sum + countNode(child), 0)
      const childrenCount = tree.root === null ? 0 : countNode(tree.root)
      expect(totalCount).toBe(childrenCount)
    },
  )

  Test.property(
    'non-empty trees have count at least 1',
    arbitrary(fc.anything()),
    (tree) => {
      const nodeCount = count(tree)
      // Empty tree has count 0, otherwise at least 1
      if (tree.root === null) {
        expect(nodeCount).toBe(0)
      } else {
        expect(nodeCount).toBeGreaterThanOrEqual(1)
      }
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
    'every with always-false predicate returns false for non-empty trees',
    arbitrary(fc.anything()),
    (tree) => {
      // Empty tree returns true for every (vacuous truth)
      if (tree.root === null) {
        expect(every(tree, () => false)).toBe(true)
      } else {
        expect(every(tree, () => false)).toBe(false)
      }
    },
  )
})

describe('some', () => {
  test('tests if any node matches predicate', () => {
    expect(some(sampleTree, value => value === 'b1')).toBe(true)
    expect(some(sampleTree, value => value === 'x')).toBe(false)
  })

  Test.property(
    'some with always-true predicate returns true for non-empty trees',
    arbitrary(fc.anything()),
    (tree) => {
      // Empty tree returns false for some
      if (tree.root === null) {
        expect(some(tree, () => true)).toBe(false)
      } else {
        expect(some(tree, () => true)).toBe(true)
      }
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
      // Skip empty trees as they have different semantics
      if (tree.root === null) return

      const someResult = some(tree, predicate)
      const everyResult = every(tree, (v, d, p) => !predicate(v, d, p))
      // If some match, then NOT every doesn't match
      expect(someResult).toBe(!everyResult)
    },
  )
})

describe('path', () => {
  test('returns path to node', () => {
    const targetNode = sampleTree.root!.children[0]!.children[0]! // a1
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
