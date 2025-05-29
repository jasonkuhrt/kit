import { isntTypeWith as isntTypeWith } from '#eq/type.js'
import { isTypeWith } from '#eq/type.js'
import { expect, expectTypeOf, test } from 'vitest'

const x = null as null | 1 | 2

test('isTypeWith', () => {
  const isNull = isTypeWith(null)

  // runtime

  expect(isNull(x)).toBe(true)

  // devtime

  if (isNull(x)) {
    expectTypeOf(x).toEqualTypeOf<null>()
  } else {
    expectTypeOf(x).toEqualTypeOf<1 | 2>()
  }
})

test('isntTypeWith', () => {
  const isntNull = isntTypeWith(null)

  // runtime

  expect(isntNull(x)).toBe(false)

  // devtime

  if (isntNull(x)) {
    expectTypeOf(x).toEqualTypeOf<1 | 2>()
  } else {
    expectTypeOf(x).toEqualTypeOf<null>()
  }
})
