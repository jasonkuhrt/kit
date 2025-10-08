import { Test } from '#test'
import { Zero } from './$.js'

Test.describe('is')
  .on(Zero.is)
  .cases(
    // Valid cases - only 0 is zero
    [0],
    [-0], // -0 === 0 in JavaScript
    // Invalid cases - any non-zero value
    [1],
    [-1],
    [0.1],
    [-0.1],
    [Infinity],
    [-Infinity],
    [NaN],
    ['0'],
    [null],
    [undefined],
  )
  .test()

Test.describe('from')
  .on(Zero.from)
  .cases(
    // Valid cases
    [0],
    [-0],
    // Invalid cases - should throw
    [1],
    [-1],
    [0.1],
    [-0.1],
    [Infinity],
    [NaN],
  )
  .test()

Test.describe('tryFrom')
  .on(Zero.tryFrom)
  .cases(
    // Valid cases
    [0],
    [-0],
    // Invalid cases - should return null
    [1],
    [-1],
    [0.1],
    [-0.1],
    [Infinity],
    [NaN],
  )
  .test()
