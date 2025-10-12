import { Test } from '#test'
import { Degrees } from './$.js'

Test.describe('is')
  .on(Degrees.is)
  .casesInput(
    // Valid cases - any finite number is a valid degree
    [0],
    [90],
    [180],
    [360],
    [-90],
    [45.5],
    // Invalid cases - non-finite numbers
    [Infinity],
    [-Infinity],
    [NaN],
    ['90'],
    [null],
    [undefined],
  )
  .test()

Test.describe('from')
  .on(Degrees.from)
  .cases(
    // Valid cases
    [0],
    [90],
    [180],
    [360],
    [-90],
    [45.5],
    // Invalid cases - should throw
    [Infinity],
    [-Infinity],
    [NaN],
  )
  .test()

Test.describe('tryFrom')
  .on(Degrees.tryFrom)
  .cases(
    // Valid cases
    [0],
    [90],
    [180],
    [360],
    [-90],
    [45.5],
    // Invalid cases - should return null
    [Infinity],
    [-Infinity],
    [NaN],
  )
  .test()
