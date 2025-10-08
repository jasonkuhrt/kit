import { Test } from '#test'
import { describe, expect } from 'vitest'

// Example: Simple function testing with Test.table()
const add = (a: number, b: number): number => a + b
const multiply = (a: number, b: number): number => a * b

describe('Test.table() examples', () => {
  // Example 1: Basic usage with .on()
  Test.describe()
    .on(add)
    .cases(
      [[2, 3], 5],
      ['negative numbers', [-1, -2], -3],
      [[10, 10], 20],
    )

  // Example 2: With description
  Test.describe('multiplication tests')
    .on(multiply)
    .cases(
      [[2, 3], 6],
      [[5, 5], 25],
      [[-2, 3], -6],
    )

  // Example 3: Using .case() for incremental building
  const suite = Test.describe()
    .on(add)
    .case(1, 1, 2)
    .case('three plus four', 3, 4, 7)
    .case(5, 5, 10)

  suite.cases() // Execute

  // Example 4: Without .on() - custom test logic
  Test.describe('custom validation')
    .inputType<string>()
    .outputType<boolean>()
    .cases(
      { n: 'valid email', i: 'user@example.com', o: true },
      { n: 'invalid email', i: 'not-an-email', o: false },
    )
    .test(({ input, output }) => {
      const isValid = input.includes('@')
      expect(isValid).toBe(output)
    })

  // Example 5: Snapshot testing (output omitted)
  Test.describe('snapshot examples')
    .on(add)
    .cases(
      [[100, 200]], // Will snapshot the result
      ['complex calc', [999, 1]], // Named snapshot
    )
})
