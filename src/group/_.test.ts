import { Arr } from '#arr'
import { Assert } from '#assert'
import { Group } from '#group'
import { describe, expect, test } from 'vitest'

const A = Assert.Type.exact.ofAs

const a = { type: 'A' as const, a: 1 as const, date: new Date() }
const b = { type: 'B' as const, b: 2 as const, date: new Date() }
const ab = [a, b]
const abOnKey = { type: Arr.getRandomly(['A', 'B'] as const) }
type abOnKey = typeof abOnKey
type a = typeof a
type b = typeof b
type ab = a | b

test('by() returns frozen, byMut() returns mutable', () => {
  // by() - frozen
  const frozen = Group.by(ab, 'type')
  A<Group.by<ab, 'type'>>().on(frozen)
  expect(frozen).toEqual({ A: [a], B: [b] })
  expect(Object.isFrozen(frozen) && Object.isFrozen(frozen.A) && Object.isFrozen(frozen.B)).toBe(true)

  // byMut() - mutable
  const mutable = Group.byToMut(ab, 'type')
  A<Group.byToMut<ab, 'type'>>().on(mutable)
  expect(mutable).toEqual({ A: [a], B: [b] })
  expect(Object.isFrozen(mutable) || Object.isFrozen(mutable.A) || Object.isFrozen(mutable.B)).toBe(false)
})

describe('merge', () => {
  test('dual internals: frozen inputs create new frozen result', () => {
    const frozen1 = Group.by(ab, 'type')
    const frozen2 = Group.by(ab, 'type')
    const origLength = frozen1.A!.length

    const result = Group.merge(frozen1, frozen2)

    A<typeof frozen1>().on(result)
    expect(Object.isFrozen(result)).toBe(true)
    expect(result.A).toHaveLength(2)
    // Inputs not mutated
    expect(frozen1.A).toHaveLength(origLength)
  })

  test('dual internals: mutable inputs mutate group1 in place', () => {
    const mutable1 = Group.byToMut(ab, 'type')
    const mutable2 = Group.byToMut(ab, 'type')
    const origLength = mutable1.A!.length

    const result = Group.merge(mutable1, mutable2)

    A<typeof mutable1>().on(result)
    expect(Object.isFrozen(result)).toBe(false)
    expect(result).toBe(mutable1) // Same reference - mutated in place
    expect(mutable1.A!.length).toBeGreaterThan(origLength) // WAS mutated
  })

  test('OR logic: frozen + mutable creates new frozen result', () => {
    const frozen = Group.by(ab, 'type')
    const mutable = Group.byToMut(ab, 'type')
    const origFrozenLength = frozen.A!.length
    const origMutableLength = mutable.A!.length

    const result = Group.merge(frozen, mutable)

    expect(Object.isFrozen(result)).toBe(true)
    // Neither input mutated
    expect(frozen.A).toHaveLength(origFrozenLength)
    expect(mutable.A).toHaveLength(origMutableLength)
  })

  test('merges overlapping keys', () => {
    const a2 = { type: 'A' as const, a: 2 as const, date: new Date() }
    const a3 = { type: 'A' as const, a: 3 as const, date: new Date() }
    const items = [a, a2, a3] as const
    const group1 = Group.byToMut([items[0], items[1]], 'type')
    const group2 = Group.byToMut([items[2]], 'type') as any
    const result = Group.merge(group1, group2)

    expect(result.A).toHaveLength(3)
  })
})

describe('map', () => {
  test('dual internals: frozen input creates new frozen result', () => {
    const handlers = { A: (items: any) => items.length, B: (items: any) => items.length }
    const frozen = Group.by(ab, 'type')

    const result = Group.map(frozen, handlers)

    A<Group.map<typeof frozen, typeof handlers>>().on(result)
    expect(Object.isFrozen(result)).toBe(true)
    expect(result).toEqual({ A: 1, B: 1 })
    // Input not mutated (still has original arrays)
    expect(Array.isArray(frozen.A)).toBe(true)
  })

  test('dual internals: mutable input transforms in place', () => {
    const handlers = { A: (items: any) => items.length, B: (items: any) => items.length }
    const mutable = Group.byToMut(ab, 'type')

    const result = Group.map(mutable, handlers)

    A<Group.map<typeof mutable, typeof handlers>>().on(result)
    expect(Object.isFrozen(result)).toBe(false)
    expect(result).toBe(mutable) // Same reference - transformed in place
    expect(result).toEqual({ A: 1, B: 1 })
  })

  test('throws if handler missing', () => {
    const groupSet = Group.by(ab, 'type')
    expect(() => Group.map(groupSet, { A: (items: any) => items.length } as any)).toThrow('No handler for group "B"')
  })
})

describe('clone', () => {
  test('frozen input: returns frozen clone (root + buckets)', () => {
    const frozen = Group.by(ab, 'type')
    const result = Group.clone(frozen)

    expect(result).not.toBe(frozen)
    expect(result.A).not.toBe(frozen.A)
    expect(Object.isFrozen(result)).toBe(true)
    expect(Object.isFrozen(result.A)).toBe(true)
    expect(result).toEqual(frozen)
  })

  test('mutable input: returns mutable clone (root + buckets)', () => {
    const mutable = Group.byToMut(ab, 'type')
    const result = Group.clone(mutable)

    expect(result).not.toBe(mutable)
    expect(result.A).not.toBe(mutable.A)
    expect(Object.isFrozen(result)).toBe(false)
    expect(Object.isFrozen(result.A)).toBe(false)
    expect(result).toEqual(mutable)
  })
})

describe('cloneToMut', () => {
  test('returns mutable clone regardless of input', () => {
    const frozen = Group.by(ab, 'type')
    const result = Group.cloneToMut(frozen)

    expect(result).not.toBe(frozen)
    expect(result.A).not.toBe(frozen.A)
    expect(Object.isFrozen(result)).toBe(false)
    expect(Object.isFrozen(result.A)).toBe(false)
    expect(Object.isFrozen(frozen)).toBe(true) // original unchanged
  })
})

describe('toImmutable', () => {
  test('returns frozen clone, original unchanged', () => {
    const mutable = Group.byToMut(ab, 'type')
    const result = Group.toImmutable(mutable)

    expect(result).not.toBe(mutable)
    expect(result.A).not.toBe(mutable.A)
    expect(Object.isFrozen(result)).toBe(true)
    expect(Object.isFrozen(result.A)).toBe(true)
    expect(Object.isFrozen(mutable)).toBe(false) // original unchanged
  })
})

describe('toImmutableMut', () => {
  test('freezes in place (root + buckets)', () => {
    const mutable = Group.byToMut(ab, 'type')
    const result = Group.toImmutableMut(mutable)

    expect(result).toBe(mutable) // same reference
    expect(Object.isFrozen(result)).toBe(true)
    expect(Object.isFrozen(result.A)).toBe(true)
  })
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
    // Test that the error type is correctly constructed
    type e = Group.ErrorInvalidGroupKey<ab, 'date'>
    A<e['CONTEXT_____']['your_key_type']>().onAs<Date>()
    // Runtime test that attempting to use Date key throws
    expect(() => {
      // @ts-expect-error - Date is not a valid grouping key
      Group.by(ab, 'date')
    }).not.toThrow() // Doesn't throw at runtime, but TS correctly errors
  })
})

describe('function keyer', () => {
  test('by() with function keyer returns frozen groups', () => {
    const items = [
      { name: 'apple', category: 'fruit' as const },
      { name: 'carrot', category: 'vegetable' as const },
      { name: 'banana', category: 'fruit' as const },
    ]

    const grouped = Group.by(items, (item) => item.category)
    A<Group.byFn<typeof items[number], 'fruit' | 'vegetable'>>().on(grouped)

    expect(grouped).toEqual({
      fruit: [items[0], items[2]],
      vegetable: [items[1]],
    })
    expect(Object.isFrozen(grouped)).toBe(true)
    expect(Object.isFrozen(grouped.fruit)).toBe(true)
  })

  test('byToMut() with function keyer returns mutable groups', () => {
    const items = [
      { name: 'apple', category: 'fruit' as const },
      { name: 'carrot', category: 'vegetable' as const },
    ]

    const grouped = Group.byToMut(items, (item) => item.category)
    A<Group.byFnToMut<typeof items[number], 'fruit' | 'vegetable'>>().on(grouped)

    expect(grouped).toEqual({
      fruit: [items[0]],
      vegetable: [items[1]],
    })
    expect(Object.isFrozen(grouped)).toBe(false)
    // Can mutate (assert non-null since we know it exists)
    grouped.fruit!.push(items[0]!)
    expect(grouped.fruit).toHaveLength(2)
  })

  test('function keyer with wide string type falls back to Record', () => {
    const items = [{ name: 'a', key: 'x' }, { name: 'b', key: 'y' }]
    const grouped = Group.by(items, (item) => item.key)
    // Type is Record<string, ...> because item.key is string
    A<Readonly<Record<string, readonly typeof items[number][]>>>().on(grouped)

    expect(grouped).toEqual({
      x: [items[0]],
      y: [items[1]],
    })
  })

  test('function keyer with literal union return type has precise keys', () => {
    type Category = 'fruit' | 'vegetable'
    const items = [
      { name: 'apple', category: 'fruit' as Category },
      { name: 'carrot', category: 'vegetable' as Category },
    ]

    // Explicit return type annotation gives precise typing
    const grouped = Group.by(items, (item): Category => item.category)
    A<Readonly<{ fruit?: readonly typeof items[number][]; vegetable?: readonly typeof items[number][] }>>().on(grouped)

    expect(grouped.fruit).toHaveLength(1)
    expect(grouped.vegetable).toHaveLength(1)
  })
})
