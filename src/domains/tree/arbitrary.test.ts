import { Test } from '#test'
import fc from 'fast-check'
import { describe, expect } from 'vitest'
import { arbitrary, arbitraryShapes } from './arbitrary.ts'
import { Node, Tree } from './data.ts'
import { count, depth } from './queries.ts'

describe('arbitrary', () => {
  Test.property(
    'generates valid trees',
    fc.integer(),
    (seed) => {
      const tree = fc.sample(arbitrary(fc.constant(seed)), 1)[0]!
      expect(tree).toBeDefined()
      expect(tree.root === null || typeof tree.root === 'object').toBe(true)
      // Tree has single root or null
      if (tree.root !== null) {
        expect(tree.root.value).toBeDefined()
        expect(Array.isArray(tree.root.children)).toBe(true)
      }
    },
  )

  Test.property(
    'respects maxDepth option',
    fc.integer({ min: 0, max: 5 }),
    fc.integer(),
    (maxDepth, seed) => {
      const tree = fc.sample(
        arbitrary(fc.constant(seed), { maxDepth, leafWeight: 1 }),
        10,
      )
      tree.forEach(t => {
        expect(depth(t)).toBeLessThanOrEqual(maxDepth)
      })
    },
  )

  Test.property(
    'respects maxChildren option',
    fc.integer({ min: 1, max: 5 }),
    fc.integer(),
    (maxChildren, seed) => {
      const trees = fc.sample(
        arbitrary(fc.constant(seed), { maxChildren }),
        10,
      )
      trees.forEach(tree => {
        const checkChildren = (node: Node<number>) => {
          expect(node.children.length).toBeLessThanOrEqual(maxChildren)
          node.children.forEach(checkChildren)
        }
        if (tree.root !== null) checkChildren(tree.root)
      })
    },
  )
})

describe('arbitraryShapes.leaf', () => {
  Test.property(
    'always generates leaf nodes',
    fc.integer(),
    (value) => {
      const leaf = fc.sample(arbitraryShapes.leaf(fc.constant(value)), 10)
      leaf.forEach(node => {
        expect(node.value).toBe(value)
        expect(node.children).toEqual([])
      })
    },
  )
})

describe('arbitraryShapes.withDepth', () => {
  Test.property(
    'generates trees with exact depth',
    fc.integer({ min: 0, max: 5 }),
    fc.integer(),
    (targetDepth, seed) => {
      const trees = fc.sample(
        arbitraryShapes.withDepth(fc.constant(seed), targetDepth),
        5,
      )
      trees.forEach(node => {
        const tree = Tree(node)
        expect(depth(tree)).toBe(targetDepth)
      })
    },
  )
})

describe('arbitraryShapes.linear', () => {
  Test.property(
    'generates linear trees (linked list style)',
    fc.integer({ min: 1, max: 10 }),
    fc.integer(),
    (length, seed) => {
      const tree = fc.sample(
        arbitraryShapes.linear(fc.constant(seed), length),
        1,
      )[0]!

      // Count should equal length
      const treeWrapper = Tree(tree)
      expect(count(treeWrapper)).toBe(length)

      // Each non-leaf node should have exactly one child
      let current = tree
      let nodeCount = 1
      while (current.children.length > 0) {
        expect(current.children.length).toBe(1)
        current = current.children[0]!
        nodeCount++
      }
      expect(nodeCount).toBe(length)
    },
  )
})

describe('arbitraryShapes.balanced', () => {
  Test.property(
    'generates balanced trees with specified children per node',
    fc.integer({ min: 0, max: 3 }),
    fc.integer({ min: 1, max: 4 }),
    fc.integer(),
    (targetDepth, childrenPerNode, seed) => {
      const tree = fc.sample(
        arbitraryShapes.balanced(fc.constant(seed), targetDepth, childrenPerNode),
        1,
      )[0]!

      // Check depth
      const treeWrapper = Tree(tree)
      expect(depth(treeWrapper)).toBe(targetDepth)

      // Check that non-leaf nodes have exact number of children
      const checkBalance = (node: Node<number>, currentDepth: number) => {
        if (currentDepth < targetDepth) {
          expect(node.children.length).toBe(childrenPerNode)
          node.children.forEach(child => checkBalance(child, currentDepth + 1))
        } else {
          expect(node.children.length).toBe(0)
        }
      }
      checkBalance(tree, 0)
    },
  )
})

describe('arbitraryShapes.wide', () => {
  Test.property(
    'generates wide trees',
    fc.integer({ min: 2, max: 10 }),
    fc.integer({ min: 1, max: 3 }),
    fc.integer(),
    (width, targetDepth, seed) => {
      const tree = fc.sample(
        arbitraryShapes.wide(fc.constant(seed), width, targetDepth),
        1,
      )[0]!

      // Check depth
      const treeWrapper = Tree(tree)
      expect(depth(treeWrapper)).toBeLessThanOrEqual(targetDepth)

      // Root should have many children (at least half of width)
      expect(tree.children.length).toBeGreaterThanOrEqual(Math.floor(width / 2))
      expect(tree.children.length).toBeLessThanOrEqual(width)
    },
  )
})
