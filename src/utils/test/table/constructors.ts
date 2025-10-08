import type { Fn } from '#fn'
import { Option } from 'effect'
import * as Types from './builder-types.ts'
import * as Builder from './builder.ts'

/**
 * Creates a test table builder for testing a specific function.
 *
 * This is a shorthand for `describe().on(fn)` when you don't need a describe block.
 * Types are automatically inferred from the function signature, making it ideal for
 * quick function testing with minimal boilerplate.
 *
 * ## Case Formats
 *
 * Test cases can be specified in multiple formats:
 *
 * **Tuple Format** (most common):
 * - `[[arg1, arg2], expected]` - Test with expected output
 * - `['name', [arg1, arg2], expected]` - Named test case
 * - `[[arg1, arg2]]` - Snapshot test (no expected value)
 *
 * **Object Format** (more verbose but clearer):
 * - `{ input: [arg1, arg2], output: expected }`
 * - `{ input: [arg1, arg2], output: expected, skip: true, comment: 'name' }`
 * - `{ todo: 'Not implemented yet', comment: 'name' }`
 *
 * @example
 * ```ts
 * // Basic function testing
 * Test.on(add)
 *   .cases(
 *     [[2, 3], 5],                    // add(2, 3) === 5
 *     [[0, 0], 0],                    // add(0, 0) === 0
 *     [[-1, 1], 0]                    // add(-1, 1) === 0
 *   )
 *   .test()
 *
 * // Using different case formats
 * Test.on(multiply)
 *   .cases(
 *     [[2, 3], 6],                              // Tuple format
 *     ['zero case', [5, 0], 0],                 // Named tuple
 *     { input: [-2, 3], output: -6 },           // Object format
 *     { input: [100, 100], output: 10000, comment: 'large numbers' }
 *   )
 *   .test()
 *
 * // Custom assertions
 * Test.on(divide)
 *   .cases([[10, 2], 5], [[10, 0], Infinity])
 *   .test(({ result, output }) => {
 *     if (output === Infinity) {
 *       expect(result).toBe(Infinity)
 *     } else {
 *       expect(result).toBeCloseTo(output, 2)
 *     }
 *   })
 *
 * // Output transformation - build full expectations from partials
 * Test.on(createUser)
 *   .onOutput((partial, context) => ({ ...defaultUser, name: context.input[0], ...partial }))
 *   .cases(
 *     [['Alice'], { role: 'admin' }],           // Only specify differences
 *     [['Bob'], { role: 'user', age: 30 }]
 *   )
 *   .test()
 * ```
 *
 * ## Snapshot Mode with Error Handling
 *
 * When no expected output is provided, tests automatically run in snapshot mode.
 * Errors thrown during execution are automatically caught and included in snapshots
 * with clear "THEN THROWS" vs "THEN RETURNS" formatting:
 *
 * @example
 * ```ts
 * // Mix successful and error cases - errors are captured automatically
 * Test.on(parseInt)
 *   .cases(
 *     ['42'],      // Returns: 42
 *     ['hello'],   // Returns: NaN
 *   )
 *   .test()
 *
 * // Validation functions - errors documented in snapshots
 * Test.on(Positive.from)
 *   .cases(
 *     [1], [10], [100],        // THEN RETURNS the value
 *     [0], [-1], [-10],        // THEN THROWS "Value must be positive"
 *   )
 *   .test()
 * ```
 *
 * Snapshot format shows arguments and results clearly:
 * ```
 * ╔══════════════════════════════════════════════════╗ GIVEN ARGUMENTS
 * 1
 * ╠══════════════════════════════════════════════════╣ THEN RETURNS
 * 1
 * ╚══════════════════════════════════════════════════╝
 * ```
 *
 * For errors:
 * ```
 * ╔══════════════════════════════════════════════════╗ GIVEN ARGUMENTS
 * -1
 * ╠══════════════════════════════════════════════════╣ THEN THROWS
 * Error: Value must be positive
 * ╚══════════════════════════════════════════════════╝
 * ```
 *
 * @param $fn - The function to test. Types are inferred from its signature
 * @returns A {@link TestBuilder} for configuring and running tests
 *
 * @see {@link describe} for creating tests with a describe block
 */
export function on<$fn extends Fn.AnyAny>(
  $fn: $fn,
): Types.TestBuilder<Types.UpdateState<Types.BuilderTypeStateEmpty, { fn: $fn }>> {
  const initialState = {
    ...Builder.defaultState,
    fn: Option.some($fn),
  }
  return Builder.create(initialState) as any
}

/**
 * Creates a test table builder for property-based and example-based testing.
 *
 * Test tables allow you to define multiple test cases with inputs and expected outputs,
 * reducing boilerplate and making tests more maintainable. The builder supports two modes:
 *
 * ## Modes
 *
 * **Function Mode** - Test a specific function with `.on(fn)`:
 * - Types are automatically inferred from the function signature
 * - Test cases specify function arguments and expected return values
 * - Default assertion compares actual vs expected using Effect's equality
 *
 * **Generic Mode** - Define custom types with `.i<T>()` and `.o<T>()`:
 * - Explicitly specify input and output types
 * - Provide custom test logic to validate cases
 * - Useful for testing complex behaviors beyond simple function calls
 *
 * ## Features
 *
 * **Nested Describes** - Use ` > ` separator to create nested describe blocks:
 * - `Test.describe('Parent > Child')` creates `describe('Parent', () => describe('Child', ...))`
 * - Multiple tests with the same prefix share the outer describe block
 * - Supports any depth: `'API > Users > Create'` creates three levels
 *
 * **Matrix Testing** - Use `.matrix()` to run cases across parameter combinations:
 * - Generates cartesian product of all matrix value arrays
 * - Each test case runs once for each combination
 * - Matrix values available as `matrix` in test context
 * - Combines with nested describes for organized test suites
 *
 * @example
 * ```ts
 * // Function mode - testing a math function
 * Test.describe('addition')
 *   .on(add)
 *   .cases(
 *     [[2, 3], 5],                          // add(2, 3) should return 5
 *     ['negative', [-1, -2], -3],           // Named test case
 *     [[0, 0], 0]                           // Edge case
 *   )
 *   .test()  // Uses default assertion (Effect's Equal.equals)
 *
 * // Generic mode - custom validation logic
 * Test.describe('email validation')
 *   .inputType<string>()
 *   .outputType<boolean>()
 *   .cases(
 *     ['user@example.com', true],
 *     ['invalid.com', false],
 *     ['', false]
 *   )
 *   .test(({ input, output }) => {
 *     const result = isValidEmail(input)
 *     expect(result).toBe(output)
 *   })
 *
 * // Nested describe blocks with ' > ' separator
 * Test.describe('Transform > String')  // Creates nested: Transform -> String
 *   .inputType<string>()
 *   .outputType<string>()
 *   .cases(['hello', 'HELLO'])
 *   .test(({ input, output }) => {
 *     expect(input.toUpperCase()).toBe(output)
 *   })
 *
 * Test.describe('Transform > Number')  // Shares 'Transform' parent describe
 *   .inputType<number>()
 *   .outputType<number>()
 *   .cases([42, 42])
 *   .test(({ input, output }) => {
 *     expect(input).toBe(output)
 *   })
 *
 * // Matrix testing - runs each case for all parameter combinations
 * Test.describe('string transform')
 *   .inputType<string>()
 *   .outputType<string>()
 *   .matrix({
 *     uppercase: [true, false],
 *     prefix: ['', 'pre_'],
 *   })
 *   .cases(
 *     ['hello', 'hello'],
 *     ['world', 'world']
 *   )
 *   .test(({ input, output, matrix }) => {
 *     // Runs 4 times (2 cases × 2 uppercase × 2 prefix = 8 tests)
 *     let result = input
 *     if (matrix.prefix) result = matrix.prefix + result
 *     if (matrix.uppercase) result = result.toUpperCase()
 *
 *     let expected = output
 *     if (matrix.prefix) expected = matrix.prefix + expected
 *     if (matrix.uppercase) expected = expected.toUpperCase()
 *
 *     expect(result).toBe(expected)
 *   })
 * ```
 *
 * @param description - Optional description for the test suite. Supports ` > ` separator for nested describe blocks.
 * @returns A {@link TestBuilder} for chaining configuration, cases, and execution
 *
 * @see {@link on} for function mode without a describe block
 * @see {@link TestBuilder.matrix matrix()} for matrix testing documentation
 */
export function describe(
  description?: string,
): Types.TestBuilderEmpty {
  const initialState = description
    ? { ...Builder.defaultState, config: { description } }
    : Builder.defaultState
  return Builder.create(initialState)
}
