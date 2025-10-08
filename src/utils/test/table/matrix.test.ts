import { Test } from '#test'
import { describe, expect } from 'vitest'

describe('matrix feature', () => {
  Test
    .describe('basic matrix')
    .inputType<number>()
    .outputType<number>()
    .matrix({
      multiplier: [1, 2],
      offset: [0, 10],
    })
    .cases(
      [5, 5],
      [10, 10],
    )
    .test(({ input, output, matrix }) => {
      // Demonstrates matrix values are passed to test
      const result = input * matrix.multiplier + matrix.offset
      expect(result).toBe(output * matrix.multiplier + matrix.offset)
    })
})
