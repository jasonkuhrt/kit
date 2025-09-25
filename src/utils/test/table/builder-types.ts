import type { Effect, Layer } from 'effect'
import type { TestContext } from 'vitest'

// ============================================================================
// Core Types
// ============================================================================

/**
 * Type-level state for the builder.
 * Tracks what types have been set via builder methods.
 */
import type { Fn } from '#fn'

export interface BuilderTypeState {
  i: unknown
  o: unknown
  context: {}
  fn: Fn.AnyAny // The function being tested (never if not in .on() mode)
}

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
export type FunctionCase<I extends any[], O> = CaseTuple<I, O> | CaseObject<I, O>

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
// Builder Interfaces
// ============================================================================

/**
 * Base table builder before cases are provided
 * State extends BuilderTypeState to track i, o, context, and fn types
 */
export interface TableBuilderBase<State extends BuilderTypeState> {
  // Type building
  i<I>(): TableBuilderBase<{ i: I; o: State['o']; context: State['context']; fn: State['fn'] }>
  o<O>(): TableBuilderBase<{ i: State['i']; o: O; context: State['context']; fn: State['fn'] }>

  // Function testing
  on<Fn extends Fn.AnyAny>(
    fn: Fn,
  ): TableBuilderWithFunction<{ i: never; o: never; context: State['context']; fn: Fn }>

  // Cases
  cases<const $Context extends object = {}>(
    ...cases: readonly GenericCase<State['i'], State['o'], NoInfer<$Context>>[]
  ): TableBuilderWithCases<{ i: State['i']; o: State['o']; context: State['context'] & $Context; fn: State['fn'] }>

  // Shorthand for describe + cases
  casesIn<const Context = {}>(
    describeName: string,
  ): (
    ...cases: readonly GenericCase<State['i'], State['o'], NoInfer<Context>>[]
  ) => TableBuilderWithCases<{ i: State['i']; o: State['o']; context: State['context'] & Context; fn: State['fn'] }>

  // Configuration methods (available on base)
  only(): TableBuilderBase<State>
  skip(reason?: string): TableBuilderBase<State>
  skipIf(condition: () => boolean): TableBuilderBase<State>
  concurrent(): TableBuilderBase<State>
  layer<R>(layer: Layer.Layer<R>): any // Will be properly typed after cases
  layerEach<R>(factory: (testCase: any) => Layer.Layer<R>): any // Will be properly typed after cases
}

/**
 * Builder after .on() is called
 * State tracks the function being tested in State['fn']
 */
export interface TableBuilderWithFunction<State extends BuilderTypeState> {
  // Extract parameter and return types from function
  cases<const Cases extends readonly any[] = readonly []>(
    ...cases: State['fn'] extends (...args: infer P) => infer R ? Array<FunctionCase<P, R>>
      : never
  ): TableBuilderWithFunction<State>

  casesIn(
    describeName: string,
  ): (
    ...cases: State['fn'] extends (...args: infer P) => infer R ? Array<FunctionCase<P, R>>
      : never
  ) => TableBuilderWithFunction<State>

  case(
    ...args: State['fn'] extends (...args: infer P) => infer R ? CaseSingleParams<P, R>
      : never
  ): TableBuilderWithFunction<State>

  // Configuration
  name(template: string): TableBuilderWithFunction<State>
  only(): TableBuilderWithFunction<State>
  skip(reason?: string): TableBuilderWithFunction<State>
  skipIf(condition: () => boolean): TableBuilderWithFunction<State>
  concurrent(): TableBuilderWithFunction<State>
  tags(tags: string[]): TableBuilderWithFunction<State>
  onlyMatching(matcher: string): TableBuilderWithFunction<State>

  // Test organization
  describe(name: string): TableBuilderWithFunction<State>

  // Output transformation - returns a new builder with mapped output type
  o<MappedInput>(
    mapper: (
      output: MappedInput,
      args: State['fn'] extends (...args: infer P) => any ? P : never,
    ) => State['fn'] extends (...args: any[]) => infer R ? R : never,
  ): TableBuilderWithMappedFunction<
    { i: State['i']; o: MappedInput; context: State['context']; fn: State['fn'] },
    State['fn'],
    MappedInput
  >

  // Layers
  layer<R>(layer: Layer.Layer<R>): TableBuilderWithFunctionAndLayers<State, State['fn'], R>
  layerEach<R>(
    factory: (
      testCase: State['fn'] extends (...args: infer P) => infer R ? { i: P; o?: R }
        : never,
    ) => Layer.Layer<R>,
  ): TableBuilderWithFunctionAndLayers<State, State['fn'], R>

  // Terminal - execute tests
  test(): void
  test(
    fn: State['fn'] extends (...args: infer P) => infer R
      ? (result: R, expected: R | undefined, ctx: State['context'], context: TestContext) => void | Promise<void>
      : never,
  ): void

  // Cleaner case input methods

  // Each case is the args tuple directly (no extra wrapping)
  casesAsArgs(
    ...cases: State['fn'] extends (...args: infer P) => any ? P[]
      : never
  ): TableBuilderWithFunction<State>

  // Each case is a single argument (for single-param functions)
  casesAsArg<T>(
    ...cases: State['fn'] extends (arg: T) => any ? T[]
      : never
  ): TableBuilderWithFunction<State>
}

/**
 * Builder after .o() mapper is applied - changes expected output type
 */
export interface TableBuilderWithMappedFunction<
  State extends BuilderTypeState,
  Fn extends Fn.AnyAny,
  MappedInput,
> {
  // Cases now expect MappedInput as output type
  cases(
    ...cases: Array<
      Fn extends (...args: infer P) => any ? FunctionCase<P, MappedInput>
        : never
    >
  ): TableBuilderWithMappedFunction<State, Fn, MappedInput>

  casesIn(
    describeName: string,
  ): (
    ...cases: Array<
      Fn extends (...args: infer P) => any ? FunctionCase<P, MappedInput>
        : never
    >
  ) => TableBuilderWithMappedFunction<State, Fn, MappedInput>

  case(
    ...args: Fn extends (...args: infer P) => any ? CaseSingleParams<P, MappedInput>
      : never
  ): TableBuilderWithMappedFunction<State, Fn, MappedInput>

  // Configuration methods return the mapped type
  name(template: string): TableBuilderWithMappedFunction<State, Fn, MappedInput>
  only(): TableBuilderWithMappedFunction<State, Fn, MappedInput>
  skip(reason?: string): TableBuilderWithMappedFunction<State, Fn, MappedInput>
  skipIf(condition: () => boolean): TableBuilderWithMappedFunction<State, Fn, MappedInput>
  concurrent(): TableBuilderWithMappedFunction<State, Fn, MappedInput>
  tags(tags: string[]): TableBuilderWithMappedFunction<State, Fn, MappedInput>
  onlyMatching(matcher: string): TableBuilderWithMappedFunction<State, Fn, MappedInput>

  // Test organization
  describe(name: string): TableBuilderWithMappedFunction<State, Fn, MappedInput>

  // Terminal - execute tests
  test(): void
  test<Ctx = {}>(
    fn: Fn extends (...args: infer P) => any
      ? (i: P, o: MappedInput | undefined, ctx: Ctx, context: TestContext) => void | Promise<void>
      : never,
  ): void

  // Cleaner case input methods

  casesAsArgs(
    ...cases: Fn extends (...args: infer P) => any ? P[]
      : never
  ): TableBuilderWithMappedFunction<State, Fn, MappedInput>

  casesAsArg<T>(
    ...cases: Fn extends (arg: T) => any ? T[]
      : never
  ): TableBuilderWithMappedFunction<State, Fn, MappedInput>
}

/**
 * Builder with function and layers
 */
export interface TableBuilderWithFunctionAndLayers<
  State extends BuilderTypeState,
  Fn extends Fn.AnyAny,
  R,
> {
  // Cases methods
  cases(
    ...cases: Array<
      Fn extends (...args: infer P) => infer Ret ? FunctionCase<P, Ret>
        : never
    >
  ): TableBuilderWithFunctionAndLayers<State, Fn, R>

  casesIn(
    describeName: string,
  ): (
    ...cases: Array<
      Fn extends (...args: infer P) => infer Ret ? FunctionCase<P, Ret>
        : never
    >
  ) => TableBuilderWithFunctionAndLayers<State, Fn, R>

  case(
    ...args: Fn extends (...args: infer P) => infer Ret ? CaseSingleParams<P, Ret>
      : never
  ): TableBuilderWithFunctionAndLayers<State, Fn, R>

  // Configuration
  name(template: string): TableBuilderWithFunctionAndLayers<State, Fn, R>
  only(): TableBuilderWithFunctionAndLayers<State, Fn, R>
  skip(reason?: string): TableBuilderWithFunctionAndLayers<State, Fn, R>
  skipIf(condition: () => boolean): TableBuilderWithFunctionAndLayers<State, Fn, R>
  concurrent(): TableBuilderWithFunctionAndLayers<State, Fn, R>
  tags(tags: string[]): TableBuilderWithFunctionAndLayers<State, Fn, R>
  onlyMatching(matcher: string): TableBuilderWithFunctionAndLayers<State, Fn, R>

  // Test organization
  describe(name: string): TableBuilderWithFunctionAndLayers<State, Fn, R>

  // Test methods
  testEffect<Ctx = {}>(
    fn: Fn extends (...args: infer P) => infer Ret ? (i: P, o: Ret | undefined, ctx: Ctx) => Effect.Effect<void, any, R>
      : never,
  ): void

  test(): void
  test<Ctx = {}>(
    fn: Fn extends (...args: infer P) => infer Ret
      ? (i: P, o: Ret | undefined, ctx: Ctx, context: TestContext) => void | Promise<void>
      : never,
  ): void

  // Cleaner case input methods

  casesAsArgs(
    ...cases: Fn extends (...args: infer P) => any ? P[]
      : never
  ): TableBuilderWithFunctionAndLayers<State, Fn, R>

  casesAsArg<T>(
    ...cases: Fn extends (arg: T) => any ? T[]
      : never
  ): TableBuilderWithFunctionAndLayers<State, Fn, R>
}

/**
 * Builder after cases are provided (non-.on() mode)
 * T extends BuilderTypeState to maintain type-level state
 */
export interface TableBuilderWithCases<T extends BuilderTypeState> {
  // Configuration
  name(template: string): TableBuilderWithCases<T>
  only(): TableBuilderWithCases<T>
  skip(reason?: string): TableBuilderWithCases<T>
  skipIf(condition: () => boolean): TableBuilderWithCases<T>
  concurrent(): TableBuilderWithCases<T>
  tags(tags: string[]): TableBuilderWithCases<T>

  // Layers
  layer<R>(layer: Layer.Layer<R>): TableBuilderWithCasesAndLayers<T, R>
  layerEach<R>(
    factory: (testCase: { i: T['i']; o: T['o'] } & T['context']) => Layer.Layer<R>,
  ): TableBuilderWithCasesAndLayers<T, R>

  // Terminal
  test(
    fn: T extends { i: infer I; o: infer O; context: infer Ctx }
      ? (i: I, o: O, ctx: Ctx, context: TestContext) => void | Promise<void>
      : never,
  ): void
}

/**
 * Builder with cases and layers
 */
export interface TableBuilderWithCasesAndLayers<T extends BuilderTypeState, R> {
  // Configuration methods
  name(template: string): TableBuilderWithCasesAndLayers<T, R>
  only(): TableBuilderWithCasesAndLayers<T, R>
  skip(reason?: string): TableBuilderWithCasesAndLayers<T, R>
  skipIf(condition: () => boolean): TableBuilderWithCasesAndLayers<T, R>
  concurrent(): TableBuilderWithCasesAndLayers<T, R>
  tags(tags: string[]): TableBuilderWithCasesAndLayers<T, R>

  // Terminal methods
  testEffect(
    fn: T extends { i: infer I; o: infer O; context: infer Ctx } ? (i: I, o: O, ctx: Ctx) => Effect.Effect<void, any, R>
      : never,
  ): void
  test(
    fn: T extends { i: infer I; o: infer O; context: infer Ctx }
      ? (i: I, o: O, ctx: Ctx, context: TestContext) => void | Promise<void>
      : never,
  ): void
}

// ============================================================================
// Helper Types
// ============================================================================

/**
 * Parameters for .case() method - supports direct params or object
 * When using .on(), params are passed as tuple [params]
 */
export type CaseSingleParams<P extends any[], R> =
  | [P] // Just params tuple (for .on() mode)
  | [string, P] // Name + params tuple
  | [P, R] // Params tuple + output
  | [string, P, R] // Name + params tuple + output
  | [...P] // Direct params (spread)
  | [string, ...P] // Name + direct params
  | [...P, R] // Direct params + output
  | [string, ...P, R] // Name + direct params + output
  | [CaseObject<P, R>] // Object form
