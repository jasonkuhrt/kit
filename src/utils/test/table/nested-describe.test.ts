import { Test } from '#test'
import { expect } from 'vitest'

// Demonstrates nested describe syntax with ' > ' separator
// These should create shared 'Arguments' parent describe block
Test
  .describe('Arguments > Enums')
  .inputType<string>()
  .outputType<string>()
  .cases(
    ['A', 'A'],
    ['B', 'B'],
  )
  .test(({ input, output }) => {
    expect(input).toBe(output)
  })

Test
  .describe('Arguments > Objects')
  .inputType<string>()
  .outputType<string>()
  .cases(
    ['foo', 'foo'],
    ['bar', 'bar'],
  )
  .test(({ input, output }) => {
    expect(input).toBe(output)
  })

// Demonstrates deeper nesting
Test
  .describe('API > Users > Create')
  .inputType<{ name: string }>()
  .outputType<{ name: string; id: number }>()
  .cases(
    [{ name: 'Alice' }, { name: 'Alice', id: 1 }],
    [{ name: 'Bob' }, { name: 'Bob', id: 2 }],
  )
  .test(({ input, output }) => {
    expect(output.name).toBe(input.name)
    expect(typeof output.id).toBe('number')
  })

Test
  .describe('API > Users > Delete')
  .inputType<number>()
  .outputType<boolean>()
  .cases(
    [1, true],
    [999, true],
  )
  .test(({ input, output }) => {
    expect(output).toBe(true)
  })
