import { Pat } from '#pat'
import { property } from '#test/test'
import fc from 'fast-check'
import { expect, test } from 'vitest'

property('matches identical primitives', fc.oneof(fc.integer(), fc.string(), fc.boolean()), (value) => {
  expect(Pat.isMatch(value, value)).toBe(true)
})

test('rejects non-matching primitives with type error', () => {
  // @ts-expect-error
  expect(Pat.isMatch(42, 43)).toBe(false)
  // @ts-expect-error
  expect(Pat.isMatch(true, false)).toBe(false)
})

property('matches objects partially', fc.object(), (obj) => {
  const keys = Object.keys(obj)
  if (keys.length > 0) {
    const partialKeys = keys.slice(0, Math.floor(keys.length / 2) + 1)
    const pattern = Object.fromEntries(partialKeys.map(k => [k, (obj as any)[k]]))
    expect(Pat.isMatch(obj, pattern)).toBe(true)
  }
})

property('empty pattern matches objects', fc.object(), (obj) => {
  expect(Pat.isMatch(obj, {})).toBe(true)
})

test('nested patterns work but have type errors', () => {
  const obj = { user: { name: 'John', age: 30 } }
  // @ts-expect-error - partial nested patterns not supported in types
  expect(Pat.isMatch(obj, { user: { name: 'John' } })).toBe(true)
})

property('arrays compare by reference', fc.array(fc.anything()), (arr) => {
  const obj = { data: arr }
  expect(Pat.isMatch(obj, { data: [...arr] })).toBe(false)
  expect(Pat.isMatch(obj, { data: arr })).toBe(true)
})

property(
  'isMatchOn creates pattern filter',
  fc.array(fc.record({ id: fc.integer(), status: fc.constantFrom('active', 'inactive') })),
  (items) => {
    const isActive = Pat.isMatchOn({ status: 'active' })
    const filtered = items.filter(isActive)
    expect(filtered.every(item => item.status === 'active')).toBe(true)
  },
)

property('isMatchWith creates value matcher', fc.object(), fc.array(fc.object()), (value, patterns) => {
  const matches = Pat.isMatchWith(value)
  const matching = patterns.filter(matches)
  matching.forEach(pattern => {
    Object.entries(pattern).forEach(([k, v]) => {
      // Use toStrictEqual for deep equality (handles objects, arrays, primitives)
      expect((value as any)[k]).toStrictEqual(v)
    })
  })
})
