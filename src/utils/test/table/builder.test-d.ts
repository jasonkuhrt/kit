import { expectTypeOf } from 'vitest'
import { Test } from '../$.js'

// Test type inference with .i() and .o() using tuple cases
{
  Test.describe('test with i/o and tuple cases')
    .inputType<string>()
    .outputType<number>()
    .cases(
      ['case 1', ['input'], 42],
      ['case 2', ['other'], 100],
    )
    .test(({ input, output }) => {
      expectTypeOf(input).toEqualTypeOf<string>()
      expectTypeOf(output).toEqualTypeOf<number>()
    })
}

// Test type inference with .i() and .o() using object cases
{
  Test.describe('test with i/o and object cases')
    .inputType<string>()
    .outputType<number>()
    .cases(
      { n: 'case 1', i: 'input', o: 42 },
      { n: 'case 2', i: 'other', o: 100 },
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
      { n: 'case 1', i: 'input', o: 42, extra: true },
      { n: 'case 2', i: 'other', o: 100, extra: false },
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
      { n: 'case 1', i: 'hello', o: 5, extra: 'metadata1', flag: true },
      { n: 'case 2', i: 'world', o: 10, extra: 'metadata2', flag: false },
    )
    .test(({ input, output, extra, flag }) => {
      expectTypeOf(input).toEqualTypeOf<string>()
      expectTypeOf(output).toEqualTypeOf<number>()
      expectTypeOf(extra).toEqualTypeOf<string>()
      expectTypeOf(flag).toEqualTypeOf<boolean>()
    })
}
