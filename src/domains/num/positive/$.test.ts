import { Test } from '#test'
import { Positive } from './$.js'

Test.describe('is')
  .on(Positive.is)
  .casesAsArgs(
    // Valid cases - positive numbers
    1,
    0.1,
    100,
    Number.POSITIVE_INFINITY,
    // Invalid cases
    0,
    -1,
    -0.1,
    -Infinity,
    NaN,
    '1',
    null,
    undefined,
    {},
  )
  .test()

Test.describe('from')
  .on(Positive.from)
  .casesAsArgs(
    // Valid cases
    1,
    0.1,
    100,
    // Invalid cases - should throw
    0,
    -1,
    -0.1,
  )
  .test()

Test.describe('tryFrom')
  .on(Positive.tryFrom)
  .casesAsArgs(
    // Valid cases
    1,
    0.1,
    100,
    // Invalid cases - should return null
    0,
    -1,
    -0.1,
  )
  .test()
