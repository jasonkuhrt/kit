import type { Fn } from '#fn'
import type { Obj } from '#obj'
import { Ts } from '#ts'
import type { Effect, Layer } from 'effect'
import type { TestContext } from 'vitest'

// ============================================================================
// Core Types
// ============================================================================

/**
 * Type-level state for the builder.
 * Tracks what types have been set via builder methods.
 */

export interface BuilderTypeState {
  i: unknown
  o: unknown
  context: {}
  fn: Fn.AnyAny // The function being tested (never if not in .on() mode)
}

// ============================================================================
// Kind Definitions for Builder Types
// ============================================================================

/**
 * Kind for TableBuilderBase that takes State and returns the builder.
 */
interface TableBuilderBaseKind extends Ts.Kind.Kind<[BuilderTypeState], unknown> {
  return: TableBuilderBase<this['parameters'][0]>
}

/**
 * Kind for TableBuilderWithFunction that takes State and returns the builder.
 */
interface TableBuilderWithFunctionKind extends Ts.Kind.Kind<[BuilderTypeState], unknown> {
  return: TableBuilderWithFunction<this['parameters'][0]>
}

/**
 * Kind for TableBuilderWithCases that takes State and returns the builder.
 */
interface TableBuilderWithCasesKind extends Ts.Kind.Kind<[BuilderTypeState], unknown> {
  return: TableBuilderWithCases<this['parameters'][0]>
}

/**
 * Kind for TableBuilderWithMappedFunction that takes [State, Fn, MappedInput] and returns the builder.
 */
interface TableBuilderWithMappedFunctionKind extends Ts.Kind.Kind<[BuilderTypeState, Fn.AnyAny, unknown], unknown> {
  return: TableBuilderWithMappedFunction<
    this['parameters'][0],
    this['parameters'][1],
    this['parameters'][2]
  >
}

/**
 * Kind for TableBuilderWithFunctionAndLayers that takes [State, Fn, R] and returns the builder.
 */
interface TableBuilderWithFunctionAndLayersKind extends Ts.Kind.Kind<[BuilderTypeState, Fn.AnyAny, unknown], unknown> {
  return: TableBuilderWithFunctionAndLayers<
    this['parameters'][0],
    this['parameters'][1],
    this['parameters'][2]
  >
}

/**
 * Kind for TableBuilderWithCasesAndLayers that takes [State, R] and returns the builder.
 */
interface TableBuilderWithCasesAndLayersKind extends Ts.Kind.Kind<[BuilderTypeState, unknown], unknown> {
  return: TableBuilderWithCasesAndLayers<
    this['parameters'][0],
    this['parameters'][1]
  >
}

// ============================================================================
// Helper Types for State and Function Operations
// ============================================================================

/**
 * Helper to update state with partial updates.
 * Preserves existing state values when updates are not provided.
 */
type UpdateState<State extends BuilderTypeState, Updates extends Partial<BuilderTypeState>> = {
  i: 'i' extends keyof Updates ? Updates['i'] : State['i']
  o: 'o' extends keyof Updates ? Updates['o'] : State['o']
  context: 'context' extends keyof Updates ? Updates['context'] : State['context']
  fn: 'fn' extends keyof Updates ? Updates['fn'] : State['fn']
}

/**
 * Extract function parameters from state.
 */
type FnParams<State extends BuilderTypeState> = State['fn'] extends (...args: infer P) => any ? P : never

/**
 * Extract function return type from state.
 */
type FnReturn<State extends BuilderTypeState> = State['fn'] extends (...args: any[]) => infer R ? R : never

/**
 * Extract both parameters and return type from state.
 */
type FnSignature<State extends BuilderTypeState> = State['fn'] extends (...args: infer P) => infer R ? [P, R] : never

/**
 * Extract i, o, and context from state as a tuple.
 */
type StateIOContext<T extends BuilderTypeState> = T extends { i: infer I; o: infer O; context: infer Ctx } ? [I, O, Ctx]
  : never

/**
 * Test function signature for generic mode (non-.on() mode).
 */
type GenericTestFn<T extends BuilderTypeState> = StateIOContext<T> extends [infer I, infer O, infer Ctx]
  ? (i: I, o: O, ctx: Ctx, context: TestContext) => void | Promise<void>
  : never

/**
 * Effect test function signature for generic mode.
 */
type GenericEffectTestFn<T extends BuilderTypeState, R> = StateIOContext<T> extends [infer I, infer O, infer Ctx]
  ? (i: I, o: O, ctx: Ctx) => Effect.Effect<void, any, R>
  : never

/**
 * Test function signature for function mode (.on() mode).
 */
type FunctionTestFn<State extends BuilderTypeState> = FnSignature<State> extends [infer P, infer R]
  ? (result: R, expected: R | undefined, ctx: State['context'], context: TestContext) => void | Promise<void>
  : never

/**
 * Effect test function signature for function mode.
 */
type FunctionEffectTestFn<State extends BuilderTypeState, R> = FnSignature<State> extends [infer P, infer Ret]
  ? (i: P, o: Ret | undefined, ctx: State['context']) => Effect.Effect<void, any, R>
  : never

// ============================================================================
// Case Types
// ============================================================================

/**
 * Base properties available for all test cases in object form.
 *
 * These properties can be used to control test execution and organization
 * on a per-case basis.
 *
 * @example
 * ```ts
 * Test.on(add).cases(
 *   { n: 'basic', i: [1, 2], o: 3 },
 *   { n: 'skip this', i: [2, 2], o: 4, skip: 'Flaky on CI' },
 *   { n: 'not ready', todo: 'Implement negative number handling' },
 *   { n: 'focus', i: [5, 5], o: 10, only: true }
 * )
 * ```
 */
export interface CaseObjectBase {
  /**
   * Test case name/description.
   * Will be used as the test name in the test runner output.
   */
  n: string

  /**
   * Skip this test case.
   * Provide a string to document why it's skipped.
   */
  skip?: boolean | string

  /**
   * Conditionally skip based on runtime conditions.
   * Function is evaluated when the test would run.
   */
  skipIf?: () => boolean

  /**
   * Run only this test case (and other `only` cases).
   * Useful for debugging specific cases.
   */
  only?: boolean

  /**
   * Tags for categorizing and filtering tests.
   * Can be used by test runners or reporting tools.
   */
  tags?: string[]

  /**
   * Mark as a todo/pending test.
   * String value documents what needs to be implemented.
   */
  todo?: boolean | string
}

/**
 * Test case in object form with input and expected output.
 *
 * The object form is more verbose but provides better readability
 * and access to all case configuration options.
 *
 * @typeParam I - Input type (for functions, this is a tuple of parameters)
 * @typeParam O - Expected output type
 *
 * @example
 * ```ts
 * // Function mode
 * Test.on(add).cases(
 *   { n: 'positive', i: [2, 3], o: 5 },
 *   { n: 'negative', i: [-1, -2], o: -3, tags: ['edge-case'] }
 * )
 *
 * // Generic mode
 * Test.describe()
 *   .i<string>()
 *   .o<boolean>()
 *   .cases(
 *     { n: 'valid', i: 'test@example.com', o: true },
 *     { n: 'invalid', i: 'not-email', o: false }
 *   )
 * ```
 */
export type CaseObject<I, O> =
  | (CaseObjectBase & { i?: I; o?: O })
  | (Omit<CaseObjectBase, 'todo'> & { todo: boolean | string })

/**
 * Test case in tuple form for function testing.
 *
 * The tuple form is more concise and natural for simple test cases.
 * Multiple formats are supported for flexibility.
 *
 * @typeParam I - Tuple of function parameters
 * @typeParam O - Expected return value
 *
 * @example
 * ```ts
 * Test.on(add).cases(
 *   [[2, 3], 5],                    // [args, expected]
 *   ['negative', [-1, -2], -3],     // [name, args, expected]
 *   [[10, 10]],                     // [args] - snapshot test
 *   ['snapshot', [5, 5]]            // [name, args] - named snapshot
 * )
 * ```
 */
export type CaseTuple<I extends any[], O> =
  | [I] // Just input tuple (snapshot test)
  | [string, I] // Name + input tuple (snapshot test)
  | [I, O] // Input tuple + expected output
  | [string, I, O] // Name + input tuple + expected output

/**
 * Combined case type for function mode.
 *
 * Allows both tuple and object formats for maximum flexibility.
 *
 * @typeParam I - Function parameters (must be a tuple)
 * @typeParam O - Expected return value
 */
export type FunctionCase<I, O> = I extends any[] ? (CaseTuple<I, O> | CaseObject<I, O>) : never

/**
 * Extract context type from T (everything except i and o)
 */
type ExtractContext<T> = Omit<T, 'i' | 'o'>

/**
 * Exact type matching - ensures T is exactly U with no extra properties
 */
type Exact<T, U> = T extends U ? U extends T ? T : never : never

/**
 * Tuple cases for generic mode with separate i, o, and context tracking
 * Input is always wrapped in array for tuple form to avoid ambiguity
 */
export type GenericCaseTuple<I, O, Context> = Obj.IsEmpty<Context & object> extends true ?
    | [[I]] // Just input (snapshot) - wrapped
    | [string, [I]] // Name + input (snapshot) - wrapped
    | [[I], O] // Input + output - wrapped
    | [string, [I], O] // Name + input + output - wrapped
  // Has context properties - must include them as last element
  :
    | [[I], O, Context] // Input + output + context - REQUIRED
    | [string, [I], O, Context] // Name + input + output + context - REQUIRED

/**
 * Generic test case for non-.on() mode.
 *
 * Supports both tuple and object forms with optional context properties.
 * Context properties allow passing additional data to test functions.
 *
 * @typeParam I - Input type for the test
 * @typeParam O - Expected output type
 * @typeParam Context - Additional context properties (e.g., environment, dependencies)
 *
 * @example
 * ```ts
 * // Object form with context
 * Test.describe()
 *   .i<string>()
 *   .o<number>()
 *   .context<{ multiplier: number }>()
 *   .cases(
 *     { n: 'with context', i: 'hello', o: 5, multiplier: 1 },
 *     { n: 'doubled', i: 'hi', o: 4, multiplier: 2 }
 *   )
 *
 * // Tuple form (context as last element when required)
 * .cases(
 *   [['hello'], 5, { multiplier: 1 }],
 *   ['doubled', ['hi'], 4, { multiplier: 2 }]
 * )
 * ```
 */
export type GenericCase<I, O, Context> =
  | ({ i: I; o: O } & Context)
  | (CaseObjectBase & { todo: boolean | string })
  | GenericCaseTuple<I, O, Context>

/**
 * Normalizes various case formats into a consistent internal representation.
 *
 * Handles the conversion of tuple and object case formats into a standard
 * form for internal processing. Extracts name, input, output, and context
 * from different case representations.
 *
 * Note: Tuple input is wrapped in array, so we need to unwrap it.
 * Context properties are extracted from the last tuple element when present.
 *
 * @typeParam I - Input type
 * @typeParam O - Output type
 * @typeParam Context - Context properties type
 * @typeParam Case - The actual case being normalized
 *
 * @internal
 */
export type NormalizeGenericCase<I, O, Context, Case> = Obj.IsEmpty<Context & object> extends true // No context expected - parse without context
  ? Case extends [string, [infer _I], infer _O] ? { i: _I; o: _O; n: string }
  : Case extends [[infer _I], infer _O] ? { i: _I; o: _O; n: string }
  : Case extends [string, [infer _I]] ? { i: _I; n: string }
  : Case extends [[infer _I]] ? { i: _I; n: string }
  : Case extends { i: I; o: O } ? Case
  : never
  // Context expected - must be in the tuple with exact type match
  : Case extends [string, [infer _I], infer _O, Context] ? { i: _I; o: _O; n: string } & Context
  : Case extends [[infer _I], infer _O, Context] ? { i: _I; o: _O; n: string } & Context
  : Case extends { i: I; o: O } & Context ? Case
  : never

// ============================================================================
// Base Interfaces for Shared Methods
// ============================================================================

/**
 * Configuration methods for controlling test execution behavior.
 *
 * These methods are available on all builder types and return the same
 * builder type for method chaining. They affect how tests are run but
 * don't change the test data or assertions.
 *
 * @example
 * ```ts
 * Test.on(complexFunction)
 *   .only()              // Focus on these tests
 *   .concurrent()        // Run in parallel
 *   .skip('Broken')      // Actually, skip them
 *   .cases(...)
 * ```
 */
interface ConfigurationMethods<State, SelfKind extends Ts.Kind.Kind> {
  /**
   * Run only this test suite, skipping all others.
   * Useful for focusing on specific tests during development.
   *
   * @returns The same builder for chaining
   *
   * @example
   * ```ts
   * Test.on(myFunction)
   *   .only()  // Only these tests will run
   *   .cases([[1], 1], [[2], 2])
   *   .test()
   * ```
   */
  only(): Ts.Kind.Apply<SelfKind, [State]>

  /**
   * Skip this test suite.
   *
   * @param reason - Optional reason for skipping (shown in test output)
   * @returns The same builder for chaining
   *
   * @example
   * ```ts
   * Test.on(unstableFunction)
   *   .skip('Flaky on CI')
   *   .cases([[1], 1])
   *   .test()
   * ```
   */
  skip(reason?: string): Ts.Kind.Apply<SelfKind, [State]>

  /**
   * Skip tests conditionally based on runtime evaluation.
   *
   * @param condition - Function that returns true to skip tests
   * @returns The same builder for chaining
   *
   * @example
   * ```ts
   * Test.on(platformSpecific)
   *   .skipIf(() => process.platform === 'win32')
   *   .cases([['/usr/bin'], true])
   *   .test()
   * ```
   */
  skipIf(condition: () => boolean): Ts.Kind.Apply<SelfKind, [State]>

  /**
   * Run test cases concurrently for better performance.
   * Only use if tests don't share state or resources.
   *
   * @returns The same builder for chaining
   *
   * @example
   * ```ts
   * Test.on(independentCalculation)
   *   .concurrent()  // Tests run in parallel
   *   .cases(
   *     [[1], 1],
   *     [[2], 4],
   *     [[3], 9]
   *   )
   *   .test()
   * ```
   */
  concurrent(): Ts.Kind.Apply<SelfKind, [State]>

  /**
   * Add tags for test categorization and filtering.
   * Can be used by test runners or reporting tools.
   *
   * @param tags - Array of tag strings
   * @returns The same builder for chaining
   *
   * @example
   * ```ts
   * Test.on(criticalFunction)
   *   .tags(['critical', 'auth'])
   *   .cases([[user], true])
   *   .test()
   * ```
   */
  tags(tags: string[]): Ts.Kind.Apply<SelfKind, [State]>
}

/**
 * Naming methods for test cases.
 */
interface NameableMethods<State, SelfKind extends Ts.Kind.Kind> {
  /**
   * Set a custom name template for test cases.
   * Use $i for input and $o for output in the template.
   */
  name(template: string): Ts.Kind.Apply<SelfKind, [State]>
}

/**
 * Matcher configuration methods.
 */
interface MatcherMethods<State, SelfKind extends Ts.Kind.Kind> {
  /**
   * Use a specific matcher for assertions (e.g., 'toStrictEqual', 'toBe').
   */
  onlyMatching(matcher: string): Ts.Kind.Apply<SelfKind, [State]>
}

/**
 * Test organization methods.
 */
interface TestOrganizationMethods<State, SelfKind extends Ts.Kind.Kind> {
  /**
   * Wrap test cases in a describe block.
   */
  describe(name: string): Ts.Kind.Apply<SelfKind, [State]>
}

/**
 * Case methods for mapped function builders with custom output type.
 */
interface MappedFunctionCaseMethods<Fn extends Fn.AnyAny, MappedInput, SelfKind extends Ts.Kind.Kind, State> {
  /**
   * Add multiple test cases at once with mapped output.
   *
   * Supports both tuple and object formats for maximum flexibility.
   * Output values are transformed using the mapper function provided to `.o()`.
   *
   * @param cases - Array of test cases with mapped output type
   * @returns Builder for method chaining
   *
   * @example
   * ```ts
   * Test.on(createUser)
   *   .o((partial, [name]) => ({ ...defaultUser, name, ...partial }))
   *   .cases(
   *     [['Alice'], { role: 'admin' }],           // Only specify differences
   *     [['Bob'], { role: 'user', age: 30 }],
   *     { n: 'Charlie', i: ['Charlie'], o: { verified: true } }
   *   )
   *   .test()
   * ```
   */
  cases(
    ...cases: Array<
      Fn extends (...args: infer P) => any ? FunctionCase<P, MappedInput>
        : never
    >
  ): Ts.Kind.Apply<SelfKind, [State, Fn, MappedInput]>

  /**
   * Add test cases within a nested describe block with mapped output.
   *
   * Groups related test cases under a describe block for better organization
   * in test output. Multiple calls create separate describe blocks that can
   * be chained together.
   *
   * @param describeName - Name for the describe block in test output
   * @returns A function that accepts cases with mapped output and returns the builder for chaining
   *
   * @example
   * ```ts
   * Test.on(createUser)
   *   .o((partial, [name]) => ({ ...defaultUser, name, ...partial }))
   *   .casesIn('admin users')(
   *     [['Alice'], { role: 'admin' }],
   *     [['Bob'], { role: 'admin', premium: true }]
   *   )
   *   .casesIn('regular users')(
   *     [['Charlie'], { role: 'user' }],
   *     [['David'], { role: 'user', verified: true }]
   *   )
   *   .test()
   * ```
   */
  casesIn(
    describeName: string,
  ): (
    ...cases: Array<
      Fn extends (...args: infer P) => any ? FunctionCase<P, MappedInput>
        : never
    >
  ) => Ts.Kind.Apply<SelfKind, [State, Fn, MappedInput]>

  /**
   * Add a single test case with direct parameter spreading and mapped output.
   *
   * Allows natural function call syntax for specifying test cases.
   * Output values are transformed using the mapper function provided to `.o()`.
   *
   * @param args - Test case parameters (name, inputs, expected output)
   * @returns Builder for method chaining
   *
   * @example
   * ```ts
   * Test.on(createUser)
   *   .o((partial, [name]) => ({ ...defaultUser, name, ...partial }))
   *   .case('Alice', { role: 'admin' })          // createUser('Alice') with partial expectation
   *   .case('Bob', { role: 'user', age: 30 })    // Different partial expectation
   *   .test()
   * ```
   */
  case(
    ...args: Fn extends (...args: infer P) => any ? CaseSingleParams<P, MappedInput>
      : never
  ): Ts.Kind.Apply<SelfKind, [State, Fn, MappedInput]>

  /**
   * Add cases where each case is the arguments tuple directly.
   */
  casesAsArgs(
    ...cases: Fn extends (...args: infer P) => any ? P[]
      : never
  ): Ts.Kind.Apply<SelfKind, [State, Fn, MappedInput]>

  /**
   * Add cases where each case is a single argument (for single-param functions).
   */
  casesAsArg<T>(
    ...cases: Fn extends (arg: T) => any ? T[]
      : never
  ): Ts.Kind.Apply<SelfKind, [State, Fn, MappedInput]>
}

/**
 * Methods for adding test cases in function mode.
 *
 * These methods are available after calling `.on(fn)` and provide
 * various ways to specify test cases for the function being tested.
 *
 * @example
 * ```ts
 * Test.on(add)
 *   .cases(                    // Multiple cases at once
 *     [[1, 2], 3],
 *     [[4, 5], 9]
 *   )
 *   .case(10, 10, 20)         // Single case with spread
 *   .casesAsArgs([1, 1], [2, 2])  // Just arguments
 *   .test()
 * ```
 */
interface FunctionCaseMethods<State extends BuilderTypeState, SelfKind extends Ts.Kind.Kind> {
  /**
   * Add multiple test cases at once.
   *
   * Supports both tuple and object formats for maximum flexibility.
   *
   * @param cases - Array of test cases
   * @returns Builder for method chaining
   *
   * @example
   * ```ts
   * Test.on(multiply)
   *   .cases(
   *     [[2, 3], 6],                              // Tuple format
   *     ['zero case', [0, 5], 0],                 // Named tuple
   *     { n: 'negative', i: [-2, 3], o: -6 },    // Object format
   *     [[10, 10]]                                // Snapshot test
   *   )
   * ```
   */
  cases<const Cases extends readonly any[] = readonly []>(
    ...cases: FnSignature<State> extends [infer P, infer R] ? Array<FunctionCase<P, R>>
      : never
  ): Ts.Kind.Apply<SelfKind, [State]>

  /**
   * Add test cases within a nested describe block.
   *
   * Groups related test cases under a describe block for better organization
   * in test output. Multiple calls create separate describe blocks that can
   * be chained together.
   *
   * @param describeName - Name for the describe block in test output
   * @returns A function that accepts cases and returns the builder for chaining
   *
   * @example
   * ```ts
   * Test.on(calculate)
   *   .casesIn('positive numbers')(
   *     [[1, 2], 3],
   *     [[4, 5], 9],
   *     [[10, 20], 30]
   *   )
   *   .casesIn('negative numbers')(
   *     [[-1, -2], -3],
   *     [[-4, -5], -9]
   *   )
   *   .casesIn('mixed')(
   *     [[1, -1], 0],
   *     [[-2, 2], 0]
   *   )
   *   .test()
   * ```
   */
  casesIn(
    describeName: string,
  ): (
    ...cases: FnSignature<State> extends [infer P, infer R] ? Array<FunctionCase<P, R>>
      : never
  ) => Ts.Kind.Apply<SelfKind, [State]>

  /**
   * Add a single test case with natural argument spreading.
   *
   * The most ergonomic way to add individual test cases.
   *
   * @param args - Arguments and expected output (spreads naturally)
   * @returns Builder for method chaining
   *
   * @example
   * ```ts
   * Test.on(add)
   *   .case(1, 2, 3)                     // add(1, 2) === 3
   *   .case('zero', 0, 0, 0)            // Named: add(0, 0) === 0
   *   .case(10, 10, 20)                 // add(10, 10) === 20
   *   .test()
   * ```
   */
  case(
    ...args: FnSignature<State> extends [infer P, infer R] ? CaseSingleParams<P, R>
      : never
  ): Ts.Kind.Apply<SelfKind, [State]>

  /**
   * Add snapshot test cases (no expected output).
   *
   * Each case is just the function arguments.
   * The actual output will be captured as a snapshot.
   *
   * @param cases - Array of argument tuples
   * @returns Builder for method chaining
   *
   * @example
   * ```ts
   * Test.on(generateHTML)
   *   .casesAsArgs(
   *     ['<div>Hello</div>'],
   *     ['<span>World</span>'],
   *     ['<p>Test</p>']
   *   )
   *   .test()  // Outputs will be snapshot tested
   * ```
   */
  casesAsArgs(
    ...cases: Array<FnParams<State>>
  ): Ts.Kind.Apply<SelfKind, [State]>

  /**
   * Add snapshot tests for single-argument functions.
   *
   * Convenience method when testing functions that take one argument.
   *
   * @param cases - Array of single arguments
   * @returns Builder for method chaining
   *
   * @example
   * ```ts
   * Test.on(capitalize)
   *   .casesAsArg('hello', 'world', 'foo')  // Each becomes [arg]
   *   .test()  // Snapshots: 'Hello', 'World', 'Foo'
   * ```
   */
  casesAsArg<T>(
    ...cases: State['fn'] extends (arg: T) => any ? T[]
      : never
  ): Ts.Kind.Apply<SelfKind, [State]>
}

/**
 * Generic case methods for builders that have already added cases.
 * Shared between TableBuilderWithCases and TableBuilderWithCasesAndLayers.
 */
interface GenericCaseMethodsForExistingCases<State extends BuilderTypeState, SelfKind extends Ts.Kind.Kind> {
  /**
   * Add multiple test cases at once.
   *
   * Supports object format for test cases with input, output, and optional context.
   * Can be chained multiple times to add more cases to the existing set.
   *
   * @param cases - Array of test cases
   * @returns Builder for method chaining
   *
   * @example
   * ```ts
   * Test.describe('validation')
   *   .i<string>()
   *   .o<boolean>()
   *   .cases(
   *     { n: 'valid email', i: 'test@example.com', o: true },
   *     { n: 'invalid email', i: 'not-an-email', o: false }
   *   )
   *   .cases(  // Can chain more cases
   *     { n: 'empty string', i: '', o: false }
   *   )
   *   .test()
   * ```
   */
  cases<const $Context extends object = {}>(
    ...cases: readonly GenericCase<State['i'], State['o'], NoInfer<$Context>>[]
  ): Ts.Kind.Apply<SelfKind, [UpdateState<State, { context: State['context'] & $Context }>]>

  /**
   * Add more test cases within a new describe block.
   *
   * @param describeName - Name for the nested describe block
   * @returns A function that accepts cases and returns a builder
   *
   * @example
   * ```ts
   * Test.describe('validation')
   *   .i<string>()
   *   .o<boolean>()
   *   .casesIn('valid emails')({ n: 'gmail', i: 'test@gmail.com', o: true })
   *   .casesIn('invalid emails')({ n: 'no @', i: 'test.com', o: false })
   * ```
   */
  casesIn<const Context = {}>(
    describeName: string,
  ): (
    ...cases: readonly GenericCase<State['i'], State['o'], NoInfer<Context>>[]
  ) => Ts.Kind.Apply<SelfKind, [UpdateState<State, { context: State['context'] & Context }>]>
}

/**
 * Generic case methods for builders with Effect layers.
 * Used by TableBuilderWithCasesAndLayers.
 */
interface GenericCaseMethodsForExistingCasesWithLayers<State extends BuilderTypeState, R> {
  /**
   * Add multiple test cases at once.
   *
   * Supports object format for test cases with input, output, and optional context.
   * Can be chained multiple times to add more cases to the existing set.
   *
   * @param cases - Array of test cases
   * @returns Builder for method chaining
   */
  cases<const $Context extends object = {}>(
    ...cases: readonly GenericCase<State['i'], State['o'], NoInfer<$Context>>[]
  ): TableBuilderWithCasesAndLayers<UpdateState<State, { context: State['context'] & $Context }>, R>

  /**
   * Add more test cases within a new describe block.
   *
   * @param describeName - Name for the nested describe block
   * @returns A function that accepts cases and returns a builder
   */
  casesIn<const Context = {}>(
    describeName: string,
  ): (
    ...cases: readonly GenericCase<State['i'], State['o'], NoInfer<Context>>[]
  ) => TableBuilderWithCasesAndLayers<UpdateState<State, { context: State['context'] & Context }>, R>
}

/**
 * Layer configuration methods.
 */
interface LayerMethods<State extends BuilderTypeState, NextBuilderKind extends Ts.Kind.Kind> {
  /**
   * Configure a static Effect layer for all test cases.
   */
  layer<R>(layer: Layer.Layer<R>): Ts.Kind.Apply<NextBuilderKind, [State, State['fn'], R]>

  /**
   * Configure a dynamic Effect layer per test case.
   */
  layerEach<R>(
    factory: State['fn'] extends Fn.AnyAny ? (testCase: { i: FnParams<State>; o?: FnReturn<State> }) => Layer.Layer<R>
      : (testCase: { i: State['i']; o: State['o'] } & State['context']) => Layer.Layer<R>,
  ): Ts.Kind.Apply<NextBuilderKind, [State, State['fn'], R]>
}

/**
 * Terminal methods for test execution.
 */
interface TerminalMethods<State extends BuilderTypeState> {
  /**
   * Execute all test cases with default assertions.
   *
   * Uses Effect's equality checking for comparisons.
   * Falls back to Vitest's toEqual for better error messages on failures.
   *
   * @example
   * ```ts
   * Test.on(add)
   *   .cases([[1, 2], 3], [[4, 5], 9])
   *   .test()  // Runs tests with default equality assertions
   * ```
   */
  test(): void

  /**
   * Execute all test cases with a custom test function.
   *
   * Provides full control over assertions and test behavior.
   *
   * @param fn - Custom test function with access to results and context
   *
   * @example
   * ```ts
   * Test.on(divide)
   *   .cases([[10, 2], 5], [[10, 0], Infinity])
   *   .test((result, expected) => {
   *     if (expected === Infinity) {
   *       expect(result).toBe(Infinity)
   *     } else {
   *       expect(result).toBeCloseTo(expected, 2)
   *     }
   *   })
   * ```
   */
  test(
    fn: State['fn'] extends Fn.AnyAny ? FunctionTestFn<State>
      : GenericTestFn<State>,
  ): void
}

/**
 * Effect-based terminal methods.
 */
interface EffectTerminalMethods<State extends BuilderTypeState, R> extends TerminalMethods<State> {
  /**
   * Execute all test cases with Effect-based test functions.
   *
   * Automatically provides configured layers to each test case.
   * Test functions return Effects that are executed with runPromise.
   *
   * @param fn - Effect-returning test function with access to input, output, and context
   *
   * @example
   * ```ts
   * Test.on(fetchUser)
   *   .layer(HttpLayer)
   *   .cases([['user-1'], { id: 'user-1', name: 'Alice' }])
   *   .testEffect((input, expected) =>
   *     Effect.gen(function* () {
   *       const result = yield* fetchUser(...input)
   *       expect(result).toEqual(expected)
   *     })
   *   )
   * ```
   */
  testEffect(
    fn: State['fn'] extends Fn.AnyAny ? FunctionEffectTestFn<State, R>
      : GenericEffectTestFn<State, R>,
  ): void
}

// ============================================================================
// Builder Interfaces
// ============================================================================

/**
 * The initial test table builder created by `describe()`.
 *
 * This builder is the entry point for creating test tables. You can either:
 * - Enter **function mode** with `.on(fn)` to test a specific function
 * - Enter **generic mode** with `.i<T>()` and `.o<T>()` to define custom types
 * - Configure test behavior with methods like `.only()`, `.skip()`, etc.
 *
 * @typeParam State - Internal type state tracking input, output, context, and function types
 *
 * @example
 * ```ts
 * // Function mode - test a specific function
 * Test.describe('math operations')
 *   .on(add)                      // Enter function mode
 *   .cases([[1, 2], 3])          // Add test cases
 *   .test()                       // Execute tests
 *
 * // Generic mode - define custom types
 * Test.describe('validation')
 *   .i<string>()                  // Set input type
 *   .o<boolean>()                 // Set output type
 *   .cases(
 *     { n: 'valid', i: 'test@example.com', o: true }
 *   )
 *   .test((input, output) => {
 *     expect(validate(input)).toBe(output)
 *   })
 * ```
 */
export interface TableBuilderBase<State extends BuilderTypeState>
  extends ConfigurationMethods<State, TableBuilderBaseKind>
{
  /**
   * Set the input type for generic mode testing.
   *
   * @typeParam I - The input type for test cases
   * @returns A new builder with the input type set
   *
   * @example
   * ```ts
   * Test.describe()
   *   .i<{ name: string; age: number }>()  // Input is an object
   *   .o<boolean>()                         // Output is boolean
   *   .cases(
   *     { i: { name: 'Alice', age: 25 }, o: true },
   *     { i: { name: '', age: -1 }, o: false }
   *   )
   * ```
   */
  i<I>(): TableBuilderBase<UpdateState<State, { i: I }>>

  /**
   * Set the output/expected type for generic mode testing.
   *
   * @typeParam O - The expected output type for test cases
   * @returns A new builder with the output type set
   */
  o<O>(): TableBuilderBase<UpdateState<State, { o: O }>>

  /**
   * Enter function mode by specifying a function to test.
   * Types are automatically inferred from the function signature.
   *
   * @param fn - The function to test
   * @returns A {@link TableBuilderWithFunction} for function-specific testing
   *
   * @example
   * ```ts
   * Test.describe('string utils')
   *   .on(capitalize)
   *   .cases(
   *     [['hello'], 'Hello'],
   *     [['world'], 'World']
   *   )
   *   .test()
   * ```
   */
  on<Fn extends Fn.AnyAny>(
    fn: Fn,
  ): TableBuilderWithFunction<UpdateState<State, { i: never; o: never; fn: Fn }>>

  /**
   * Add test cases for generic mode.
   * Cases can include additional context properties beyond `i` and `o`.
   *
   * @param cases - Array of test cases with input, output, and optional context
   * @returns A {@link TableBuilderWithCases} ready for test execution
   *
   * @example
   * ```ts
   * Test.describe()
   *   .i<number>()
   *   .o<string>()
   *   .cases(
   *     { n: 'positive', i: 5, o: 'positive' },
   *     { n: 'negative', i: -3, o: 'negative' },
   *     { n: 'zero', i: 0, o: 'zero', special: true }  // Extra context
   *   )
   * ```
   */
  cases<const $Context extends object = {}>(
    ...cases: readonly GenericCase<State['i'], State['o'], NoInfer<$Context>>[]
  ): TableBuilderWithCases<UpdateState<State, { context: State['context'] & $Context }>>

  /**
   * Add test cases within a nested describe block.
   *
   * Groups related test cases under a describe block for better organization
   * in test output. Multiple calls create separate describe blocks that can
   * be chained together.
   *
   * @param describeName - Name for the describe block in test output
   * @returns A function that accepts cases and returns the builder for chaining
   *
   * @example
   * ```ts
   * Test.describe('math')
   *   .on(calculate)
   *   .casesIn('addition')(
   *     [[1, '+', 2], 3],
   *     [[5, '+', 5], 10],
   *     [[100, '+', 200], 300]
   *   )
   *   .casesIn('subtraction')(
   *     [[10, '-', 5], 5],
   *     [[0, '-', 5], -5]
   *   )
   *   .casesIn('multiplication')(
   *     [[2, '*', 3], 6],
   *     [[4, '*', 4], 16]
   *   )
   *   .test()
   * ```
   */
  casesIn<const Context = {}>(
    describeName: string,
  ): (
    ...cases: readonly GenericCase<State['i'], State['o'], NoInfer<Context>>[]
  ) => TableBuilderWithCases<UpdateState<State, { context: State['context'] & Context }>>

  /**
   * Configure an Effect layer for dependency injection.
   * The layer will be provided to all test cases when using `.testEffect()`.
   *
   * @param layer - The Effect layer to provide
   * @returns A builder with layer support (type becomes specific after cases are added)
   */
  layer<R>(layer: Layer.Layer<R>): any

  /**
   * Configure a dynamic Effect layer that receives test case data.
   * Each test case gets its own layer instance.
   *
   * @param factory - Function that creates a layer based on test case data
   * @returns A builder with layer support (type becomes specific after cases are added)
   */
  layerEach<R>(factory: (testCase: any) => Layer.Layer<R>): any
}

/**
 * Test table builder for function mode, created after calling `.on(fn)`.
 *
 * This builder provides methods specific to testing functions, with automatic
 * type inference from the function signature. Test cases specify function arguments
 * and expected return values.
 *
 * @typeParam State - Internal type state including the function being tested
 *
 * @example
 * ```ts
 * Test.on(add)
 *   .cases(
 *     [[1, 2], 3],         // Test: add(1, 2) === 3
 *     [[-1, 1], 0]         // Test: add(-1, 1) === 0
 *   )
 *   .test()
 *
 * // With configuration
 * Test.on(complexCalculation)
 *   .only()                // Run only these tests
 *   .concurrent()          // Run tests in parallel
 *   .name('calc($i) = $o') // Custom name template
 *   .cases(
 *     [[5, 10], 50],
 *     [[0, 0], 0]
 *   )
 *   .test()
 * ```
 */
export interface TableBuilderWithFunction<State extends BuilderTypeState>
  extends
    ConfigurationMethods<State, TableBuilderWithFunctionKind>,
    NameableMethods<State, TableBuilderWithFunctionKind>,
    MatcherMethods<State, TableBuilderWithFunctionKind>,
    TestOrganizationMethods<State, TableBuilderWithFunctionKind>,
    FunctionCaseMethods<State, TableBuilderWithFunctionKind>,
    LayerMethods<State, TableBuilderWithFunctionAndLayersKind>,
    TerminalMethods<State>
{
  /**
   * Transform expected output values before comparison.
   *
   * This allows you to specify simpler expected values in test cases
   * and transform them into the full expected object. Useful for
   * merging with defaults or building complex expectations from partials.
   *
   * @param mapper - Function that transforms the test case output (receives output and input args)
   * @returns A {@link TableBuilderWithMappedFunction} with transformed output type
   *
   * @example
   * ```ts
   * // Build full expected objects from partial specifications
   * Test.on(createUser)
   *   .o((partial, [name]) => ({
   *     id: expect.any(String),
   *     name,
   *     createdAt: expect.any(Date),
   *     ...defaultUser,
   *     ...partial
   *   }))
   *   .cases(
   *     [['Alice'], { role: 'admin' }],  // Only specify what differs
   *     [['Bob'], { role: 'user' }]
   *   )
   *   .test()
   *
   * // Transform simple values to complex expectations
   * Test.on(parseConfig)
   *   .o((debugValue) => ({
   *     ...defaultConfig,
   *     settings: { ...defaultSettings, debug: debugValue }
   *   }))
   *   .cases(
   *     [['dev.json'], true],     // Simple boolean becomes full config
   *     [['prod.json'], false]
   *   )
   *   .test()
   * ```
   */
  o<MappedInput>(
    mapper: (
      output: MappedInput,
      args: FnParams<State>,
    ) => FnReturn<State>,
  ): TableBuilderWithMappedFunction<
    UpdateState<State, { o: MappedInput }>,
    State['fn'],
    MappedInput
  >
}

/**
 * Builder state after .o() mapper is applied.
 *
 * This variant is created when an output transformation function is provided
 * via the .o() method. The mapper transforms the expected output from test cases
 * before comparison with the actual function result.
 *
 * @typeParam State - Current builder type state
 * @typeParam Fn - The function being tested
 * @typeParam MappedInput - The input type for the mapper (what you specify in test cases)
 *
 * @example
 * ```ts
 * // Testing a function that returns complex objects, but only checking one property
 * Test.on(getUserData)
 *   .o(result => result.name) // Transform output to just the name
 *   .cases(
 *     [['user123'], 'Alice'],  // Now expecting string instead of full user object
 *     [['user456'], 'Bob']
 *   )
 * ```
 *
 * @internal Used internally when .o() is called on a function builder
 */
export interface TableBuilderWithMappedFunction<
  State extends BuilderTypeState,
  Fn extends Fn.AnyAny,
  MappedInput,
> extends
  ConfigurationMethods<State, TableBuilderWithMappedFunctionKind>,
  NameableMethods<State, TableBuilderWithMappedFunctionKind>,
  MatcherMethods<State, TableBuilderWithMappedFunctionKind>,
  TestOrganizationMethods<State, TableBuilderWithMappedFunctionKind>,
  MappedFunctionCaseMethods<Fn, MappedInput, TableBuilderWithMappedFunctionKind, State>
{
  /**
   * Execute all test cases with default assertions.
   *
   * Uses Effect's equality checking for comparisons.
   * Output values are transformed using the mapper function before comparison.
   *
   * @example
   * ```ts
   * Test.on(createUser)
   *   .o((partial, [name]) => ({ ...defaultUser, name, ...partial }))
   *   .cases([['Alice'], { role: 'admin' }])
   *   .test()  // Uses default assertions with mapped output
   * ```
   */
  test(): void

  /**
   * Execute all test cases with a custom test function.
   *
   * Provides full control over assertions and test behavior.
   * Expected values are pre-transformed using the mapper function.
   *
   * @param fn - Test function with access to input, mapped output, context, and Vitest context
   *
   * @example
   * ```ts
   * Test.on(createUser)
   *   .o((partial, [name]) => ({ ...defaultUser, name, ...partial }))
   *   .cases([['Alice'], { role: 'admin' }])
   *   .test((input, mapped, ctx) => {
   *     expect(mapped.name).toBe(input[0])
   *     expect(mapped.role).toBe('admin')
   *   })
   * ```
   */
  test<Ctx = {}>(
    fn: Fn extends (...args: infer P) => any
      ? (i: P, o: MappedInput | undefined, ctx: Ctx, context: TestContext) => void | Promise<void>
      : never,
  ): void
}

/**
 * Builder with function and layers
 */
/**
 * Case methods for function builders with layers (3 type parameters).
 */
interface FunctionCaseMethodsWithLayers<State extends BuilderTypeState, Fn extends Fn.AnyAny, R> {
  /**
   * Add multiple test cases at once.
   *
   * Supports both tuple and object formats for maximum flexibility.
   *
   * @param cases - Array of test cases
   * @returns Builder for method chaining
   *
   * @example
   * ```ts
   * Test.on(multiply)
   *   .layer(TestLayer)
   *   .cases(
   *     [[2, 3], 6],                              // Tuple format
   *     ['zero case', [0, 5], 0],                 // Named tuple
   *     { n: 'negative', i: [-2, 3], o: -6 }     // Object format
   *   )
   *   .testEffect()
   * ```
   */
  cases(
    ...cases: FnSignature<State> extends [infer P, infer Ret] ? Array<FunctionCase<P, Ret>>
      : never
  ): TableBuilderWithFunctionAndLayers<State, Fn, R>

  /**
   * Add test cases within a nested describe block.
   *
   * Groups related test cases under a describe block for better organization
   * in test output. Multiple calls create separate describe blocks that can
   * be chained together.
   *
   * @param describeName - Name for the describe block in test output
   * @returns A function that accepts cases and returns the builder for chaining
   */
  casesIn(
    describeName: string,
  ): (
    ...cases: FnSignature<State> extends [infer P, infer Ret] ? Array<FunctionCase<P, Ret>>
      : never
  ) => TableBuilderWithFunctionAndLayers<State, Fn, R>

  /**
   * Add a single test case with direct parameter spreading.
   *
   * Allows natural function call syntax for specifying test cases.
   *
   * @param args - Test case parameters (name, inputs, expected output)
   * @returns Builder for method chaining
   *
   * @example
   * ```ts
   * Test.on(multiply)
   *   .layer(TestLayer)
   *   .case(2, 3, 6)                     // multiply(2, 3) === 6
   *   .case('zero', 0, 5, 0)            // Named: multiply(0, 5) === 0
   *   .case(-2, 3, -6)                  // multiply(-2, 3) === -6
   *   .testEffect()
   * ```
   */
  case(
    ...args: FnSignature<State> extends [infer P, infer Ret] ? CaseSingleParams<P, Ret>
      : never
  ): TableBuilderWithFunctionAndLayers<State, Fn, R>

  /**
   * Add cases where each case is the arguments tuple directly.
   */
  casesAsArgs(
    ...cases: Array<FnParams<State>>
  ): TableBuilderWithFunctionAndLayers<State, Fn, R>

  /**
   * Add cases where each case is a single argument (for single-param functions).
   */
  casesAsArg<T>(
    ...cases: State['fn'] extends (arg: T) => any ? T[]
      : never
  ): TableBuilderWithFunctionAndLayers<State, Fn, R>
}

/**
 * Builder state for function mode with Effect layers.
 *
 * This variant supports dependency injection via Effect layers,
 * allowing tests to provide runtime dependencies to effectful functions.
 *
 * @typeParam State - Current builder type state
 * @typeParam Fn - The function being tested
 * @typeParam R - Effect requirements (dependencies)
 *
 * @example
 * ```ts
 * // Testing an effectful function that requires dependencies
 * const fetchUser = (id: string) => Effect.gen(function* () {
 *   const db = yield* Database
 *   return yield* db.query(`SELECT * FROM users WHERE id = $1`, [id])
 * })
 *
 * Test.on(fetchUser)
 *   .provide(() => Layer.succeed(Database, mockDb))
 *   .cases(
 *     [['user1'], { name: 'Alice', id: 'user1' }],
 *     [['user2'], { name: 'Bob', id: 'user2' }]
 *   )
 * ```
 *
 * @internal Used when testing effectful functions with dependencies
 */
export interface TableBuilderWithFunctionAndLayers<
  State extends BuilderTypeState,
  Fn extends Fn.AnyAny,
  R,
> extends
  ConfigurationMethods<State, TableBuilderWithFunctionAndLayersKind>,
  NameableMethods<State, TableBuilderWithFunctionAndLayersKind>,
  MatcherMethods<State, TableBuilderWithFunctionAndLayersKind>,
  TestOrganizationMethods<State, TableBuilderWithFunctionAndLayersKind>,
  FunctionCaseMethodsWithLayers<State, Fn, R>,
  EffectTerminalMethods<State, R>
{}

/**
 * Test table builder after cases are provided in generic mode.
 *
 * Created after calling `.cases()` on a builder that has defined types
 * with `.i<T>()` and `.o<T>()`. Ready for test execution.
 *
 * @typeParam T - Type state containing input, output, and context types
 *
 * @example
 * ```ts
 * Test.describe('validation')
 *   .i<string>()
 *   .o<boolean>()
 *   .cases(
 *     { n: 'valid email', i: 'user@example.com', o: true },
 *     { n: 'invalid', i: 'not-email', o: false }
 *   )
 *   .test((input, expected, ctx) => {
 *     const result = validateEmail(input)
 *     expect(result).toBe(expected)
 *   })
 * ```
 */
export interface TableBuilderWithCases<T extends BuilderTypeState>
  extends
    ConfigurationMethods<T, TableBuilderWithCasesKind>,
    NameableMethods<T, TableBuilderWithCasesKind>,
    GenericCaseMethodsForExistingCases<T, TableBuilderWithCasesKind>
{
  /**
   * Configure an Effect layer for dependency injection.
   *
   * @param layer - Static layer provided to all test cases
   * @returns Builder with Effect support via `.testEffect()`
   */
  layer<R>(layer: Layer.Layer<R>): TableBuilderWithCasesAndLayers<T, R>

  /**
   * Configure a dynamic Effect layer per test case.
   *
   * @param factory - Creates a layer for each test case with access to case data
   * @returns Builder with Effect support via `.testEffect()`
   */
  layerEach<R>(
    factory: (testCase: { i: T['i']; o: T['o'] } & T['context']) => Layer.Layer<R>,
  ): TableBuilderWithCasesAndLayers<T, R>

  /**
   * Execute all test cases with a custom test function.
   *
   * Provides full control over assertions and test behavior.
   *
   * @param fn - Test function receiving input, expected output, context, and Vitest context
   */
  test(fn: GenericTestFn<T>): void
}

/**
 * Builder state after cases are added with Effect layers.
 *
 * Final builder state when both test cases and Effect layers have been
 * configured. This state only allows test execution methods.
 *
 * @typeParam T - Current builder type state
 * @typeParam R - Effect requirements (dependencies)
 *
 * @example
 * ```ts
 * Test.describe()
 *   .i<string>()
 *   .o<User>()
 *   .provide(() => TestLayer)
 *   .cases(
 *     { n: 'fetch user', i: 'user1', o: { name: 'Alice' } }
 *   )
 *   .test((input, expected, deps) => {
 *     // Test implementation with dependencies
 *   })
 * ```
 *
 * @internal Final state for effectful test execution
 */
export interface TableBuilderWithCasesAndLayers<T extends BuilderTypeState, R>
  extends
    ConfigurationMethods<T, TableBuilderWithCasesAndLayersKind>,
    NameableMethods<T, TableBuilderWithCasesAndLayersKind>,
    GenericCaseMethodsForExistingCasesWithLayers<T, R>
{
  /**
   * Execute all test cases with Effect-based test functions.
   *
   * Automatically provides configured layers to each test case.
   * Test functions return Effects that are executed with runPromise.
   *
   * @param fn - Effect-returning test function with access to input, output, and context
   */
  testEffect(fn: GenericEffectTestFn<T, R>): void

  /**
   * Execute all test cases with a custom test function.
   *
   * Provides full control over assertions and test behavior.
   *
   * @param fn - Test function receiving input, expected output, context, and Vitest context
   */
  test(fn: GenericTestFn<T>): void
}

// ============================================================================
// Helper Types
// ============================================================================

/**
 * Parameters for the .case() method in different builder modes.
 *
 * Handles the different parameter formats based on whether the builder
 * is in function mode (with .on()) or generic mode. Function mode expects
 * parameters as tuples, while generic mode allows various formats.
 *
 * @typeParam P - Parameter type (tuple for function mode, any for generic)
 * @typeParam R - Return type (for function mode)
 *
 * @example
 * ```ts
 * // Function mode - parameters as tuple
 * Test.on(add)
 *   .case(2, 3, 5)           // Positional args
 *   .case('negative', -1, -2, -3) // Named with positional
 *
 * // Generic mode - flexible formats
 * Test.describe()
 *   .i<string>()
 *   .o<boolean>()
 *   .case('valid', 'test@example.com', true)
 *   .case({ n: 'invalid', i: 'not-email', o: false })
 * ```
 */
export type CaseSingleParams<P, R> = P extends any[] ?
    | [P] // Just params tuple (for .on() mode)
    | [string, P] // Name + params tuple
    | [P, R] // Params tuple + output
    | [string, P, R] // Name + params tuple + output
    | [...P] // Direct params (spread)
    | [string, ...P] // Name + direct params
    | [...P, R] // Direct params + output
    | [string, ...P, R] // Name + direct params + output
    | [CaseObject<P, R>] // Object form
  : never
