import { Test } from '#test'
import { NonNegative } from './_.js'

Test.describe('is')
  .on(NonNegative.is)
  .casesInput(
    // Valid cases - non-negative numbers (>= 0)
    [0],
    [1],
    [100],
    [0.5],
    [Number.MAX_VALUE],
    [Infinity],
    // Invalid cases - negative numbers
    [-1],
    [-0.1],
    [-100],
    [-Infinity],
    [NaN],
    ['0'],
    [null],
  )
  .test()

Test.describe('tryFrom')
  .on(NonNegative.tryFrom)
  .cases(
    // Valid cases
    [0],
    [1],
    [100],
    [0.5],
    [Number.MAX_VALUE],
    [Infinity],
    // Invalid cases - should return null
    [-1],
    [-0.1],
    [-100],
    [-Infinity],
    [NaN],
  )
  .test()
