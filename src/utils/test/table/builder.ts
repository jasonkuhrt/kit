import type { Fn } from '#fn'
import { Array, Effect, Equal, Layer, Option } from 'effect'
import { describe as vitestDescribe, expect, test, type TestContext } from 'vitest'
import type {
  BuilderTypeState,
  CaseObject,
  CaseObjectBase,
  CaseSingleParams,
  CaseTuple,
  FunctionCase,
  GenericCase,
  TableBuilderBase,
  TableBuilderWithCases,
  TableBuilderWithCasesAndLayers,
  TableBuilderWithFunction,
  TableBuilderWithFunctionAndLayers,
  TableBuilderWithMappedFunction,
} from './builder-types.js'

// ============================================================================
// Configuration & State Types
// ============================================================================

interface BuilderConfig {
  description?: string
  nameTemplate?: string
  only?: boolean
  skip?: boolean | string
  skipIf?: () => boolean
  concurrent?: boolean
  tags?: string[]
  matcher?: string
}

interface TestGroup {
  describe: Option.Option<string>
  cases: any[] // Effect's Array module works with regular arrays
}

interface BuilderState {
  fn: Option.Option<Fn.AnyAny>
  config: BuilderConfig
  outputMapper: Option.Option<Fn.AnyAny>
  pendingDescribe: Option.Option<string>
  accumulatedGroups: TestGroup[] // Effect's Array module works with regular arrays
  currentCases: any[] // Effect's Array module works with regular arrays
  layerOrFactory: Option.Option<Layer.Layer<any> | ((testCase: any) => Layer.Layer<any>)>
  layerType: Option.Option<'static' | 'dynamic'>
  typeState: BuilderTypeState
}

// ============================================================================
// Default State
// ============================================================================

const defaultState: BuilderState = {
  fn: Option.none<Fn.AnyAny>(),
  config: {},
  outputMapper: Option.none<Fn.AnyAny>(),
  pendingDescribe: Option.none(),
  accumulatedGroups: [],
  currentCases: [],
  layerOrFactory: Option.none(),
  layerType: Option.none(),
  typeState: { i: undefined, o: undefined, context: {}, fn: (() => {}) as Fn.AnyAny },
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Custom assertion that uses Effect's Equal.equals for equivalence checking.
 * Falls back to Vitest's toEqual for better error messages when values are not equal.
 */
const assertEffectEqual = (actual: any, expected: any) => {
  // First try Effect's Equal.equals for proper equivalence checking
  // This handles Effect data types that implement Equal trait
  const isEqual = Equal.equals(actual, expected)

  if (!isEqual) {
    // Use toEqual for better diff output when assertion fails
    expect(actual).toEqual(expected)
  }
  // If Equal.equals returns true, assertion passes silently
}

// ============================================================================
// Functional Builder Implementation
// ============================================================================

function createBuilder(state: BuilderState = defaultState): any {
  // Helper to flush current cases to accumulated groups
  const flushCases = (s: BuilderState): BuilderState => {
    if (s.currentCases.length > 0) {
      const group: TestGroup = {
        describe: s.pendingDescribe,
        cases: s.currentCases,
      }
      return {
        ...s,
        accumulatedGroups: [...s.accumulatedGroups, group],
        currentCases: [],
        pendingDescribe: Option.none(),
      }
    }
    return s
  }

  // Parse case arguments helper
  const parseCaseArgs = (args: any[]): any => {
    // If single argument and it's an object with 'n' property, it's object form
    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && 'n' in args[0]) {
      return args[0] as CaseObject<any, any>
    }

    const fn = Option.getOrUndefined(state.fn)
    if (!fn) return args // Can't parse without function

    // Otherwise it's direct parameters
    const hasName = typeof args[0] === 'string'
    const startIdx = hasName ? 1 : 0
    const name = hasName ? args[0] : undefined

    // For .on() mode, params are always passed as a tuple
    if (Array.isArray(args[startIdx])) {
      const params = args[startIdx] as any[]
      const hasOutput = args.length > startIdx + 1
      const output = hasOutput ? args[startIdx + 1] : undefined

      // Build tuple case
      if (name && hasOutput) {
        return [name, params, output] as CaseTuple<any, any>
      } else if (name) {
        return [name, params] as CaseTuple<any, any>
      } else if (hasOutput) {
        return [params, output] as CaseTuple<any, any>
      } else {
        return [params] as CaseTuple<any, any>
      }
    } else {
      // Direct params (not in array) - collect based on function arity
      const fnArity = fn.length
      const params = args.slice(startIdx, startIdx + fnArity)
      const hasOutput = args.length > startIdx + fnArity
      const output = hasOutput ? args[startIdx + fnArity] : undefined

      // Build tuple case
      if (name && hasOutput) {
        return [name, params, output] as CaseTuple<any, any>
      } else if (name) {
        return [name, params] as CaseTuple<any, any>
      } else if (hasOutput) {
        return [params, output] as CaseTuple<any, any>
      } else {
        return [params] as CaseTuple<any, any>
      }
    }
  }

  // Terminal execution helper
  const executeTests = (
    customTest: ((i: any, o: any, ctx: any, context: TestContext) => any) | undefined,
    describeBlock: string | undefined,
    cases: any[],
  ) => {
    const testFn = state.config.concurrent ? test.concurrent : test
    const testMethod = state.config.only ? testFn.only : testFn
    const fn = Option.getOrUndefined(state.fn)
    const outputMapper = Option.getOrUndefined(state.outputMapper)

    const parseCase = (caseData: any): {
      name: string
      input: any[]
      output?: any
      skip?: boolean | string
      skipIf?: () => boolean
      only?: boolean
      todo?: boolean | string
      tags?: string[]
    } => {
      // Object form
      if (!Array.isArray(caseData)) {
        const obj = caseData as any // CaseObject type is complex, use any for destructuring
        // Extract known properties and preserve the rest as context
        const { n, i, o, skip, skipIf, only, todo, tags, ...context } = obj

        return {
          name: n,
          input: fn ? (i ?? []) : i, // Only default to [] for function mode
          output: o,
          skip: skip as boolean | string | undefined,
          skipIf: skipIf as (() => boolean) | undefined,
          only: only as boolean | undefined,
          todo: todo as boolean | string | undefined,
          tags: tags as string[] | undefined,
          ...context, // Preserve any additional properties like 'data'
        } as any
      }

      // Tuple form
      const tuple = caseData as CaseTuple<any, any>
      const generateName = (input: any, output?: any): string => {
        const fnName = fn?.name || 'fn'
        const inputStr = Array.isArray(input)
          ? input.map(p => JSON.stringify(p)).join(', ')
          : JSON.stringify(input)
        return output !== undefined
          ? `${fnName}(${inputStr}) → ${JSON.stringify(output)}`
          : `${fnName}(${inputStr})`
      }

      const formatName = (template: string, input: any, output?: any): string => {
        if (!state.config.nameTemplate) return template
        return state.config.nameTemplate
          .replace('$i', JSON.stringify(input))
          .replace('$o', output !== undefined ? JSON.stringify(output) : 'snapshot')
      }

      // Determine structure
      if (typeof tuple[0] === 'string') {
        const name = tuple[0]
        const wrappedInput = tuple[1] as any[]
        const output = tuple[2]
        const context = tuple[3 as any] // Context is 4th element when name is present
        // For non-.on() mode, unwrap the input array
        const input = fn ? wrappedInput : wrappedInput[0]
        return {
          name: formatName(name, wrappedInput, output),
          input,
          output,
          ...(context && typeof context === 'object' ? context : {}),
        }
      } else {
        const wrappedInput = tuple[0] as any[]
        const output = tuple[1]
        const context = tuple[2] // Context is 3rd element when name is absent
        // For non-.on() mode, unwrap the input array
        const input = fn ? wrappedInput : wrappedInput[0]
        return {
          name: generateName(wrappedInput, output),
          input,
          output,
          ...(context && typeof context === 'object' && !Array.isArray(context) ? context : {}),
        }
      }
    }

    const runTests = () => {
      for (const caseData of cases) {
        const { name, input, output, skip, skipIf, only, todo, tags, ...testContext } = parseCase(caseData)

        if (todo) {
          testMethod.todo(name)
          continue
        }

        testMethod(name, async (vitestContext) => {
          // Handle skip conditions
          if (skip || state.config.skip) {
            vitestContext.skip(
              typeof skip === 'string' ? skip : typeof state.config.skip === 'string' ? state.config.skip : undefined,
            )
            return
          }

          if (skipIf?.() || state.config.skipIf?.()) {
            vitestContext.skip('Skipped by condition')
            return
          }

          // Run the test
          if (fn) {
            // Function mode (.on() was used)
            const result = fn(...input)

            if (customTest) {
              // Custom assertion provided to .test()
              const transformedOutput = outputMapper ? outputMapper(output, input) : output
              await customTest(result, transformedOutput, testContext, vitestContext)
            } else if (output !== undefined) {
              // Default assertion
              const transformedOutput = outputMapper ? outputMapper(output, input) : output
              if (state.config.matcher) {
                // Use configured matcher
                ;(expect(result) as any)[state.config.matcher](transformedOutput)
              } else {
                // Default to Effect's Equal.equals with fallback to toEqual
                assertEffectEqual(result, transformedOutput)
              }
            } else {
              // Snapshot mode
              expect(result).toMatchSnapshot(name)
            }
          } else if (customTest) {
            // Non-.on() mode with custom test
            const result = await customTest(input, output, testContext, vitestContext)
            // Auto-snapshot if result is returned
            if (result !== undefined) {
              expect(result).toMatchSnapshot(name)
            }
          }
        })
      }
    }

    // Wrap in describe if description or describeBlock provided
    if (describeBlock) {
      vitestDescribe(describeBlock, () => {
        if (state.config.description) {
          vitestDescribe(state.config.description, runTests)
        } else {
          runTests()
        }
      })
    } else if (state.config.description) {
      vitestDescribe(state.config.description, runTests)
    } else {
      runTests()
    }
  }

  // Return builder object with all methods
  return {
    // Type building methods
    i() {
      return createBuilder({
        ...state,
        typeState: { ...state.typeState, i: undefined as any },
      })
    },

    o(mapperOrNothing?: Fn.AnyAny) {
      // Check if this is output mapper mode for .on()
      if (Option.isSome(state.fn) && typeof mapperOrNothing === 'function') {
        return createBuilder({
          ...state,
          outputMapper: Option.some(mapperOrNothing),
        })
      }
      // Otherwise it's type setting
      return createBuilder({
        ...state,
        typeState: { ...state.typeState, o: undefined as any },
      })
    },

    // Function mode
    on(fn: Fn.AnyAny) {
      return createBuilder({
        ...state,
        fn: Option.some(fn),
        typeState: { ...state.typeState, fn },
      })
    },

    // Cases methods - always non-terminal, returns builder for chaining
    cases(...cases: any[]) {
      const newState = {
        ...state,
        currentCases: [...state.currentCases, ...cases],
      }
      // Always return builder for chaining - execution happens in .test()
      // Cast to proper type for type inference
      return createBuilder(flushCases(newState)) as any
    },

    casesIn(describeName: string) {
      return (...cases: any[]) => {
        // First flush any pending cases with their describe
        const flushed = flushCases(state)
        // Then add the new describe with its cases
        const newState = {
          ...flushed,
          pendingDescribe: Option.some(describeName),
          currentCases: cases,
        }
        return createBuilder(flushCases(newState))
      }
    },

    casesAsArgs(...cases: any[]) {
      const wrappedCases = cases.map(args => [args])
      const newState = {
        ...state,
        currentCases: [...state.currentCases, ...wrappedCases],
      }
      // Always return builder for chaining
      return createBuilder(newState)
    },

    casesAsArg(...cases: any[]) {
      const wrappedCases = cases.map(arg => [[arg]])
      const newState = {
        ...state,
        currentCases: [...state.currentCases, ...wrappedCases],
      }
      // Always return builder for chaining
      return createBuilder(newState)
    },

    case(...args: any[]) {
      const caseData = parseCaseArgs(args)
      return createBuilder({
        ...state,
        currentCases: [...state.currentCases, caseData],
      })
    },

    // Configuration methods
    name(template: string) {
      return createBuilder({
        ...state,
        config: { ...state.config, nameTemplate: template },
      })
    },

    only() {
      return createBuilder({
        ...state,
        config: { ...state.config, only: true },
      })
    },

    skip(reason?: string) {
      return createBuilder({
        ...state,
        config: { ...state.config, skip: reason ?? true },
      })
    },

    skipIf(condition: () => boolean) {
      return createBuilder({
        ...state,
        config: { ...state.config, skipIf: condition },
      })
    },

    concurrent() {
      return createBuilder({
        ...state,
        config: { ...state.config, concurrent: true },
      })
    },

    tags(tags: string[]) {
      return createBuilder({
        ...state,
        config: { ...state.config, tags },
      })
    },

    onlyMatching(matcher: string) {
      return createBuilder({
        ...state,
        config: { ...state.config, matcher },
      })
    },

    describe(name: string) {
      // If we have pending describe and cases, flush them first
      if (Option.isSome(state.pendingDescribe) || state.currentCases.length > 0) {
        const flushed = flushCases(state)
        return createBuilder({
          ...flushed,
          pendingDescribe: Option.some(name),
        })
      }
      return createBuilder({
        ...state,
        pendingDescribe: Option.some(name),
      })
    },

    // Layer methods
    layer(layer: Layer.Layer<any>) {
      return createBuilder({
        ...state,
        layerOrFactory: Option.some(layer),
        layerType: Option.some('static' as const),
      })
    },

    layerEach(factory: (testCase: any) => Layer.Layer<any>) {
      return createBuilder({
        ...state,
        layerOrFactory: Option.some(factory),
        layerType: Option.some('dynamic' as const),
      })
    },

    // Terminal methods
    test(fn?: Fn.AnyAny): void {
      // Flush any remaining cases
      const finalState = flushCases(state)

      // Execute all accumulated groups
      for (const group of finalState.accumulatedGroups) {
        executeTests(
          fn as ((i: any, o: any, ctx: any, context: TestContext) => any) | undefined,
          Option.getOrUndefined(group.describe),
          group.cases,
        )
      }
    },

    testEffect(fn: Fn.AnyAny): void {
      // Flush any remaining cases
      const finalState = flushCases(state)
      const layerOrFactory = Option.getOrUndefined(finalState.layerOrFactory)
      const layerType = Option.getOrUndefined(finalState.layerType)

      // Execute with Effect wrapper
      for (const group of finalState.accumulatedGroups) {
        executeTests(
          (i: any, o: any, ctx: any, context: any) => {
            const effect = fn(i, o, ctx)
            const layer = layerType === 'static'
              ? layerOrFactory
              : (layerOrFactory as (testCase: any) => Layer.Layer<any>)({ i, o, ...ctx })

            const effectWithLayer = Effect.provide(effect, layer as any) as Effect.Effect<any, any, never>
            return Effect.runPromise(effectWithLayer)
          },
          Option.getOrUndefined(group.describe),
          group.cases,
        )
      }
    },
  }
}

// ============================================================================
// Public API
// ============================================================================

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
 * @example
 * ```ts
 * // Function mode - testing a math function
 * Test.describe('addition')
 *   .on(add)
 *   .cases(
 *     [[2, 3], 5],                          // Test case: add(2, 3) should return 5
 *     ['negative', [-1, -2], -3],           // Named test case
 *     [[0, 0], 0]                           // Edge case: zeros
 *   )
 *   .test()  // Execute tests with default assertions
 *
 * // Generic mode - custom validation logic
 * Test.describe('email validation')
 *   .i<string>()                           // Input type
 *   .o<boolean>()                          // Output type
 *   .cases(
 *     { n: 'valid email', i: 'user@example.com', o: true },
 *     { n: 'no @', i: 'invalid.com', o: false },
 *     { n: 'empty', i: '', o: false }
 *   )
 *   .test((input, expected) => {
 *     const result = isValidEmail(input)
 *     expect(result).toBe(expected)
 *   })
 *
 * // Using describe blocks for organization
 * Test.describe('string utilities')
 *   .on(capitalize)
 *   .casesIn('basic')([['hello'], 'Hello'], [['world'], 'World'])
 *   .casesIn('edge cases')([[''], ''], [['123'], '123'])
 *   .test()
 * ```
 *
 * @param description - Optional description for the test suite, creates a Vitest describe block
 * @returns A {@link TableBuilderBase} for chaining configuration, cases, and execution
 *
 * @see {@link on} for function mode without a describe block
 */
export function describe(): TableBuilderBase<
  { i: unknown; o: unknown; context: {}; fn: Fn.AnyAny }
>
export function describe(
  description: string,
): TableBuilderBase<{ i: unknown; o: unknown; context: {}; fn: Fn.AnyAny }>
export function describe(
  description?: string,
): TableBuilderBase<{ i: unknown; o: unknown; context: {}; fn: Fn.AnyAny }> {
  const initialState: BuilderState = description
    ? { ...defaultState, config: { description } }
    : defaultState
  return createBuilder(
    { ...initialState, typeState: { i: undefined, o: undefined, context: {}, fn: (() => {}) as Fn.AnyAny } },
  ) as TableBuilderBase<{ i: unknown; o: unknown; context: {}; fn: Fn.AnyAny }>
}

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
 * - `{ n: 'name', i: [arg1, arg2], o: expected }`
 * - `{ n: 'name', i: [arg1, arg2], o: expected, skip: true }`
 * - `{ n: 'name', todo: 'Not implemented yet' }`
 *
 * **Direct Arguments** (with `.case()` method):
 * - `.case(arg1, arg2, expected)` - Spreads arguments naturally
 * - `.case('name', arg1, arg2, expected)` - Named with spread
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
 *   .case(2, 3, 6)                   // Direct arguments
 *   .case('zero', 5, 0, 0)          // Named direct arguments
 *   .cases(
 *     { n: 'negative', i: [-2, 3], o: -6 },  // Object format
 *     { n: 'large', i: [100, 100], o: 10000 }
 *   )
 *   .test()
 *
 * // Custom assertions
 * Test.on(divide)
 *   .cases([[10, 2], 5], [[10, 0], Infinity])
 *   .test((result, expected) => {
 *     if (expected === Infinity) {
 *       expect(result).toBe(Infinity)
 *     } else {
 *       expect(result).toBeCloseTo(expected, 2)
 *     }
 *   })
 *
 * // Output transformation - build full expectations from partials
 * Test.on(createUser)
 *   .o((partial, [name]) => ({ ...defaultUser, name, ...partial }))  // Transform expected output
 *   .cases(
 *     [['Alice'], { role: 'admin' }],    // Only specify what differs from defaults
 *     [['Bob'], { role: 'user', age: 30 }]
 *   )
 *   .test()
 * ```
 *
 * @param $fn - The function to test. Types are inferred from its signature
 * @returns A {@link TableBuilderWithFunction} for configuring and running tests
 *
 * @see {@link describe} for creating tests with a describe block
 */
export function on<$fn extends Fn.AnyAny>(
  $fn: $fn,
): TableBuilderWithFunction<{ i: never; o: never; context: {}; fn: $fn }> {
  const initialState: BuilderState = {
    ...defaultState,
    fn: Option.some($fn),
  }
  return createBuilder({
    ...initialState,
    typeState: { i: undefined, o: undefined, context: {}, fn: $fn },
  }) as TableBuilderWithFunction<{ i: never; o: never; context: {}; fn: typeof $fn }>
}
