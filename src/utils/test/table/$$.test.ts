import { Test } from '#test'
import { describe, expect } from 'vitest'

// Test functions for testing
const add = (a: number, b: number): number => a + b
const multiply = (a: number, b: number): number => a * b
const upperCase = (s: string): string => s.toUpperCase()
const identity = <T>(x: T): T => x
const constant = () => 42

describe('Test.table() builder', () => {
  describe('basic functionality', () => {
    // Test default assertion (toEqual)
    Test.describe('default toEqual assertion')
      .on(add)
      .cases(
        [[1, 2], 3],
        [[5, 5], 10],
      )

    // Test structural equality with toEqual
    const merge = (a: any, b: any) => ({ ...a, ...b })
    Test.describe('structural equality')
      .on(merge)
      .cases(
        [[{ a: 1 }, { b: 2 }], { a: 1, b: 2 }], // structural equality works with toEqual
      )

    // Test custom assertion
    Test.describe('custom assertion')
      .on(identity)
      .cases(
        [[42], 42],
      )
      .test(({ result, output }) => {
        expect(result).toBe(output) // reference equality
      })

    // Test cases helper
    Test.describe('cases helper')
      .on(upperCase)
      .cases(
        [['hello']],
        [['world']],
      )
      .test()

    // Test multi-argument snapshot with separator
    Test.describe('multi-argument snapshots')
      .on(add)
      .cases(
        [[1, 2]],
        [[10, 20]],
      )
      .test()
  })

  describe('auto-snapshot from test callback', () => {
    // Generic mode with auto-snapshot
    Test
      .describe('auto-snapshot generic mode')
      .inputType<string>()
      .outputType<number>()
      .cases({ comment: 'test', input: 'hello', output: 42 })
      .test(() => {
        return null
      })

    // Function mode with custom return value
    Test
      .describe('auto-snapshot function mode')
      .on(add)
      .cases([[1, 2], 3])
      .test(() => {
        return { custom: 'snapshot data' }
      })

    // Returning undefined (no snapshot)
    Test
      .describe('no auto-snapshot when undefined returned')
      .inputType<string>()
      .outputType<number>()
      .cases({ comment: 'test', input: 'world', output: 100 })
      .test(() => {
        // Returning nothing (undefined) - no snapshot
      })
  })
})

describe('onSetup', () => {
  // dprint-ignore
  Test
    .describe('with generic mode')
    .inputType<number>()
    .outputType<{ value: number }>()
    .onSetup(() => ({ multiplier: 2 }))
    .cases(
      ({ multiplier }) => [5, { value: 5 * multiplier }],
      ({ multiplier }) => [10, { value: 10 * multiplier }],
    )
    .test(({ input, output }) => {
      expect({ value: input * 2 }).toEqual(output)
    })

  // dprint-ignore
  Test
    .on((x: number) => x * 2)
    .onSetup(() => ({ base: 10 }))
    .cases(
      ({ base }) => [[base], 20],
      ({ base }) => [[base + 5], 30],
    )
    .test()

  // Multiple onSetup calls - contexts merge
  // dprint-ignore
  Test
    .describe('multiple onSetup')
    .inputType<number>()
    .outputType<number>()
    .onSetup(() => ({ a: 1 }))
    .onSetup(() => ({ b: 2 }))
    .cases(
      ({ a, b }) => [a + b, a + b],
    )
    .test(({ input, output }) => {
      expect(input).toBe(output)
    })
})

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

describe('nested describe syntax', () => {
  describe('basic nesting', () => {
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
  })

  describe('with matrix', () => {
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
  })

  describe('with .case() method', () => {
    Test
      .describe('a')
      .inputType<1>()
      .describe('b', _ => _.case(1))
      .test(({ input }) => {
        expect(input).toBe(1)
      })

    // Also test with output type
    Test
      .describe('with output')
      .inputType<number>()
      .outputType<string>()
      .describe('nested', _ =>
        _
          .case(42, 'forty-two')
          .case(100, 'one hundred'))
      .test(({ input, output }) => {
        expect(typeof input).toBe('number')
        expect(typeof output).toBe('string')
      })
  })
})

describe('snapshot sugar methods', () => {
  describe('.casesInput()', () => {
    // Function mode
    Test
      .on(add)
      .casesInput([1, 2], [3, 4], [5, 6])
      .test()

    // Generic mode
    Test
      .describe('generic mode')
      .inputType<string>()
      .casesInput('a', 'b', 'c')
      .test()
  })

  describe('.describeInputs()', () => {
    // Function mode
    Test
      .on(add)
      .describeInputs('edge cases', [[0, 0], [1, 1], [-1, 1]])
      .test()

    // Generic mode
    Test
      .describe()
      .inputType<string>()
      .describeInputs('examples', ['hello', 'world', 'test'])
      .test()
  })
})
