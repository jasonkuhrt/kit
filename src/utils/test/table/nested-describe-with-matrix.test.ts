import { Test } from '#test'
import { expect } from 'vitest'

Test
  .describe('Transform > String')
  .inputType<string>()
  .outputType<string>()
  .matrix({
    uppercase: [true, false],
    prefix: ['pre_', ''],
  })
  .cases(
    ['hello', 'hello'],
    ['world', 'world'],
  )
  .test(({ input, output, matrix }) => {
    let result = input
    if (matrix.prefix) result = matrix.prefix + result
    if (matrix.uppercase) result = result.toUpperCase()

    let expected = output
    if (matrix.prefix) expected = matrix.prefix + expected
    if (matrix.uppercase) expected = expected.toUpperCase()

    expect(result).toBe(expected)
  })

Test
  .describe('Transform > Number')
  .inputType<number>()
  .outputType<number>()
  .matrix({
    multiplier: [1, 10],
    offset: [0, 5],
  })
  .cases(
    [2, 2],
    [5, 5],
  )
  .test(({ input, output, matrix }) => {
    const result = input * matrix.multiplier + matrix.offset
    const expected = output * matrix.multiplier + matrix.offset
    expect(result).toBe(expected)
  })
