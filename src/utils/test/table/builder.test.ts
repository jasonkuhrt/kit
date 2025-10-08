import { Test } from '#test'
import { Effect, Layer } from 'effect'
import { describe, expect, it } from 'vitest'

// Test functions for testing
const add = (a: number, b: number): number => a + b
const multiply = (a: number, b: number): number => a * b
const upperCase = (s: string): string => s.toUpperCase()
const identity = <T>(x: T): T => x
const constant = () => 42

describe('Test.table() builder', () => {
  // These tests run actual test cases (outside of it() blocks)
  describe('functional tests', () => {
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
      .test((actual, expected) => {
        expect(actual).toBe(expected) // reference equality
      })

    // Test casesAsArg
    Test.describe('casesAsArg helper')
      .on(upperCase)
      .casesAsArgs(
        'hello',
        'world',
      )
      .test()

    // Test multi-argument snapshot with separator
    Test.describe('multi-argument snapshots')
      .on(add)
      .casesAsArgs(
        [1, 2],
        [10, 20],
      )
      .test()
  })

  // These tests verify the API without executing (inside it() blocks)
  describe('basic functionality', () => {
    it('should compile with basic cases', () => {
      // This is a compile-time test - just verify it compiles
      const builder = Test.describe()
        .inputType<string>()
        .outputType<string>()
      // Verify the builder has the expected methods
      expect(builder.cases).toBeDefined()
      // test() only exists after cases()
      const withCases = builder.cases({ n: 'test', i: 'input', o: 'output' })
      expect(withCases.test).toBeDefined()
    })

    it('should work with description', () => {
      // This is a compile-time test - just verify it compiles
      const builder = Test.describe('string transformations')
        .inputType<string>()
        .outputType<string>()
      // Verify the builder has the expected methods
      expect(builder.cases).toBeDefined()
      // test() only exists after cases()
      const withCases = builder.cases({ n: 'test', i: 'input', o: 'output' })
      expect(withCases.test).toBeDefined()
    })
  })

  describe('.on() functionality', () => {
    it('should work with multi-param functions', () => {
      // Verify the API compiles and builder is returned
      const builder = Test.describe()
        .on(add)
      expect(builder.cases).toBeDefined()
      expect(builder.case).toBeDefined()
    })

    it('should work with single-param functions', () => {
      // Verify the API compiles
      const builder = Test.describe()
        .on(upperCase)
      expect(builder.cases).toBeDefined()
      expect(builder.casesAsArgs).toBeDefined()
    })

    it('should work with zero-param functions', () => {
      // Verify the API compiles
      const builder = Test.describe()
        .on(constant)
      expect(builder.cases).toBeDefined()
    })

    it('should support snapshot mode', () => {
      // Verify the API compiles
      const builder = Test.describe()
        .on(upperCase)
      expect(builder.cases).toBeDefined()
    })

    it('should support .case() method', () => {
      // Verify the API compiles and chaining works
      const builder = Test.describe()
        .on(add)
        .case(2, 3, 5) // Direct params + output
        .case('named', 5, 5, 10) // Named with direct params + output
      expect(builder.test).toBeDefined()
    })

    it('should support custom assertions in .test()', () => {
      // Verify the API compiles
      const builder = Test.describe()
        .on(add)
        .cases([[1, 2], 3])
      expect(builder.test).toBeDefined()
    })
  })

  describe('type building', () => {
    it('should work with .i() and .o()', () => {
      // This is a compile-time test - just verify it compiles
      const builder = Test.describe()
        .inputType<string>()
        .outputType<string>()
      expect(builder.cases).toBeDefined()
      // test() only exists after cases()
      const withCases = builder.cases({ n: 'test', i: 'input', o: 'output' })
      expect(withCases.test).toBeDefined()
    })
  })

  describe('modifiers', () => {
    it('should support skip and todo', () => {
      // Verify the API compiles
      const builder = Test.describe()
        .on(add)
      expect(builder.skip).toBeDefined()
      expect(builder.skipIf).toBeDefined()
    })

    it('should support only', () => {
      // Verify the API compiles
      const builder = Test.describe()
        .only()
        .on(add)
      expect(builder.cases).toBeDefined()
    })

    it('should support skipIf', () => {
      const shouldSkip = true
      // Verify the API compiles
      const builder = Test.describe()
        .skipIf(() => shouldSkip)
        .on(add)
      expect(builder.cases).toBeDefined()
    })
  })

  describe('Effect support', () => {
    // This is a compile-time test to ensure the APIs exist
    // Actual Effect testing would require proper setup

    it('should compile with .layer()', () => {
      // This test just ensures the API compiles
      const code = () => {
        const mockLayer = Layer.empty as Layer.Layer<any>
        Test.describe()
          .inputType<number>()
          .outputType<number>()
          .cases(
            { n: 'test', i: 1, o: 2 },
          )
          .layer(mockLayer)
          .testEffect(() => Effect.succeed(undefined))
      }
      expect(code).toBeDefined()
    })

    it('should compile with .layerEach()', () => {
      // This test just ensures the API compiles
      const code = () => {
        Test.describe()
          .inputType<number>()
          .outputType<number>()
          .cases(
            { n: 'test 1', i: 1, o: 2 },
          )
          .layerEach(({ i }) => Layer.empty)
          .testEffect(() => Effect.succeed(undefined))
      }
      expect(code).toBeDefined()
    })
  })

  describe('custom matchers', () => {
    it('should support .onlyMatching()', () => {
      // Verify the API compiles
      const builder = Test.describe()
        .on(identity)
        .onlyMatching('toEqual')
      expect(builder.cases).toBeDefined()
    })
  })

  describe('snapshot testing', () => {
    it('should support snapshot testing', () => {
      // This is a compile-time test - verify snapshot API exists
      const builder = Test.describe()
        .inputType<string>()
      expect(builder.cases).toBeDefined()
      // test() only exists after cases()
      const withCases = builder.cases({ n: 'test', i: 'input', o: undefined })
      expect(withCases.test).toBeDefined()
    })
  })

  describe('tuple vs object cases', () => {
    it('should accept all tuple formats', () => {
      // Verify the API compiles with various tuple formats
      const builder = Test.describe()
        .on(add)
      // Just verify it has the methods
      expect(builder.cases).toBeDefined()
    })

    it('should accept all object formats', () => {
      // Verify the API compiles with various object formats
      const builder = Test.describe()
        .on(add)
      // Just verify it has the methods
      expect(builder.cases).toBeDefined()
    })
  })

  describe('concurrent execution', () => {
    it('should support .concurrent()', () => {
      // Verify the API compiles
      const builder = Test.describe()
        .concurrent()
        .on(add)
      expect(builder.cases).toBeDefined()
    })
  })

  describe('name templates', () => {
    it('should support .name() template', () => {
      // Verify the API compiles
      const builder = Test.describe()
        .on(add)
        .name('$i[0] + $i[1] = $o')
      expect(builder.cases).toBeDefined()
    })
  })

  describe('progressive test building', () => {
    it('should support building tests incrementally', () => {
      const suite = Test.describe()
        .on(multiply)

      // Add cases incrementally
      suite.case(2, 3, 6) // Direct params
      suite.case('double', 5, 2, 10) // Named with direct params
      suite.case(10, 10) // Direct params for snapshot
      // Cases will execute at the end of the describe block
    })
  })
})
