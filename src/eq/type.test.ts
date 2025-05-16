import { expect, expectTypeOf, test } from 'vitest'
import { isNotTypeWith, isTypeWith } from './type.js'

test('isTypeWith', () => {
  const isNull = isTypeWith(null)
  const x = null as null | 1 | 2

  // runtime

  expect(isNull(x)).toBe(true)

  // devtime

  if (isNull(x)) {
    expectTypeOf(x).toEqualTypeOf<null>()
  } else {
    expectTypeOf(x).toEqualTypeOf<1 | 2>()
  }
})

test('isNotTypeWith', () => {
  const isNotNull = isNotTypeWith(null)
  const x = null as null | 1 | 2

  // runtime

  expect(isNotNull(x)).toBe(false)

  // devtime

  if (isNotNull(x)) {
    expectTypeOf(x).toEqualTypeOf<1 | 2>()
  } else {
    expectTypeOf(x).toEqualTypeOf<null>()
  }
})
