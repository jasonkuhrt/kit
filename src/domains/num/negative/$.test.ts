import { Test } from '#test'
import { Negative } from './$.js'

Test.describe('is')
  .on(Negative.is)
  .casesAsArgs(
    // Valid cases - negative numbers
    -1,
    -0.1,
    -100,
    Number.NEGATIVE_INFINITY,
    // Invalid cases
    0,
    1,
    0.1,
    Infinity,
    NaN,
    '-1',
    null,
    undefined,
    {},
  )
  .test()

Test.describe('from')
  .on(Negative.from)
  .casesAsArgs(
    // Valid cases
    -1,
    -0.1,
    -100,
    // Invalid cases - should throw
    0,
    1,
    0.1,
  )
  .test()

Test.describe('tryFrom')
  .on(Negative.tryFrom)
  .casesAsArgs(
    // Valid cases
    -1,
    -0.1,
    -100,
    // Invalid cases - should return null
    0,
    1,
    0.1,
  )
  .test()
