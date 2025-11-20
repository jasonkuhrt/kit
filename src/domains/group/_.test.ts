import { ArrMut } from '#arr-mut'
import { Assert } from '#assert'
import { Group } from '#group'
import { describe, expect, test } from 'vitest'

const A = Assert.Type.exact.ofAs

const a = { type: 'A' as const, a: 1 as const, date: new Date() }
const b = { type: 'B' as const, b: 2 as const, date: new Date() }
const ab = [a, b]
const abOnKey = { type: ArrMut.getRandomly(['A', 'B'] as const) }
type abOnKey = typeof abOnKey
type a = typeof a
type b = typeof b
type ab = a | b

test('groups values', () => {
  const g = Group.by(ab, 'type')
  A<{ A?: a[]; B?: b[] }>().on(g)
  expect(g).toEqual({ A: [a], B: [b] })
})

describe('types', () => {
  test('Group.by with key value a union narrows it for each group', () => {
    type g = Group.by<abOnKey, 'type'>
    A<{ A?: { type: 'A' }[]; B?: { type: 'B' }[] }>().onAs<g>()
  })
  test('Group.by with union: does not distribute', () => {
    type u = a | b
    type g = Group.by<u, 'type'>
    A<{ A?: a[]; B?: b[] }>().onAs<g>()
  })
  test('error: parameter: key: if target value not conforming to PropertyKey', () => {
    type e = Parameters<typeof Group.by<ab, 'date'>>[1]
    A<Group.ErrorInvalidGroupKey<ab, 'date'>>().on({} as e)
  })
})
