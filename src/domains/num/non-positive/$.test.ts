import { Test } from '#test'
import { NonPositive } from './$.js'

Test.describe('is')
  .on(NonPositive.is)
  .casesAsArgs(
    // Valid cases - non-positive numbers (<= 0)
    0,
    -1,
    -100,
    -0.5,
    -Number.MAX_VALUE,
    -Infinity,
    // Invalid cases - positive numbers
    1,
    0.1,
    100,
    Infinity,
    NaN,
    '0',
    null,
  )
  .test()

Test.describe('tryFrom')
  .on(NonPositive.tryFrom)
  .casesAsArgs(
    // Valid cases
    0,
    -1,
    -100,
    -0.5,
    -Number.MAX_VALUE,
    -Infinity,
    // Invalid cases - should return null
    1,
    0.1,
    100,
    Infinity,
    NaN,
  )
  .test()
