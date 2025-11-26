import { Test } from '#test'
import { Int } from './_.js'

Test.describe('is')
  .on(Int.is)
  .casesInput(
    // Valid cases - integers
    [0],
    [1],
    [-1],
    [100],
    [-100],
    [Number.MAX_SAFE_INTEGER],
    [Number.MIN_SAFE_INTEGER],
    // Invalid cases - non-integers
    [1.5],
    [-1.5],
    [0.1],
    [Infinity],
    [-Infinity],
    [NaN],
    ['1'],
    [null],
    [undefined],
  )
  .test()

Test.describe('from')
  .on(Int.from)
  .cases(
    // Valid cases
    [0],
    [1],
    [-1],
    [100],
    [-100],
    [Number.MAX_SAFE_INTEGER],
    [Number.MIN_SAFE_INTEGER],
    // Invalid cases - should throw
    [1.5],
    [-1.5],
    [0.1],
    [Infinity],
    [-Infinity],
    [NaN],
  )
  .test()

Test.describe('tryFrom')
  .on(Int.tryFrom)
  .cases(
    // Valid cases
    [0],
    [1],
    [-1],
    [100],
    [-100],
    [Number.MAX_SAFE_INTEGER],
    [Number.MIN_SAFE_INTEGER],
    // Invalid cases - should return null
    [1.5],
    [-1.5],
    [0.1],
    [Infinity],
    [-Infinity],
    [NaN],
  )
  .test()
