import { expectTypeOf } from 'vitest'
import { Test } from '../$.js'

// Test type inference with .i() and .o() using object cases
{
  Test.describe('test with i/o and object cases')
    .inputType<string>()
    .outputType<number>()
    .cases(
      { comment: 'case 1', input: 'input', output: 42 },
      { comment: 'case 2', input: 'other', output: 100 },
    )
    .test(({ input, output }) => {
      expectTypeOf(input).toEqualTypeOf<string>()
      expectTypeOf(output).toEqualTypeOf<number>()
    })
}

// Test type inference with .i() and .o() using object cases (second test)
{
  Test.describe('test with i/o and object cases 2')
    .inputType<string>()
    .outputType<number>()
    .cases(
      { comment: 'case 1', input: 'input', output: 42 },
      { comment: 'case 2', input: 'other', output: 100 },
    )
    .test(({ input, output }) => {
      expectTypeOf(input).toEqualTypeOf<string>()
      expectTypeOf(output).toEqualTypeOf<number>()
    })
}

// Test type inference with custom context properties
{
  Test.describe('test with custom context')
    .inputType<string>()
    .outputType<number>()
    .contextType<{ extra: boolean }>()
    .cases(
      { comment: 'case 1', input: 'input', output: 42, extra: true },
      { comment: 'case 2', input: 'other', output: 100, extra: false },
    )
    .test(({ input, output, extra }) => {
      expectTypeOf(input).toEqualTypeOf<string>()
      expectTypeOf(output).toEqualTypeOf<number>()
      expectTypeOf(extra).toEqualTypeOf<boolean>()
    })
}

// Test type inference with .on() for functions
{
  const myFunction = (a: string, b: number): boolean => true

  Test.describe('test with .on()')
    .on(myFunction)
    .cases(
      [['hello', 42], true],
      [['world', 100], false],
    )
  // Note: .cases() with .on() executes immediately, no .test() needed
}

// Test type inference without .i() and .o() (generic mode)
{
  Test.describe('test with context')
    .inputType<string>()
    .outputType<number>()
    .contextType<{ extra: string; flag: boolean }>()
    .cases(
      { comment: 'case 1', input: 'hello', output: 5, extra: 'metadata1', flag: true },
      { comment: 'case 2', input: 'world', output: 10, extra: 'metadata2', flag: false },
    )
    .test(({ input, output, extra, flag }) => {
      expectTypeOf(input).toEqualTypeOf<string>()
      expectTypeOf(output).toEqualTypeOf<number>()
      expectTypeOf(extra).toEqualTypeOf<string>()
      expectTypeOf(flag).toEqualTypeOf<boolean>()
    })
}
