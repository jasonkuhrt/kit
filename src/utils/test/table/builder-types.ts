import type { Effect, Layer } from 'effect'
import type { TestContext } from 'vitest'
import type { Fn } from '#fn'
import { Ts } from '#ts'

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
type FnParams<State extends BuilderTypeState> =
  State['fn'] extends (...args: infer P) => any ? P : never

/**
 * Extract function return type from state.
 */
type FnReturn<State extends BuilderTypeState> =
  State['fn'] extends (...args: any[]) => infer R ? R : never

/**
 * Extract both parameters and return type from state.
 */
type FnSignature<State extends BuilderTypeState> =
  State['fn'] extends (...args: infer P) => infer R ? [P, R] : never

/**
 * Extract i, o, and context from state as a tuple.
 */
type StateIOContext<T extends BuilderTypeState> =
  T extends { i: infer I; o: infer O; context: infer Ctx }
    ? [I, O, Ctx]
    : never

/**
 * Test function signature for generic mode (non-.on() mode).
 */
type GenericTestFn<T extends BuilderTypeState> =
  StateIOContext<T> extends [infer I, infer O, infer Ctx]
    ? (i: I, o: O, ctx: Ctx, context: TestContext) => void | Promise<void>
    : never

/**
 * Effect test function signature for generic mode.
 */
type GenericEffectTestFn<T extends BuilderTypeState, R> =
  StateIOContext<T> extends [infer I, infer O, infer Ctx]
    ? (i: I, o: O, ctx: Ctx) => Effect.Effect<void, any, R>
    : never

/**
 * Test function signature for function mode (.on() mode).
 */
type FunctionTestFn<State extends BuilderTypeState> =
  FnSignature<State> extends [infer P, infer R]
    ? (result: R, expected: R | undefined, ctx: State['context'], context: TestContext) => void | Promise<void>
    : never

/**
 * Effect test function signature for function mode.
 */
type FunctionEffectTestFn<State extends BuilderTypeState, R> =
  FnSignature<State> extends [infer P, infer Ret]
    ? (i: P, o: Ret | undefined, ctx: State['context']) => Effect.Effect<void, any, R>
    : never

// ============================================================================
// Case Types
// ============================================================================

/**
 * Base properties for test cases in object form
 */
export interface CaseObjectBase {
  /** Test name */
  n: string
  /** Skip this test case */
  skip?: boolean | string
  /** Conditionally skip this test case */
  skipIf?: () => boolean
  /** Run only this test case */
  only?: boolean
  /** Tags for categorizing tests */
  tags?: string[]
  /** Mark as todo */
  todo?: boolean | string
}

/**
 * Test case in object form with input and output
 */
export type CaseObject<I, O> =
  | (CaseObjectBase & { i?: I; o?: O })
  | (Omit<CaseObjectBase, 'todo'> & { todo: boolean | string })

/**
 * Test case in tuple form for functions with .on()
 * I is always a tuple of function parameters
 */
export type CaseTuple<I extends any[], O> =
  | [I] // Just input tuple (snapshot)
  | [string, I] // Name + input tuple (snapshot)
  | [I, O] // Input tuple + output
  | [string, I, O] // Name + input tuple + output

/**
 * Combined case type for .on() mode
 */
export type FunctionCase<I, O> = I extends any[] ? (CaseTuple<I, O> | CaseObject<I, O>) : never

/**
 * Extract context type from T (everything except i and o)
 */
type ExtractContext<T> = Omit<T, 'i' | 'o'>

/**
 * Helper to check if a type is exactly {}
 */
type IsEmptyObject<T> = keyof T extends never ? true : false

/**
 * Exact type matching - ensures T is exactly U with no extra properties
 */
type Exact<T, U> = T extends U ? U extends T ? T : never : never

/**
 * Tuple cases for generic mode with separate i, o, and context tracking
 * Input is always wrapped in array for tuple form to avoid ambiguity
 */
export type GenericCaseTuple<I, O, Context> = IsEmptyObject<Context> extends true ?
    | [[I]] // Just input (snapshot) - wrapped
    | [string, [I]] // Name + input (snapshot) - wrapped
    | [[I], O] // Input + output - wrapped
    | [string, [I], O] // Name + input + output - wrapped
  // Has context properties - must include them as last element
  :
    | [[I], O, Context] // Input + output + context - REQUIRED
    | [string, [I], O, Context] // Name + input + output + context - REQUIRED

/**
 * Generic test case for non-.on() mode
 */
export type GenericCase<I, O, Context> =
  | ({ i: I; o: O } & Context)
  | (CaseObjectBase & { todo: boolean | string })
  | GenericCaseTuple<I, O, Context>

/**
 * Normalize a generic case to standard object form
 * Converts tuples to objects with i and o properties
 * Note: Tuple input is wrapped in array, so we need to unwrap it
 * Context properties are extracted from the last tuple element when present
 */
export type NormalizeGenericCase<I, O, Context, Case> = IsEmptyObject<Context> extends true // No context expected - parse without context
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
 * Configuration methods shared across multiple builders.
 * These methods control test execution behavior.
 */
interface ConfigurationMethods<State, SelfKind extends Ts.Kind.Kind> {
  /**
   * Mark tests to run exclusively (skips all other tests).
   */
  only(): Ts.Kind.Apply<SelfKind, [State]>

  /**
   * Skip tests with an optional reason.
   */
  skip(reason?: string): Ts.Kind.Apply<SelfKind, [State]>

  /**
   * Conditionally skip tests based on a runtime condition.
   */
  skipIf(condition: () => boolean): Ts.Kind.Apply<SelfKind, [State]>

  /**
   * Run test cases concurrently.
   */
  concurrent(): Ts.Kind.Apply<SelfKind, [State]>

  /**
   * Tag tests for categorization and filtering.
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
   * Add multiple test cases with mapped output.
   */
  cases(
    ...cases: Array<
      Fn extends (...args: infer P) => any ? FunctionCase<P, MappedInput>
        : never
    >
  ): Ts.Kind.Apply<SelfKind, [State, Fn, MappedInput]>

  /**
   * Add cases within a describe block with mapped output.
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
   * Add a single test case with mapped output.
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
 * Case methods for function mode builders.
 */
interface FunctionCaseMethods<State extends BuilderTypeState, SelfKind extends Ts.Kind.Kind> {
  /**
   * Add multiple test cases at once.
   */
  cases<const Cases extends readonly any[] = readonly []>(
    ...cases: FnSignature<State> extends [infer P, infer R] ? Array<FunctionCase<P, R>>
      : never
  ): Ts.Kind.Apply<SelfKind, [State]>

  /**
   * Add cases within a describe block.
   */
  casesIn(
    describeName: string,
  ): (
    ...cases: FnSignature<State> extends [infer P, infer R] ? Array<FunctionCase<P, R>>
      : never
  ) => Ts.Kind.Apply<SelfKind, [State]>

  /**
   * Add a single test case.
   */
  case(
    ...args: FnSignature<State> extends [infer P, infer R] ? CaseSingleParams<P, R>
      : never
  ): Ts.Kind.Apply<SelfKind, [State]>

  /**
   * Add cases where each case is the arguments tuple directly.
   */
  casesAsArgs(
    ...cases: Array<FnParams<State>>
  ): Ts.Kind.Apply<SelfKind, [State]>

  /**
   * Add cases where each case is a single argument (for single-param functions).
   */
  casesAsArg<T>(
    ...cases: State['fn'] extends (arg: T) => any ? T[]
      : never
  ): Ts.Kind.Apply<SelfKind, [State]>
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
    factory: State['fn'] extends Fn.AnyAny
      ? (testCase: { i: FnParams<State>; o?: FnReturn<State> }) => Layer.Layer<R>
      : (testCase: { i: State['i']; o: State['o'] } & State['context']) => Layer.Layer<R>
  ): Ts.Kind.Apply<NextBuilderKind, [State, State['fn'], R]>
}

/**
 * Terminal methods for test execution.
 */
interface TerminalMethods<State extends BuilderTypeState> {
  /**
   * Execute tests with default assertions.
   */
  test(): void

  /**
   * Execute tests with a custom test function.
   */
  test(
    fn: State['fn'] extends Fn.AnyAny
      ? FunctionTestFn<State>
      : GenericTestFn<State>
  ): void
}

/**
 * Effect-based terminal methods.
 */
interface EffectTerminalMethods<State extends BuilderTypeState, R> extends TerminalMethods<State> {
  /**
   * Execute tests with Effect-based test functions.
   */
  testEffect(
    fn: State['fn'] extends Fn.AnyAny
      ? FunctionEffectTestFn<State, R>
      : GenericEffectTestFn<State, R>
  ): void
}

// ============================================================================
// Builder Interfaces
// ============================================================================

/**
 * Base table builder before cases are provided
 * State extends BuilderTypeState to track i, o, context, and fn types
 */
export interface TableBuilderBase<State extends BuilderTypeState> extends
  ConfigurationMethods<State, TableBuilderBaseKind> {

  // Type building
  i<I>(): TableBuilderBase<UpdateState<State, { i: I }>>
  o<O>(): TableBuilderBase<UpdateState<State, { o: O }>>

  // Function testing
  on<Fn extends Fn.AnyAny>(
    fn: Fn,
  ): TableBuilderWithFunction<UpdateState<State, { i: never; o: never; fn: Fn }>>

  // Cases
  cases<const $Context extends object = {}>(
    ...cases: readonly GenericCase<State['i'], State['o'], NoInfer<$Context>>[]
  ): TableBuilderWithCases<UpdateState<State, { context: State['context'] & $Context }>>

  // Shorthand for describe + cases
  casesIn<const Context = {}>(
    describeName: string,
  ): (
    ...cases: readonly GenericCase<State['i'], State['o'], NoInfer<Context>>[]
  ) => TableBuilderWithCases<UpdateState<State, { context: State['context'] & Context }>>

  // Layer methods (untyped until cases are provided)
  layer<R>(layer: Layer.Layer<R>): any
  layerEach<R>(factory: (testCase: any) => Layer.Layer<R>): any
}

/**
 * Builder after .on() is called
 * State tracks the function being tested in State['fn']
 */
export interface TableBuilderWithFunction<State extends BuilderTypeState> extends
  ConfigurationMethods<State, TableBuilderWithFunctionKind>,
  NameableMethods<State, TableBuilderWithFunctionKind>,
  MatcherMethods<State, TableBuilderWithFunctionKind>,
  TestOrganizationMethods<State, TableBuilderWithFunctionKind>,
  FunctionCaseMethods<State, TableBuilderWithFunctionKind>,
  LayerMethods<State, TableBuilderWithFunctionAndLayersKind>,
  TerminalMethods<State> {

  // Output transformation - returns a new builder with mapped output type
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
 * Builder after .o() mapper is applied - changes expected output type
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
  MappedFunctionCaseMethods<Fn, MappedInput, TableBuilderWithMappedFunctionKind, State> {

  // Terminal - execute tests
  test(): void
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
   */
  cases(
    ...cases: FnSignature<State> extends [infer P, infer Ret] ? Array<FunctionCase<P, Ret>>
      : never
  ): TableBuilderWithFunctionAndLayers<State, Fn, R>

  /**
   * Add cases within a describe block.
   */
  casesIn(
    describeName: string,
  ): (
    ...cases: FnSignature<State> extends [infer P, infer Ret] ? Array<FunctionCase<P, Ret>>
      : never
  ) => TableBuilderWithFunctionAndLayers<State, Fn, R>

  /**
   * Add a single test case.
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
  EffectTerminalMethods<State, R> {}

/**
 * Builder after cases are provided (non-.on() mode)
 * T extends BuilderTypeState to maintain type-level state
 */
export interface TableBuilderWithCases<T extends BuilderTypeState> extends
  ConfigurationMethods<T, TableBuilderWithCasesKind>,
  NameableMethods<T, TableBuilderWithCasesKind> {

  // Layers
  layer<R>(layer: Layer.Layer<R>): TableBuilderWithCasesAndLayers<T, R>
  layerEach<R>(
    factory: (testCase: { i: T['i']; o: T['o'] } & T['context']) => Layer.Layer<R>,
  ): TableBuilderWithCasesAndLayers<T, R>

  // Terminal
  test(fn: GenericTestFn<T>): void
}

/**
 * Builder with cases and layers
 */
export interface TableBuilderWithCasesAndLayers<T extends BuilderTypeState, R> extends
  ConfigurationMethods<T, TableBuilderWithCasesAndLayersKind>,
  NameableMethods<T, TableBuilderWithCasesAndLayersKind> {

  // Terminal methods
  testEffect(fn: GenericEffectTestFn<T, R>): void
  test(fn: GenericTestFn<T>): void
}

// ============================================================================
// Helper Types
// ============================================================================

/**
 * Parameters for .case() method - supports direct params or object
 * When using .on(), params are passed as tuple [params]
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
