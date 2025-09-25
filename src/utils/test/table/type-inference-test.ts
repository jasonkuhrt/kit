import { expectTypeOf } from 'vitest'
import { Test } from '../$.js'

// Test 1: Tuple cases with .i() and .o() should have proper type inference
{
  Test.describe('tuple cases with i/o')
    .i<string>()
    .o<number>()
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

// Test 2: Object cases with .i() and .o() should have proper type inference
{
  Test.describe('object cases with i/o')
    .i<string>()
    .o<number>()
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
    .i<string>()
    .o<number>()
    .cases<{ extra: boolean }>(
      { n: 'case 1', i: 'input', o: 42, extra: true },
      { n: 'case 2', i: 'other', o: 100, extra: false },
    )
    .test((i, o, ctx) => {
      expectTypeOf(i).toEqualTypeOf<string>()
      expectTypeOf(o).toEqualTypeOf<number>()
      expectTypeOf(ctx).toEqualTypeOf<{ extra: boolean }>()
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

// Test 5: Mixed tuple formats - BUT .i()/.o() mode requires output!
// This test is invalid - without .on(), if .o() is specified, output is required
// We need to either:
// 1. Remove .o() to allow optional output (but then output is forbidden)
// 2. Provide output for all cases
// Let's provide output for all cases since .o<number>() is specified
{
  Test.describe('tuple formats with required output')
    .i<string>()
    .o<number>()
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
    .i<string>()
    .o<number>()
    .cases(
      // @ts-expect-error missing input (or could say that input of 10 is invalid, who knows which really)
      ['input1', 10], // input + output
    )
}

{
  Test.describe('context')
    .i<string>()
    .o<number>()
    .cases<{ a: 0 }>(
      ['', [''], 0, { a: 0 }],
    )
    .test((i, o, ctx) => {
      expectTypeOf(i).toEqualTypeOf<string>()
      expectTypeOf(o).toEqualTypeOf<number>()
      expectTypeOf(ctx).toEqualTypeOf<{ a: 0 }>()
    })

  Test.describe('context')
    .i<string>()
    .o<number>()
    .cases<{ a: 0 }>(
      // @ts-expect-error Missing context
      ['', [''], 0],
    )

  const testBuilder = Test.describe('context')
    .i<string>()
    .o<number>()

  // This should error
  testBuilder.cases<{ a: 0 }>(
    // @ts-expect-error invalid context type - should have 'a: 0'
    ['test', ['input'], 42, { z: 'wrong' }],
  )
}
