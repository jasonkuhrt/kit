import { expectTypeOf } from 'vitest'
import { Test } from '../$.js'

// Test 1: Tuple cases with .inputType() and .outputType() should have proper type inference
{
  Test.describe('tuple cases with i/o')
    .inputType<string>()
    .outputType<number>()
    .cases(
      ['case 1', ['input'], 42],
      ['case 2', ['other'], 100],
    )
    .test((i, o, ctx) => {
      // These should infer correctly without annotation
      expectTypeOf(i).toEqualTypeOf<string>()
      expectTypeOf(o).toEqualTypeOf<number>()
      // expectTypeOf(ctx).toEqualTypeOf<{}>()
    })
}

// Test 2: Object cases with .inputType() and .outputType() should have proper type inference
{
  Test.describe('object cases with i/o')
    .inputType<string>()
    .outputType<number>()
    .cases(
      { n: 'case 1', i: 'input', o: 42 },
      { n: 'case 2', i: 'other', o: 100 },
    )
    .test((i, o, ctx) => {
      expectTypeOf(i).toEqualTypeOf<string>()
      expectTypeOf(o).toEqualTypeOf<number>()
      // expectTypeOf(ctx).toEqualTypeOf<{ i: string; o: number; n: string }>()
    })
}

// Test 3: Tuple cases with context
{
  Test.describe('tuple cases with context')
    .inputType<string>()
    .outputType<number>()
    .contextType<{ extra: boolean }>()
    .cases(
      { n: 'case 1', i: 'input', o: 42, extra: true },
      { n: 'case 2', i: 'other', o: 100, extra: false },
    )
    .test((i, o, ctx) => {
      expectTypeOf(i).toEqualTypeOf<string>()
      expectTypeOf(o).toEqualTypeOf<number>()
      expectTypeOf(ctx.extra).toEqualTypeOf<boolean>()
    })
}

// Test 4: With .on() mode - output is always optional
{
  const testFn = (s: string): number => s.length

  Test.on(testFn)
    .cases(
      [['hello'], 5], // with output
      [['world']], // without output (snapshot)
      ['named', ['test'], 4], // named with output
      ['snapshot', ['foo']], // named without output
    )
    .test((result, expected) => {
      expectTypeOf(result).toEqualTypeOf<number>()
      expectTypeOf(expected).toEqualTypeOf<number | undefined>()
    })
}

// Test 5: Mixed tuple formats - BUT .inputType()/.outputType() mode requires output!
// This test is invalid - without .on(), if .outputType() is specified, output is required
// We need to either:
// 1. Remove .outputType() to allow optional output (but then output is forbidden)
// 2. Provide output for all cases
// Let's provide output for all cases since .outputType<number>() is specified
{
  Test.describe('tuple formats with required output')
    .inputType<string>()
    .outputType<number>()
    .cases(
      [['input1'], 10], // input + output
      ['named', ['input2'], 20], // named input + output
      [['input3'], 42], // input + output
      ['complete', ['input4'], 100], // name + input + output
    )
    .test((i, o, ctx) => {
      expectTypeOf(i).toEqualTypeOf<string>()
      expectTypeOf(o).toEqualTypeOf<number>() // NOT undefined - output is required!
      // expectTypeOf(ctx).toEqualTypeOf<{}>()
    })
  Test.describe('tuple formats with required output')
    .inputType<string>()
    .outputType<number>()
    .cases(
      // @ts-expect-error missing input (or could say that input of 10 is invalid, who knows which really)
      ['input1', 10], // input + output
    )
}

{
  Test.describe('context')
    .inputType<string>()
    .outputType<number>()
    .contextType<{ a: 0 }>()
    .cases(
      ['', [''], 0, { a: 0 }],
    )
    .test((i, o, ctx) => {
      expectTypeOf(i).toEqualTypeOf<string>()
      expectTypeOf(o).toEqualTypeOf<number>()
      expectTypeOf(ctx.a).toEqualTypeOf<0>()
    })

  Test.describe('context')
    .inputType<string>()
    .outputType<number>()
    .contextType<{ a: 0 }>()
    .cases(
      // @ts-expect-error Missing context
      ['', [''], 0],
    )

  const testBuilder = Test.describe('context')
    .inputType<string>()
    .outputType<number>()
    .contextType<{ a: 0 }>()

  // This should error
  testBuilder.cases(
    // @ts-expect-error invalid context type - should have 'a: 0'
    ['test', ['input'], 42, { z: 'wrong' }],
  )
}
