import { Test } from '#test'
import { NonZero } from './$.js'

Test.describe('is')
  .on(NonZero.is)
  .casesAsArgs(
    // Valid cases - any non-zero number
    1,
    -1,
    0.1,
    -0.1,
    100,
    -100,
    Infinity,
    -Infinity,
    // Invalid cases
    0,
    -0,
    NaN,
    '1',
    null,
    undefined,
  )
  .test()

Test.describe('tryFrom')
  .on(NonZero.tryFrom)
  .casesAsArgs(
    // Valid cases
    1,
    -1,
    0.1,
    -0.1,
    100,
    -100,
    Infinity,
    -Infinity,
    // Invalid cases - should return null
    0,
    -0,
    NaN, // NaN is technically non-zero, returns NaN
  )
  .test()
