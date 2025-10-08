import { Test } from '#test'
import { InRange } from './$.js'

Test
  .describe('tryRanged')
  .on(InRange.tryFrom)
  .onOutput((value: number | null, context) => {
    const [_, min, max] = context.i
    return value === null ? null : InRange.from(value, min, max)
  })
  .cases(
    [[0, 1, 10], null, { comment: 'below range' }],
    [[5, 1, 10], 5, { comment: 'within range' }], // Simple number, transformed by .onOutput()
    [[11, 1, 10], null, { comment: 'above range' }],
    // TODO: Add comprehensive tests - easy to add more cases here
    [[1, 1, 10], 1, { comment: 'at min boundary' }],
    [[10, 1, 10], 10, { comment: 'at max boundary' }],
    [[-5, -10, 0], -5, { comment: 'negative range' }],
  )
  .test()
