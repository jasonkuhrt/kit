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

// Tuple cases with .inputType() and .outputType() should have proper type inference
{
  Test.describe('tuple cases with i/o')
    .inputType<string>()
    .outputType<number>()
    .cases(
      ['input', 42],
      ['other', 100],
    )
    .test(({ input, output }) => {
      expectTypeOf(input).toEqualTypeOf<string>()
      expectTypeOf(output).toEqualTypeOf<number>()
    })
}

// With .on() mode - output is always optional
{
  const testFn = (s: string): number => s.length

  Test.on(testFn)
    .cases(
      [['hello'], 5], // with output
      [['world']], // without output (snapshot)
    )
    .test(({ result, output }) => {
      expectTypeOf(result).toEqualTypeOf<number>()
      expectTypeOf(output).toEqualTypeOf<number | undefined>()
    })
}

// Tuple formats with required output in generic mode
{
  Test.describe('tuple formats with required output')
    .inputType<string>()
    .outputType<number>()
    .cases(
      ['input1', 10], // input + output
      ['input2', 20], // input + output
      ['input3', 42], // input + output
      ['input4', 100], // input + output
    )
    .test(({ input, output }) => {
      expectTypeOf(input).toEqualTypeOf<string>()
      expectTypeOf(output).toEqualTypeOf<number>() // NOT undefined - output is required!
    })
}

// Context required tests
{
  Test.describe('context')
    .inputType<string>()
    .outputType<number>()
    .contextType<{ a: 0 }>()
    .cases(
      ['', 0, { a: 0 }],
    )
    .test(({ input, output, a }) => {
      expectTypeOf(input).toEqualTypeOf<string>()
      expectTypeOf(output).toEqualTypeOf<number>()
      expectTypeOf(a).toEqualTypeOf<0>()
    })

  Test.describe('context')
    .inputType<string>()
    .outputType<number>()
    .contextType<{ a: 0 }>()
    .cases(
      // @ts-expect-error Missing context
      ['', 0],
    )

  const testBuilder = Test.describe('context')
    .inputType<string>()
    .outputType<number>()
    .contextType<{ a: 0 }>()

  testBuilder.cases(
    // @ts-expect-error invalid context type - should have 'a: 0'
    ['test', 42, { z: 'wrong' }],
  )
}

// Simple type inference examples
{
  type TestType = { i: string; o: number }

  // This should work - direct conditional type
  function testDirect(
    fn: TestType extends { i: infer I; o: infer O } ? (i: I, o: O) => void
      : never,
  ): void {
    fn('hello', 42) // Should work
  }

  // Test it
  testDirect((i, o) => {
    // TypeScript should infer i: string, o: number
    const _i: string = i
    const _o: number = o
  })

  // Now test with a class
  class TestClass<T> {
    test(
      fn: T extends { i: infer I; o: infer O } ? (i: I, o: O) => void
        : never,
    ): void {
      // Implementation
    }
  }

  const instance = new TestClass<{ i: string; o: number }>()
  instance.test((i, o) => {
    // TypeScript should infer i: string, o: number
    const _i: string = i
    const _o: number = o
  })
}

// Test snapshot sugar methods type inference
{
  // .casesInput() with function mode
  const testFn = (a: number, b: number): number => a + b

  Test.on(testFn)
    .casesInput([1, 2], [3, 4], [5, 6])
    .test(({ input, result }) => {
      expectTypeOf(input).toEqualTypeOf<[number, number]>()
      expectTypeOf(result).toEqualTypeOf<number>()
    })

  // .casesInput() with generic mode
  Test.describe()
    .inputType<string>()
    .casesInput('a', 'b', 'c')
    .test(({ input }) => {
      expectTypeOf(input).toEqualTypeOf<string>()
    })

  // .describeInputs() with function mode
  Test.on(testFn)
    .describeInputs('edge cases', [[0, 0], [1, 1]])
    .test(({ input, result }) => {
      expectTypeOf(input).toEqualTypeOf<[number, number]>()
      expectTypeOf(result).toEqualTypeOf<number>()
    })

  // .describeInputs() with generic mode
  Test.describe()
    .inputType<number>()
    .describeInputs('numbers', [1, 2, 3])
    .test(({ input }) => {
      expectTypeOf(input).toEqualTypeOf<number>()
    })
}

// BUG: .casesInput() should accept unwrapped arguments for unary functions
{
  const unary = (x: number) => x * 2

  Test.on(unary).casesInput(1, 2, 3) // Should work but doesn't
}

// BUG: Unwrapped unary form accepts incorrect nesting
{
  const fn = (x: unknown) => x

  // @ts-expect-error - Should error: output inside args array
  Test.on(fn).cases([[1, 2]])

  // @ts-expect-error - Should error: output inside args array
  Test.on(fn).cases([[[]], false])
}
