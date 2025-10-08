import { Test } from '#test'
import { expect } from 'vitest'

Test
  .describe('matrix with config')
  .inputType<string>()
  .outputType<string>()
  .matrix({
    prefix: [undefined, 'pre_'],
    suffix: [undefined, '_post'],
  })
  .cases(
    ['hello', 'hello'],
    ['world', 'world'],
  )
  .test(({ input, output, matrix }) => {
    // Apply matrix transformations
    let result = input
    if (matrix.prefix) result = matrix.prefix + result
    if (matrix.suffix) result = result + matrix.suffix

    let expected = output
    if (matrix.prefix) expected = matrix.prefix + expected
    if (matrix.suffix) expected = expected + matrix.suffix

    expect(result).toBe(expected)
  })
