import { Test } from '#test'
import { Float } from './_.js'

Test.describe('is')
  .on(Float.is)
  .casesInput(
    // Valid cases - non-integer numbers
    [1.5],
    [0.1],
    [-1.5],
    [-0.1],
    [Math.PI],
    // Invalid cases - integers
    [0],
    [1],
    [-1],
    [100],
    // Invalid cases - special values
    [Infinity],
    [-Infinity],
    [NaN],
    ['1.5'],
    [null],
    [undefined],
  )
  .test()

Test.describe('from')
  .on(Float.from)
  .cases(
    // Valid cases
    [1.5],
    [0.1],
    [-1.5],
    [-0.1],
    [Math.PI],
    // Invalid cases - should throw
    [0],
    [1],
    [-1],
    [Infinity],
    [NaN],
  )
  .test()

Test.describe('tryFrom')
  .on(Float.tryFrom)
  .cases(
    // Valid cases
    [1.5],
    [0.1],
    [-1.5],
    [-0.1],
    [Math.PI],
    // Invalid cases - should return null
    [0],
    [1],
    [-1],
    [Infinity],
    [NaN],
  )
  .test()
