import { Test } from '#test'
import { InRange } from './$.js'

Test.describe('tryRanged')
  .on(InRange.tryFrom)
  .o((value: number | null, [_, min, max]) => {
    return value === null ? null : InRange.from(value, min, max)
  })
  .cases(
    ['below range', [0, 1, 10], null],
    ['within range', [5, 1, 10], 5], // Simple number, transformed by .o()
    ['above range', [11, 1, 10], null],
    // TODO: Add comprehensive tests - easy to add more cases here
    ['at min boundary', [1, 1, 10], 1],
    ['at max boundary', [10, 1, 10], 10],
    ['negative range', [-5, -10, 0], -5],
  )
  .test()
