import { expectTypeOf } from 'vitest'
import { Test } from '../$.js'

// Test 1: Tuple cases with .inputType() and .outputType() should have proper type inference
{
  Test.describe('tuple cases with i/o')
    .inputType<string>()
    .outputType<number>()
    .cases(
      ['input', 42],
      ['other', 100],
    )
    .test(({ input, output }) => {
      // These should infer correctly without annotation
      expectTypeOf(input).toEqualTypeOf<string>()
      expectTypeOf(output).toEqualTypeOf<number>()
      // expectTypeOf(ctx).toEqualTypeOf<{}>()
    })
}

// Test 2: Object cases with .inputType() and .outputType() should have proper type inference
{
  Test.describe('object cases with i/o')
    .inputType<string>()
    .outputType<number>()
    .cases(
      { comment: 'case 1', input: 'input', output: 42 },
      { comment: 'case 2', input: 'other', output: 100 },
    )
    .test(({ input, output }) => {
      expectTypeOf(input).toEqualTypeOf<string>()
      expectTypeOf(output).toEqualTypeOf<number>()
      // expectTypeOf(ctx).toEqualTypeOf<{ input: string; output: number; comment: string }>()
    })
}

// Test 3: Tuple cases with context
{
  Test.describe('tuple cases with context')
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

// Test 4: With .on() mode - output is always optional
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

// Test 5: Tuple formats with required output in generic mode
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
      // expectTypeOf(ctx).toEqualTypeOf<{}>()
    })
}

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

  // This should error
  testBuilder.cases(
    // @ts-expect-error invalid context type - should have 'a: 0'
    ['test', 42, { z: 'wrong' }],
  )
}
