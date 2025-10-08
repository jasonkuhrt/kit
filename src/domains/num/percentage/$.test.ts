import { Test } from '#test'
import { Percentage } from './$.js'

Test.describe('is')
  .on(Percentage.is)
  .cases(
    // Valid cases - values between 0 and 1 inclusive
    [0],
    [0.5],
    [1],
    [0.25],
    [0.75],
    [0.001],
    [0.999],
    // Invalid cases - values outside 0-1 range
    [-0.1],
    [1.1],
    [2],
    [-1],
    [100],
    [Infinity],
    [NaN],
    ['0.5'],
    [null],
  )
  .test()

Test.describe('from')
  .on(Percentage.from)
  .cases(
    // Valid cases
    [0],
    [0.5],
    [1],
    [0.25],
    [0.75],
    [0.001],
    [0.999],
    // Invalid cases - should throw
    [-0.1],
    [1.1],
    [2],
    [-1],
    [100],
  )
  .test()

Test.describe('tryFrom')
  .on(Percentage.tryFrom)
  .cases(
    // Valid cases
    [0],
    [0.5],
    [1],
    [0.25],
    [0.75],
    [0.001],
    [0.999],
    // Invalid cases - should return null
    [-0.1],
    [1.1],
    [2],
    [-1],
    [100],
  )
  .test()
