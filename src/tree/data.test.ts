import { Test } from '#test/index.js'
import * as fc from 'fast-check'
import { describe, expect, test } from 'vitest'
import { isLeaf, Node } from './data.js'

describe('Node', () => {
  test('creates a tree node', () => {
    const leaf = Node('leaf')
    expect(leaf).toEqual({ value: 'leaf', children: [] })

    const parent = Node('parent', [leaf])
    expect(parent).toEqual({ value: 'parent', children: [leaf] })
  })

  Test.property(
    'node always has value and children array',
    fc.anything(),
    fc.array(fc.anything()),
    (value, childValues) => {
      const children = childValues.map(v => Node(v))
      const node = Node(value, children)

      expect(node.value).toBe(value)
      expect(Array.isArray(node.children)).toBe(true)
      expect(node.children).toEqual(children)
    },
  )
})

describe('isLeaf', () => {
  test('identifies leaf nodes', () => {
    const leaf = Node('leaf')
    const parent = Node('parent', [leaf])
    const grandparent = Node('grandparent', [parent])

    expect(isLeaf(leaf)).toBe(true)
    expect(isLeaf(parent)).toBe(false)
    expect(isLeaf(grandparent)).toBe(false)
  })

  Test.property(
    'node with empty children array is always a leaf',
    fc.anything(),
    (value) => {
      const node = Node(value, [])
      expect(isLeaf(node)).toBe(true)
    },
  )

  Test.property(
    'node with non-empty children array is never a leaf',
    fc.anything(),
    fc.array(fc.anything(), { minLength: 1 }),
    (value, childValues) => {
      const children = childValues.map(v => Node(v))
      const node = Node(value, children)
      expect(isLeaf(node)).toBe(false)
    },
  )
})
