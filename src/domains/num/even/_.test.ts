import { Test } from '#test'
import { Even } from './_.js'

Test.describe('is')
  .on(Even.is)
  .casesInput(
    // Valid cases - even integers
    [0],
    [2],
    [4],
    [-2],
    [-4],
    [100],
    // Invalid cases - odd integers
    [1],
    [3],
    [-1],
    [-3],
    // Invalid cases - non-integers
    [2.5],
    [2.1],
    [Infinity],
    [NaN],
    ['2'],
    [null],
  )
  .test()

Test.describe('from')
  .on(Even.from)
  .cases(
    // Valid cases
    [0],
    [2],
    [4],
    [-2],
    [-4],
    [100],
    // Invalid cases - odd integers should throw
    [1],
    [3],
    [-1],
    [-3],
    // Invalid cases - non-integers should throw
    [2.5],
    [2.1],
    [Infinity],
    [NaN],
  )
  .test()

Test.describe('tryFrom')
  .on(Even.tryFrom)
  .cases(
    // Valid cases
    [0],
    [2],
    [4],
    [-2],
    [-4],
    [100],
    // Invalid cases - should return null
    [1],
    [3],
    [-1],
    [-3],
    [2.5],
    [2.1],
    [Infinity],
    [NaN],
  )
  .test()
