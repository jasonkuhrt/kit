import { Test } from '#test'
import { Finite } from './$.js'

Test.describe('is')
  .on(Finite.is)
  .cases(
    // Valid cases - finite numbers
    [0],
    [1],
    [-1],
    [1.5],
    [-1.5],
    [Number.MAX_SAFE_INTEGER],
    [Number.MIN_SAFE_INTEGER],
    // Invalid cases - non-finite numbers
    [Infinity],
    [-Infinity],
    [NaN],
    ['0'],
    [null],
    [undefined],
  )
  .test()

Test.describe('from')
  .on(Finite.from)
  .cases(
    // Valid cases
    [0],
    [1],
    [-1],
    [1.5],
    [-1.5],
    [Number.MAX_SAFE_INTEGER],
    [Number.MIN_SAFE_INTEGER],
    // Invalid cases - should throw
    [Infinity],
    [-Infinity],
    [NaN],
  )
  .test()

Test.describe('tryFrom')
  .on(Finite.tryFrom)
  .cases(
    // Valid cases
    [0],
    [1],
    [-1],
    [1.5],
    [-1.5],
    [Number.MAX_SAFE_INTEGER],
    [Number.MIN_SAFE_INTEGER],
    // Invalid cases - should return null
    [Infinity],
    [-Infinity],
    [NaN],
  )
  .test()
