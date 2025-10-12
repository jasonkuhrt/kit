import { Test } from '#test'
import { Odd } from './$.js'

Test.describe('is')
  .on(Odd.is)
  .casesInput(
    // Valid cases - odd integers
    [1],
    [3],
    [-1],
    [-3],
    [5],
    [99],
    // Invalid cases - even integers
    [0],
    [2],
    [4],
    [-2],
    [-4],
    [100],
    // Invalid cases - non-integers
    [1.5],
    [3.1],
    [Infinity],
    [NaN],
    ['3'],
    [null],
  )
  .test()

Test.describe('from')
  .on(Odd.from)
  .cases(
    // Valid cases
    [1],
    [3],
    [-1],
    [-3],
    [5],
    [99],
    // Invalid cases - even integers should throw
    [0],
    [2],
    [4],
    [-2],
    [-4],
    // Invalid cases - non-integers should throw
    [1.5],
    [3.1],
    [Infinity],
    [NaN],
  )
  .test()

Test.describe('tryFrom')
  .on(Odd.tryFrom)
  .cases(
    // Valid cases
    [1],
    [3],
    [-1],
    [-3],
    [5],
    [99],
    // Invalid cases - should return null
    [0],
    [2],
    [4],
    [-2],
    [-4],
    [1.5],
    [3.1],
    [Infinity],
    [NaN],
  )
  .test()
