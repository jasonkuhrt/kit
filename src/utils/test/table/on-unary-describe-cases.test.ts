import { Test } from '#test'
import { describe } from 'vitest'

/**
 * Tests for `.on(unary).describe(name, cases)` pattern.
 *
 * This pattern should work but currently has a TypeScript type bug where
 * the cases array format is not correctly inferred for unary functions.
 */

const upperCase = (s: string): string => s.toUpperCase()
const double = (n: number): number => n * 2
const negate = (b: boolean): boolean => !b

describe('Test.on(unary).describe(name, cases) pattern', () => {
  // This pattern should work but currently fails with type errors

  // ✅ This works - describe first, then on, then cases
  Test.describe('working pattern: describe > on > cases')
    .on(upperCase)
    .cases(
      ['hello', 'HELLO'],
      ['world', 'WORLD'],
    )
    .test()

  // ❌ This SHOULD work but has type error - on first, then describe with inline cases
  // Expected: unary function should accept [input, output] not [[input], output]
  Test.on(upperCase)
    .describe('failing pattern: on > describe(name, cases)', [
      ['hello', 'HELLO'], // Type error: should work for unary
      ['world', 'WORLD'],
    ])
    .test()

  // ❌ Another example with different unary function
  Test.on(double)
    .describe('number doubling', [
      [2, 4],
      [10, 20],
    ])
    .test()

  // ❌ Boolean negation
  Test.on(negate)
    .describe('boolean negation', [
      [true, false],
      [false, true],
    ])
    .test()

  // For comparison: multi-arg functions require tuple wrapping (this works correctly)
  const add = (a: number, b: number) => a + b
  Test.on(add)
    .describe('addition', [
      [[1, 2], 3], // Correctly requires [[args], output]
      [[5, 5], 10],
    ])
    .test()
})
