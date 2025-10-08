import type { Arr } from '#arr'
import type { Fn } from '#fn'
import type { Obj } from '#obj'
import type { Rec } from '#rec'
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
  input: unknown
  output: unknown
  context: {}
  fn: Fn.AnyAny | undefined // The function being tested (undefined if not in .on() mode)
  matrix: {} // Matrix configuration type (empty object when no matrix)
}

export interface BuilderTypeStateEmpty extends BuilderTypeState {
  input: never
  output: never
  context: {}
  matrix: {}
  fn: undefined
}

// ============================================================================
// Helper Types for State and Function Operations
// ============================================================================

/**
 * Helper to update state with partial updates.
 * Preserves existing state values when updates are not provided.
 */
export type UpdateState<State extends BuilderTypeState, Updates extends Partial<BuilderTypeState>> = {
  input: 'input' extends keyof Updates ? Updates['input'] : State['input']
  output: 'output' extends keyof Updates ? Updates['output'] : State['output']
  context: 'context' extends keyof Updates ? Updates['context'] : State['context']
  fn: 'fn' extends keyof Updates ? Updates['fn'] : State['fn']
  matrix: 'matrix' extends keyof Updates ? Updates['matrix'] : State['matrix']
}

/**
 * Extract function parameters from state.
 */
type FnParams<State extends BuilderTypeState> = State['fn'] extends Fn.AnyAny ? Parameters<State['fn']>
  : never

/**
 * Extract function return type from state.
 */
type FnReturn<State extends BuilderTypeState> = State['fn'] extends Fn.AnyAny ? ReturnType<State['fn']>
  : never

/**
 * Get effective input type - uses override if set, otherwise function params.
 * Uses [T] extends [never] trick to properly detect never type.
 */
type EffectiveInput<State extends BuilderTypeState> = [State['input']] extends [never] ? FnParams<State>
  : State['input']

/**
 * Get effective output type - uses override if set, otherwise function return.
 */
type EffectiveOutput<State extends BuilderTypeState> = [State['output']] extends [never] ? FnReturn<State>
  : State['output']

/**
 * Extract both parameters and return type from state.
 */
type FnSignature<State extends BuilderTypeState> = State['fn'] extends Fn.AnyAny
  ? [Parameters<State['fn']>, ReturnType<State['fn']>]
  : never

/**
 * Extract input, output, and context from state as a tuple.
 */
type StateIOContext<T extends BuilderTypeState> = T extends { input: infer I; output: infer O; context: infer Ctx }
  ? [I, O, Ctx]
  : never

/**
 * Add matrix to params if it exists (non-empty object).
 */
type WithMatrix<Params, Matrix> = Obj.IsEmpty<Matrix & object> extends true ? Params
  : Params & { matrix: Matrix }

/**
 * Test function signature for generic mode (non-.on() mode).
 * Receives destructured params with input, output, test name, setup context, and vitest TestContext.
 * Can return a value for auto-snapshot or void/undefined to skip snapshot.
 */
type GenericTestFn<T extends BuilderTypeState> = StateIOContext<T> extends [infer I, infer O, infer Ctx] ? (
    params: WithMatrix<{ input: I; output: O; n: string } & Ctx & TestContext, T['matrix']>,
  ) => unknown | Promise<unknown>
  : never

/**
 * Effect test function signature for generic mode.
 * Receives destructured params with input, output, and user context.
 */
type GenericEffectTestFn<T extends BuilderTypeState, R> = StateIOContext<T> extends [infer I, infer O, infer Ctx]
  ? (params: WithMatrix<{ input: I; output: O; n: string } & Ctx, T['matrix']>) => Effect.Effect<void, any, R>
  : never

/**
 * Test function signature for function mode (.on() mode).
 * Receives destructured params with input, result, expected output, test name, setup context, and vitest TestContext.
 * Can return a value for auto-snapshot or void/undefined to skip snapshot.
 */
type FunctionTestFn<State extends BuilderTypeState> = FnSignature<State> extends [infer P, infer R] ? (
    params: { input: P; output: R | undefined; result: R; n: string } & State['context'] & TestContext,
  ) => unknown | Promise<unknown>
  : never

/**
 * Effect test function signature for function mode.
 * Receives destructured params with input, result, expected output, test name, and user context.
 */
type FunctionEffectTestFn<State extends BuilderTypeState, R> = FnSignature<State> extends [infer P, infer Ret] ? (
    params: { input: P; output: Ret | undefined; result: Ret; n: string } & State['context'],
  ) => Effect.Effect<void, any, R>
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
 *   { input: [1, 2], output: 3 },
 *   { input: [2, 2], output: 4, skip: 'Flaky on CI' },
 *   { todo: 'Implement negative number handling' },
 *   { input: [5, 5], output: 10, only: true, comment: 'focus on this' }
 * )
 * ```
 */
export interface CaseObjectBase {
  /**
   * Test case name/description (optional).
   * Will be used as the test name in the test runner output.
   * Only use for exceptionally tricky or unclear test cases.
   */
  comment?: string

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
 * @example
 * ```ts
 * // Function mode
 * Test.on(add).cases(
 *   { input: [2, 3], output: 5 },
 *   { input: [-1, -2], output: -3, tags: ['edge-case'] }
 * )
 *
 * // Generic mode
 * Test.describe()
 *   .inputType<string>()
 *   .outputType<boolean>()
 *   .cases(
 *     { input: 'test@example.com', output: true },
 *     { input: 'not-email', output: false }
 *   )
 * ```
 */
export type CaseObject<I, O> =
  | (CaseObjectBase & { input?: I; output?: O })
  | (Omit<CaseObjectBase, 'todo'> & { todo: boolean | string })

/**
 * Test case in tuple form for function testing.
 *
 * The tuple form is concise and natural for simple test cases.
 * Input is ALWAYS the first element.
 *
 * @example
 * ```ts
 * Test.on(add).cases(
 *   [[2, 3], 5],      // [input, output]
 *   [[-1, -2], -3],   // [input, output]
 *   [[10, 10]]        // [input] - snapshot test
 * )
 * ```
 */
export type CaseTuple<I extends any[], O, Context = {}> =
  // Context is optional (either {} or has no required keys)
  | [I] // Wrapped tuple
  | (I extends [infer Single] ? [Single] : never) // Unwrapped scalar (unary)
  | [I, O] // Wrapped tuple + output
  | (I extends [infer Single] ? [Single, O] : never) // Unwrapped scalar + output (unary)
  | [I, O, Context] // Wrapped tuple + output + context (always optional)
  | (I extends [infer Single] ? [Single, O, Context] : never) // Unwrapped scalar + output + context (unary)

/**
 * Combined case type for function mode.
 *
 * Allows both tuple and object formats for maximum flexibility.
 */
export type FunctionCase<I, O, Context = {}> = I extends any[] ? (CaseTuple<I, O, Context> | CaseObject<I, O>)
  : never

/**
 * Tuple cases for generic mode with separate input, output, and context tracking.
 * Input is 1:1 with inputType - NO automatic wrapping.
 */
export type GenericCaseTuple<I, O, Context> = Obj.IsEmpty<Context & object> extends true
  // Empty context - no context variants
  ?
    | [I] // Just input (snapshot)
    | [I, O] // Input + output
  : Obj.HasRequiredKeys<Context & object> extends false
  // Context with only optional keys - context is optional
    ?
      | [I] // Just input (snapshot)
      | [I, O] // Input + output
      | [I, O, Context] // Input + output + context - OPTIONAL
  // Context has required keys - context is required
  : [I, O, Context] // Input + output + context - REQUIRED

/**
 * Generic test case for non-.on() mode.
 *
 * Supports both tuple and object forms with optional context properties.
 * Context properties allow passing additional data to test functions.
 */
export type GenericCase<I, O, Context> =
  | ({ input: I; output: O } & Context)
  | (CaseObjectBase & { todo: boolean | string })
  | GenericCaseTuple<I, O, Context>
  | ((context: Context) =>
    | { input: I; output?: O }
    | (CaseObjectBase & { todo: boolean | string })
    | [I]
    | [I, O])

/**
 * Parameters for the .case() method in different builder modes.
 *
 * Handles the different parameter formats based on whether the builder
 * is in function mode (with .on()) or generic mode.
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

/**
 * Parameters for the .case() method in generic mode.
 * Extends GenericCaseTuple with optional string name prefix.
 */
export type GenericCaseSingleParams<I, O, Context> =
  | GenericCaseTuple<I, O, Context>
  | (GenericCaseTuple<I, O, Context> extends infer T ? T extends [infer A] ? [string, A]
    : T extends [infer A, infer B] ? [string, A, B]
    : T extends [infer A, infer B, infer C] ? [string, A, B, C]
    : never
    : never)

// ============================================================================
// Main Builder Interface
// ============================================================================

/**
 * The main test table builder interface.
 *
 * This unified builder supports both function mode (via `.on(fn)`) and generic mode (via `.inputType()` / `.outputType()`).
 * Method availability and return types are controlled via conditional types based on the current state.
 *
 * @example
 * **Function mode** - test a specific function:
 * ```ts
 * Test.describe('math operations')
 *   .on(add)
 *   .cases([[1, 2], 3])
 *   .test()
 * ```
 *
 * @example
 * **Generic mode** - define custom types:
 * ```ts
 * Test.describe('validation')
 *   .inputType<string>()
 *   .outputType<boolean>()
 *   .cases(
 *     ['test@example.com', true],
 *     ['invalid', false]
 *   )
 *   .test(({ input, output }) => {
 *     expect(validate(input)).toBe(output)
 *   })
 * ```
 */
export interface TestBuilder<State extends BuilderTypeState> {
  // ============================================================================
  // Configuration Methods (always available)
  // ============================================================================

  /**
   * Run only this test suite, skipping all others.
   * Useful for focusing on specific tests during development.
   */
  only(): TestBuilder<State>

  /**
   * Skip this test suite.
   * @param reason - Optional reason for skipping (shown in test output)
   */
  skip(reason?: string): TestBuilder<State>

  /**
   * Skip tests conditionally based on runtime evaluation.
   * @param condition - Function that returns true to skip tests
   */
  skipIf(condition: () => boolean): TestBuilder<State>

  /**
   * Run test cases concurrently for better performance.
   * Only use if tests don't share state or resources.
   */
  concurrent(): TestBuilder<State>

  /**
   * Add tags for test categorization and filtering.
   * Can be used by test runners or reporting tools.
   * @param tags - Array of tag strings
   */
  tags(tags: string[]): TestBuilder<State>

  /**
   * Set a custom name template for test cases.
   * Use $i for input and $o for output in the template.
   */
  name(template: string): TestBuilder<State>

  /**
   * Use a specific matcher for assertions (e.g., 'toStrictEqual', 'toBe').
   */
  onlyMatching(matcher: string): TestBuilder<State>

  // ============================================================================
  // Type Setup Methods
  // ============================================================================

  /**
   * Set the input type explicitly.
   * Works in both generic mode and function mode (overrides inferred params).
   *
   * @example
   * ```ts
   * // Generic mode - when not using .on()
   * Test.describe('concatenate')
   *   .inputType<string>()
   *   .outputType<string>()
   *   .cases(
   *     ['hello', 'hello'],
   *     ['world', 'world']
   *   )
   *   .test(({ input, output }) => {
   *     expect(input).toBe(output)
   *   })
   * ```
   */
  inputType<I>(): TestBuilder<UpdateState<State, { input: I }>>

  /**
   * Set the output/expected type for generic mode testing.
   * Only available before `.on()` is called.
   */
  outputType<O>(): State['fn'] extends undefined ? TestBuilder<UpdateState<State, { output: O }>>
    : never

  /**
   * Set the context type for test cases.
   * Context properties are additional fields beyond `input` and `output`.
   */
  contextType<Ctx extends {} = {}>(): TestBuilder<UpdateState<State, { context: Ctx }>>

  /**
   * Run all test cases for each combination of matrix values.
   *
   * Creates a cartesian product of all provided value arrays and runs
   * every test case once for each combination. The current combination
   * is passed as `matrix` in the test context.
   *
   * @example
   * ```ts
   * Test.describe('feature')
   *   .matrix({
   *     mode: ['strict', 'loose'],
   *     cache: [true, false],
   *   })
   *   .cases([input1], [input2])
   *   .test(({ input, matrix }) => {
   *     // Runs 4 times (2 modes × 2 cache values)
   *     // matrix = { mode: 'strict'|'loose', cache: true|false }
   *   })
   * ```
   */
  matrix<$values extends Rec.AnyReadonlyKeyTo<Arr.Any>>(
    values: $values,
  ): TestBuilder<
    UpdateState<
      State,
      {
        matrix: { [K in keyof $values]: $values[K][number] }
      }
    >
  >

  /**
   * Provide default expected output for runner cases in generic mode.
   *
   * @param provider - Function that receives context and returns default expected output
   */
  outputDefault<R>(
    provider: State['output'] extends undefined ? (context: State['context']) => R
      : (context: State['context']) => State['output'],
  ): State['output'] extends undefined ? TestBuilder<UpdateState<State, { output: R }>>
    : TestBuilder<State>

  /**
   * Set a custom snapshot serializer for formatting snapshot output.
   *
   * By default, snapshots use a smart serializer. Custom serializers receive
   * the value to serialize and the test context, allowing context-aware formatting.
   *
   * @param serializer - Function that takes (output, context) and returns formatted string
   */
  snapshotSerializer(
    serializer: (
      output: any,
      context: { i: State['input']; n: string; o: State['output'] } & State['context'],
    ) => string,
  ): TestBuilder<State>

  // ============================================================================
  // Function Mode Methods
  // ============================================================================

  /**
   * Enter function mode by specifying a function to test.
   * Types are automatically inferred from the function signature.
   *
   * @param fn - The function to test
   */
  on<Fn extends Fn.AnyAny>(
    fn: Fn,
  ): TestBuilder<UpdateState<State, { input: never; output: never; fn: Fn }>>

  /**
   * Transform expected output values before comparison.
   * Only available in function mode (after `.on()`).
   *
   * This allows you to specify simpler expected values in test cases
   * and transform them into the full expected object.
   *
   * @param mapper - Function that transforms the test case output
   */
  onOutput<MappedInput>(
    mapper: State['fn'] extends undefined ? never
      : State['fn'] extends Fn.AnyAny ? (
          output: MappedInput,
          context: { i: EffectiveInput<State>; n: string; o: MappedInput } & State['context'],
        ) => EffectiveOutput<State>
      : never,
  ): State['fn'] extends undefined ? never
    : State['fn'] extends Fn.AnyAny ? TestBuilder<UpdateState<State, { output: MappedInput }>>
    : never

  // ============================================================================
  // Case Methods
  // ============================================================================

  /**
   * Add multiple test cases at once.
   *
   * Supports both tuple and object formats for maximum flexibility.
   * Cases can be static or functions when using `.onSetup()`.
   *
   * @param cases - Array of test cases (static or function-based)
   */
  cases<const Cases extends readonly any[] = readonly []>(
    ...cases: State['fn'] extends undefined ? Array<GenericCase<State['input'], State['output'], State['context']>>
      : State['fn'] extends Fn.AnyAny ? Array<
          | FunctionCase<
            EffectiveInput<State>,
            EffectiveOutput<State>,
            State['context']
          >
          | ((ctx: State['context']) => FunctionCase<
            EffectiveInput<State>,
            EffectiveOutput<State>,
            State['context']
          >)
        >
      : Array<GenericCase<State['input'], State['output'], State['context']>>
  ): TestBuilder<State>

  /**
   * Add a single test case with natural argument spreading.
   *
   * @param args - Arguments and expected output (spreads naturally)
   */
  case(
    ...args: State['fn'] extends undefined ? GenericCaseSingleParams<State['input'], State['output'], State['context']>
      : State['fn'] extends Fn.AnyAny ? CaseSingleParams<EffectiveInput<State>, EffectiveOutput<State>>
      : never
  ): TestBuilder<State>

  /**
   * Add a single test case (runner pattern).
   * Only available in generic mode.
   *
   * @param name - Test case name
   * @param runner - Runner function that receives context
   */
  case(name: string, runner: (context: State['context']) => any): TestBuilder<State>

  /**
   * Add a single test case in object form.
   * Only available in generic mode.
   *
   * @param caseObj - Test case object with input, output, and optional context
   */
  case$(caseObj: GenericCase<State['input'], State['output'], State['context']>): TestBuilder<State>

  /**
   * Create a nested describe block with direct cases array.
   *
   * @param name - Name for the describe block
   * @param cases - Array of test cases
   */
  describe(
    name: string,
    cases: readonly (State['fn'] extends undefined ? GenericCase<State['input'], State['output'], State['context']>
      : State['fn'] extends Fn.AnyAny ? FunctionCase<
          EffectiveInput<State>,
          EffectiveOutput<State>,
          State['context']
        >
      : GenericCase<State['input'], State['output'], State['context']>)[],
  ): TestBuilder<State>

  /**
   * Create a nested describe block with a callback that builds child test cases.
   *
   * The child builder inherits parent's setup context, default output provider,
   * output mapper, and type declarations.
   *
   * **Nested Describe Syntax**: Use ` > ` separator in the name to create multiple
   * levels of nested describe blocks automatically. For example:
   * - `'Parent > Child'` creates `describe('Parent', () => describe('Child', ...))`
   * - Multiple tests with the same prefix share the outer describe blocks
   * - Supports any depth: `'API > Users > Create'` creates three levels
   *
   * @param name - Name for the nested describe block. Supports ` > ` separator for multi-level nesting.
   * @param callback - Function that receives child builder and returns it with cases
   *
   * @example
   * ```ts
   * Test.describe('Transform > String', (t) => t
   *   .inputType<string>()
   *   .outputType<string>()
   *   .cases(['hello', 'HELLO'])
   * ).test(({ input, output }) => {
   *   expect(input.toUpperCase()).toBe(output)
   * })
   *
   * Test.describe('Transform > Number', (t) => t
   *   .inputType<number>()
   *   .outputType<number>()
   *   .cases([42, 42])
   * ).test(({ input, output }) => {
   *   expect(input).toBe(output)
   * })
   * // Results in shared 'Transform' describe block with 'String' and 'Number' nested inside
   * ```
   */
  describe<ChildContext extends object = {}, ChildI = State['input'], ChildO = State['output']>(
    name: string,
    callback: (
      builder: TestBuilder<State>,
    ) => TestBuilder<{
      context: ChildContext
      input: ChildI
      output: ChildO
      fn: State['fn']
      matrix: State['matrix']
    }>,
  ): TestBuilder<
    UpdateState<State, {
      context: Omit<State['context'], keyof ChildContext> & ChildContext
      input: State['input'] | ChildI
      output: State['output'] | ChildO
    }>
  >

  // ============================================================================
  // Setup Methods
  // ============================================================================

  /**
   * Provide setup context that will be passed to function-based cases.
   *
   * @param factory - Function that returns context object
   */
  onSetup<Ctx extends object>(
    factory: () => Ctx,
  ): TestBuilder<UpdateState<State, { context: State['context'] & Ctx }>>

  // ============================================================================
  // Effect Layer Methods
  // ============================================================================

  /**
   * Configure a static Effect layer for all test cases.
   * @param layer - The Effect layer to provide
   */
  layer<R>(layer: Layer.Layer<R>): TestBuilderWithLayers<State, R>

  /**
   * Configure a dynamic Effect layer per test case.
   * @param factory - Function that creates a layer based on test case data
   */
  layerEach<R>(
    factory: State['fn'] extends undefined
      ? (testCase: { i: State['input']; o: State['output'] } & State['context']) => Layer.Layer<R>
      : State['fn'] extends Fn.AnyAny
        ? (testCase: { i: EffectiveInput<State>; o?: EffectiveOutput<State> }) => Layer.Layer<R>
      : (testCase: { i: State['input']; o: State['output'] } & State['context']) => Layer.Layer<R>,
  ): TestBuilderWithLayers<State, R>

  // ============================================================================
  // Terminal Methods
  // ============================================================================

  /**
   * Execute all test cases with default assertions.
   * Uses Effect's equality checking for comparisons.
   */
  test(): void

  /**
   * Execute all test cases with a custom test function.
   * Provides full control over assertions and test behavior.
   *
   * **Auto-Snapshot**: If the test function returns a value (not undefined),
   * that value is automatically captured in a snapshot for regression testing.
   * Return `undefined` (or nothing) to skip snapshot creation.
   *
   * @param fn - Custom test function with access to results and context
   *
   * @example
   * ```ts
   * // Return a value for auto-snapshot
   * Test.on(transform).cases([[input], expected])
   *   .test(({ result }) => {
   *     return result // Snapshots the result
   *   })
   *
   * // Return nothing to skip snapshot
   * Test.on(add).cases([[1, 2], 3])
   *   .test(({ result, output }) => {
   *     expect(result).toBe(output) // No return = no snapshot
   *   })
   * ```
   */
  test(
    fn: State['fn'] extends undefined ? GenericTestFn<State>
      : State['fn'] extends Fn.AnyAny ? FunctionTestFn<State>
      : GenericTestFn<State>,
  ): void
}

export type TestBuilderEmpty = TestBuilder<BuilderTypeStateEmpty>

// ============================================================================
// Effect Builder Interface
// ============================================================================

/**
 * Test builder with Effect layer support.
 *
 * This extends the main builder with Effect-specific test execution methods.
 * Created after calling `.layer()` or `.layerEach()`.
 */
export interface TestBuilderWithLayers<State extends BuilderTypeState, R> extends TestBuilder<State> {
  /**
   * Execute all test cases with Effect-based test functions.
   *
   * Automatically provides configured layers to each test case.
   * Test functions return Effects that are executed with runPromise.
   *
   * @param fn - Effect-returning test function with access to input, output, and context
   */
  testEffect(
    fn: State['fn'] extends undefined ? GenericEffectTestFn<State, R>
      : State['fn'] extends Fn.AnyAny ? FunctionEffectTestFn<State, R>
      : GenericEffectTestFn<State, R>,
  ): void
}
