import { Null } from '#null/index.js'
import { property } from '#test/test.js'
import * as fc from 'fast-check'
import { expect, expectTypeOf, test } from 'vitest'

test('property: is returns true only for null', () => {
  // Test that null always returns true
  expect(Null.is(null)).toBe(true)

  // Test that any non-null value returns false
  fc.assert(
    fc.property(
      fc.anything().filter(v => v !== null),
      (value) => {
        // @ts-expect-error
        expect(Null.is(value)).toBe(false)
      },
    ),
  )
})

property('is and isnt are complementary', fc.anything(), (value) => {
  expect(Null.is(value)).toBe(!Null.isnt(value))
})

property(
  'isnt filters out null from arrays',
  fc.array(fc.oneof(fc.anything().filter(v => v !== null), fc.constant(null))),
  (arr) => {
    const filtered = arr.filter(Null.isnt)
    expect(filtered.every(v => v !== null)).toBe(true)
    expect(filtered.length).toBe(arr.filter(v => v !== null).length)
  },
)

test('property: isnt returns false only for null', () => {
  // Test that null always returns false
  expect(Null.isnt(null)).toBe(false)

  // Test that any non-null value returns true
  fc.assert(
    fc.property(
      fc.anything().filter(v => v !== null),
      (value) => {
        // @ts-expect-error
        expect(Null.isnt(value)).toBe(true)
      },
    ),
  )
})

test('type: narrows nullable types correctly', () => {
  const value = 'hello' as string | null
  if (Null.is(value)) {
    expectTypeOf(value).toEqualTypeOf<null>()
  } else {
    expectTypeOf(value).toEqualTypeOf<string>()
  }

  const value2 = null as string | null
  if (Null.isnt(value2)) {
    expectTypeOf(value2).toEqualTypeOf<string>()
  } else {
    expectTypeOf(value2).toEqualTypeOf<null>()
  }
})
