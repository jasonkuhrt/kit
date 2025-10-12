import { Test } from '#test'
import { Radians } from './$.js'

Test.describe('is')
  .on(Radians.is)
  .casesInput(
    // Valid cases - any finite number is a valid radian
    [0],
    [Math.PI],
    [Math.PI / 2],
    [2 * Math.PI],
    [-Math.PI],
    [1.5708],
    // Invalid cases - non-finite numbers
    [Infinity],
    [-Infinity],
    [NaN],
    ['3.14'],
    [null],
    [undefined],
  )
  .test()

Test.describe('from')
  .on(Radians.from)
  .cases(
    // Valid cases
    [0],
    [Math.PI],
    [Math.PI / 2],
    [2 * Math.PI],
    [-Math.PI],
    [1.5708],
    // Invalid cases - should throw
    [Infinity],
    [-Infinity],
    [NaN],
  )
  .test()

Test.describe('tryFrom')
  .on(Radians.tryFrom)
  .cases(
    // Valid cases
    [0],
    [Math.PI],
    [Math.PI / 2],
    [2 * Math.PI],
    [-Math.PI],
    [1.5708],
    // Invalid cases - should return null
    [Infinity],
    [-Infinity],
    [NaN],
  )
  .test()
