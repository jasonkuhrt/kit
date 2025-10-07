import { Test } from '#test'
import { Natural } from './$.js'

Test.describe('is')
  .on(Natural.is)
  .casesAsArgs(
    // Valid cases - positive integers
    1,
    2,
    100,
    Number.MAX_SAFE_INTEGER,
    // Invalid cases - zero
    0,
    // Invalid cases - negative numbers
    -1,
    -100,
    // Invalid cases - non-integers
    1.5,
    0.1,
    Math.PI,
    // Invalid cases - special values
    Infinity,
    -Infinity,
    NaN,
    // Invalid cases - non-numbers
    '1',
    null,
    undefined,
    {},
  )
  .test()

Test.describe('from')
  .on(Natural.from)
  .casesAsArgs(
    // Valid cases
    1,
    100,
    // Invalid cases - should throw
    0,
    -1,
    -100,
    1.5,
    Infinity,
  )
  .test()

Test.describe('tryFrom')
  .on(Natural.tryFrom)
  .casesAsArgs(
    // Valid cases
    1,
    100,
    // Invalid cases - should return null
    0,
    -1,
    -100,
    1.5,
    Infinity,
  )
  .test()
