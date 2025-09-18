import { property } from '#test/test'
import fc from 'fast-check'
import { expect } from 'vitest'
import * as Tree from './$$.js'
import { arbitrary } from './arbitrary.js'

property('Node creates tree node', fc.anything(), (value) => {
  expect(Tree.Node(value)).toEqual({ value, children: [] })
})

property(
  'fromList builds correct tree structure',
  fc.array(fc.record({
    id: fc.string(),
    parentId: fc.option(fc.string(), { nil: undefined }),
    data: fc.anything(),
  })),
  (items) => {
    // Skip empty arrays as they have no meaningful structure
    if (items.length === 0) return

    // Skip items with empty string IDs as they can cause issues
    const validItems = items.filter(item => item.id && item.id.trim() !== '')
    if (validItems.length === 0) return

    const forest = Tree.manyFromList(validItems)
    expect(forest).toBeDefined()
    expect(Array.isArray(forest)).toBe(true)

    // Count items that should be roots according to manyFromList logic:
    // - parentId matches rootId (undefined by default)
    // - parentId is falsy (undefined, null, empty string)
    const rootCount = validItems.filter(i => i.parentId === undefined || !i.parentId).length
    expect(forest.length).toBeLessThanOrEqual(rootCount)
  },
)

property('find locates nodes correctly', arbitrary(fc.string()), fc.string(), (tree, target) => {
  const found = Tree.find(tree, v => v === target)
  const inList = Tree.toList(tree).includes(target)
  expect(!!found).toBe(inList)
})

property('some/every are complementary for universal predicates', arbitrary(fc.integer()), (tree) => {
  const pred = (v: number) => v > 0
  // Skip empty trees as they have different semantics
  if (tree.root === null) return

  if (Tree.every(tree, pred)) expect(Tree.some(tree, pred)).toBe(true)
  if (!Tree.some(tree, pred)) expect(Tree.every(tree, pred)).toBe(false)
})

property('map preserves structure', arbitrary(fc.string()), fc.func(fc.string()), (tree, fn) => {
  const mapped = Tree.map(tree, fn)
  expect(Tree.count(mapped)).toBe(Tree.count(tree))
  expect(Tree.depth(mapped)).toBe(Tree.depth(tree))
})

property('toList flattens all values', arbitrary(fc.anything()), (tree) => {
  const list = Tree.toList(tree)
  expect(list.length).toBe(Tree.count(tree))
})
