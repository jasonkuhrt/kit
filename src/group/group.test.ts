import { Group } from '#group/index.js'
import { describe, expect, expectTypeOf, test } from 'vitest'

const a = { type: 'A' as const, a: 1 as const, date: new Date() }
const b = { type: 'B' as const, b: 2 as const, date: new Date() }
const ab = [a, b]
type a = typeof a
type b = typeof b
type ab = a | b

test('groups values', () => {
  const g = Group.by(ab, 'type')
  expectTypeOf(g).toEqualTypeOf<{ A?: a[]; B?: b[] }>()
  expect(g).toEqual({ A: [a], B: [b] })
})

describe('types', () => {
  test('Group.By with union: does not distribute', () => {
    type u = a | b
    type g = Group.by<u, 'type'>
    expectTypeOf<g>().toEqualTypeOf<{ A?: a[]; B?: b[] }>()
  })
  test('error: parameter: key: if target value not conforming to PropertyKey', () => {
    type e = Parameters<typeof Group.by<ab, 'date'>>[1]
    expectTypeOf<e>().toEqualTypeOf<Group.ErrorInvalidGroupKey<ab, 'date'>>()
  })
})
