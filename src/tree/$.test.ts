import { property } from '#test/test'
import { Tree } from '#tree'
import fc from 'fast-check'
import { expect } from 'vitest'

property('Node creates tree node', fc.anything(), (value) => {
  expect(Tree.Node(value)).toEqual({ value, children: [] })
})

property(
  'fromList builds correct tree structure',
  fc.array(fc.record({
    id: fc.string(),
    parentId: fc.option(fc.string()),
    data: fc.anything(),
  })),
  (items) => {
    const forest = Tree.fromList(items)
    const rootCount = items.filter(i => !i.parentId).length
    expect(forest.length).toBeLessThanOrEqual(rootCount)
  },
)

property('find locates nodes correctly', Tree.arbitrary(fc.string()), fc.string(), (tree, target) => {
  const found = Tree.find(tree, v => v === target)
  const inList = Tree.toList(tree).includes(target)
  expect(!!found).toBe(inList)
})

property('some/every are complementary for universal predicates', Tree.arbitrary(fc.integer()), (tree) => {
  const pred = (v: number) => v > 0
  if (Tree.every(tree, pred)) expect(Tree.some(tree, pred)).toBe(true)
  if (!Tree.some(tree, pred)) expect(Tree.every(tree, pred)).toBe(false)
})

property('map preserves structure', Tree.arbitrary(fc.string()), fc.func(fc.string()), (tree, fn) => {
  const mapped = Tree.map(tree, fn)
  expect(Tree.count(mapped)).toBe(Tree.count(tree))
  expect(Tree.depth(mapped)).toBe(Tree.depth(tree))
})

property('toList flattens all values', Tree.arbitrary(fc.anything()), (tree) => {
  const list = Tree.toList(tree)
  expect(list.length).toBe(Tree.count(tree))
})
