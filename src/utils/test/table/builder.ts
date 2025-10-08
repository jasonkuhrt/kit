import { Err } from '#err'
import { Fn as FnUtils } from '#fn'
import type { Fn } from '#fn'
import { Str } from '#str'
import { Array, Effect, Equal, Layer, Option } from 'effect'
import { describe as vitestDescribe, expect, test, type TestContext } from 'vitest'
import type {
  BuilderTypeState,
  CaseObject,
  CaseTuple,
  TableBuilderBase,
  TableBuilderWithFunction,
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
  nestedGroups?: TestGroup[] // Nested describe blocks created via .describe(name, callback)
}

interface BuilderState {
  fn: Option.Option<Fn.AnyAny>
  config: BuilderConfig
  outputMapper: Option.Option<Fn.AnyAny>
  defaultOutputProvider: Option.Option<Fn.AnyAny>
  snapshotSerializer: Option.Option<(value: any, context: any) => string>
  pendingDescribe: Option.Option<string>
  accumulatedGroups: TestGroup[] // Effect's Array module works with regular arrays
  currentCases: any[] // Effect's Array module works with regular arrays
  nestedDescribeGroups: TestGroup[] // Nested describe blocks from .describe(name, callback)
  layerOrFactory: Option.Option<Layer.Layer<any> | ((testCase: any) => Layer.Layer<any>)>
  layerType: Option.Option<'static' | 'dynamic'>
  typeState: BuilderTypeState
  setupFactories: Array<() => object>
}

// ============================================================================
// Default State
// ============================================================================

const defaultState: BuilderState = {
  fn: Option.none<Fn.AnyAny>(),
  config: {},
  outputMapper: Option.none<Fn.AnyAny>(),
  defaultOutputProvider: Option.none<Fn.AnyAny>(),
  snapshotSerializer: Option.none(),
  pendingDescribe: Option.none(),
  accumulatedGroups: [],
  currentCases: [],
  nestedDescribeGroups: [],
  layerOrFactory: Option.none(),
  layerType: Option.none(),
  typeState: { i: undefined, o: undefined, context: {}, fn: (() => {}) as Fn.AnyAny },
  setupFactories: [],
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

/**
 * Validate that user context doesn't contain reserved property names.
 * Reserved names: input, output, result, n
 */
const validateContextKeys = (context: object, caseName: string): void => {
  const reservedKeys = ['input', 'output', 'result', 'n']
  const contextKeys = Object.keys(context)
  const conflicts = contextKeys.filter((key) => reservedKeys.includes(key))

  if (conflicts.length > 0) {
    throw new Error(
      `Test case "${caseName}" contains reserved context keys: ${conflicts.join(', ')}. `
        + `Reserved keys are: ${reservedKeys.join(', ')}. `
        + `Please rename these properties in your test context.`,
    )
  }
}

/**
 * Default snapshot serializer with smart handling for different value types.
 * - Strings: Display raw (no JSON quotes/escaping) for readability
 * - Functions: Use .toString()
 * - undefined: Display as 'undefined' string
 * - Symbols: Use .toString()
 * - BigInt: Display as '123n' format
 * - RegExp: Use .toString() (e.g., '/foo/gi')
 * - Errors: Use Err.inspect() for detailed formatting
 * - Objects/Arrays: Use JSON.stringify with indentation
 * @param value - The value to serialize
 * @param _context - Test context (unused by default serializer, available for custom serializers)
 * @returns Formatted string representation
 */
const defaultSnapshotSerializer = (value: any, _context: any): string => {
  if (typeof value === 'string') return value
  if (typeof value === 'function') return value.toString()
  if (typeof value === 'undefined') return 'undefined'
  if (typeof value === 'symbol') return value.toString()
  if (typeof value === 'bigint') return value.toString() + 'n'
  if (value instanceof RegExp) return value.toString()
  if (value instanceof Error) return Err.inspect(value)
  return JSON.stringify(value, null, 2)
}

/**
 * Get a human-readable type label for a value.
 */
const getTypeLabel = (value: any): string => {
  if (value === null) return `NULL`
  if (value === undefined) return `UNDEFINED`

  const type = typeof value
  if (type === `string`) return `STRING`
  if (type === `number`) return `NUMBER`
  if (type === `boolean`) return `BOOLEAN`
  if (type === `bigint`) return `BIGINT`
  if (type === `symbol`) return `SYMBOL`
  if (type === `function`) return `FUNCTION`

  // Check for built-in types
  if (Array.isArray(value)) return `ARRAY`
  if (value instanceof RegExp) return `REGEXP`
  if (value instanceof Date) return `DATE`
  if (value instanceof Map) return `MAP`
  if (value instanceof Set) return `SET`
  if (value instanceof Promise) return `PROMISE`
  if (value instanceof Error) return value.constructor.name.toUpperCase()

  return `OBJECT`
}

/**
 * Format a snapshot with clear GIVEN/THEN sections showing arguments and return value or error.
 * Two modes:
 * - Function mode (has inputs): GIVEN ARGUMENTS → THEN RETURNS/THROWS
 * - Runner mode (no inputs): RUNNER → OUTPUTS RETURN/THROW
 */
const formatSnapshotWithInput = (
  input: any[],
  result: any,
  error?: Error,
  runner?: Function,
  serializer: (value: any, context: any) => string = defaultSnapshotSerializer,
  context: any = {},
): string => {
  // Fixed width for all boxes
  const width = 50

  const isError = error !== undefined
  const outputStr = isError
    ? `${error.name}: ${error.message}`
    : serializer(result, context)

  const hasInput = input.length > 0

  if (hasInput) {
    // Function mode: GIVEN → THEN
    // Format all inputs
    const formattedInputs = input.map((i) => serializer(i, context))

    // Format input string
    let inputStr: string
    if (input.length === 1) {
      inputStr = formattedInputs[0]!
    } else {
      // Separator should match box border width (width + 2 for the corner characters)
      const separator = '─'.repeat(width + 2)
      inputStr = formattedInputs.join('\n' + separator + '\n')
    }

    // Box drawing with titles at the end
    const givenLabel = ' GIVEN ARGUMENTS'
    const thenLabel = isError ? ` THEN THROWS ${getTypeLabel(error)}` : ` THEN RETURNS ${getTypeLabel(result)}`

    return [
      '', // Leading newline to force opening quote on own line
      '╔' + '═'.repeat(width) + '╗' + givenLabel,
      inputStr,
      '╠' + '═'.repeat(width) + '╣' + thenLabel,
      outputStr,
      '╚' + '═'.repeat(width) + '╝',
    ].join('\n')
  } else {
    // Runner mode: Show runner function and output
    if (runner) {
      // Extract just the function body (remove first and last lines)
      const runnerLines = runner.toString().split('\n')
      const bodyLines = runnerLines.slice(1, -1)
      const bodyWithIndent = bodyLines.join('\n')
      const runnerBody = Str.stripIndent(bodyWithIndent)

      const outputLabel = isError ? ` OUTPUTS THROW ${getTypeLabel(error)}` : ` OUTPUTS RETURN ${getTypeLabel(result)}`

      return [
        '', // Leading newline to force opening quote on own line
        '╔' + '═'.repeat(width) + '╗' + ' RUNNER',
        runnerBody,
        '╠' + '═'.repeat(width) + '╣' + outputLabel,
        outputStr,
        '╚' + '═'.repeat(width) + '╝',
      ].join('\n')
    } else {
      // Fallback: no runner function available
      const outputLabel = isError ? ` OUTPUTS THROW ${getTypeLabel(error)}` : ` OUTPUTS RETURN ${getTypeLabel(result)}`

      return [
        '', // Leading newline to force opening quote on own line
        '╔' + '═'.repeat(width) + '╗' + outputLabel,
        outputStr,
        '╚' + '═'.repeat(width) + '╝',
      ].join('\n')
    }
  }
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

  // Recursive helper to execute nested describe groups
  const executeNestedGroup = (
    group: TestGroup,
    customTest: ((params: any) => any) | undefined,
  ): void => {
    const describeName = Option.getOrUndefined(group.describe)

    const runGroupTests = () => {
      // Execute this group's cases
      if (group.cases.length > 0) {
        executeTests(customTest, undefined, group.cases)
      }

      // Recursively execute nested groups
      if (group.nestedGroups && group.nestedGroups.length > 0) {
        for (const nestedGroup of group.nestedGroups) {
          executeNestedGroup(nestedGroup, customTest)
        }
      }
    }

    // Wrap in describe block if name provided
    if (describeName) {
      vitestDescribe(describeName, runGroupTests)
    } else {
      runGroupTests()
    }
  }

  // Terminal execution helper
  const executeTests = (
    customTest: ((params: any) => any) | undefined,
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
      runner?: any
      isRunnerCase?: boolean
    } => {
      // Runner case form
      if (!Array.isArray(caseData) && caseData.isRunnerCase) {
        return {
          name: caseData.n,
          input: [], // Runner cases don't have static input
          runner: caseData.runner,
          isRunnerCase: true,
        }
      }

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

      // Helper to stringify values for test names (handles functions, truncates long strings)
      const stringifyForTestName = (value: any, maxLength = 80): string => {
        let str: string
        if (typeof value === 'function') {
          // Convert function to string and compress whitespace for test names
          str = value.toString().replace(/\s+/g, ' ').trim()
        } else {
          // JSON.stringify(undefined) returns undefined, not a string
          const stringified = JSON.stringify(value)
          str = stringified === undefined ? 'undefined' : stringified
        }
        if (str.length <= maxLength) return str
        return str.slice(0, maxLength) + '...'
      }

      const generateName = (input: any, output?: any): string => {
        const fnName = fn?.name || 'fn'
        const inputStr = Array.isArray(input)
          ? input.map(p => stringifyForTestName(p)).join(', ')
          : stringifyForTestName(input)
        return output !== undefined
          ? `${fnName}(${inputStr}) → ${stringifyForTestName(output)}`
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
        const { name, input, output, skip, skipIf, only, todo, tags, runner, isRunnerCase, ...testContext } = parseCase(
          caseData,
        )

        // Validate that user context doesn't contain reserved keys
        validateContextKeys(testContext, name)

        if (todo) {
          testMethod.todo(name)
          continue
        }

        testMethod(name, async (vitestContext) => {
          // Handle runner cases
          if (isRunnerCase && runner) {
            // Build context for runner with setup
            const setupContext = state.setupFactories.reduce(
              (acc, factory) => ({ ...acc, ...factory() }),
              {} as object,
            )
            const runnerContext = {
              i: input,
              n: name,
              o: output,
              ...setupContext,
              ...testContext,
            }

            // Snapshot mode detection: no output, no customTest, no function
            const isSnapshotMode = output === undefined && !customTest && !fn

            // Execute runner with try-catch for snapshot mode
            let runnerOutput: any
            let runnerError: Error | undefined

            if (isSnapshotMode) {
              try {
                runnerOutput = runner(runnerContext)
              } catch (e) {
                runnerError = e as Error
              }

              // Resolve output: runner return → default provider → undefined
              let resolvedOutput = runnerOutput
              if (resolvedOutput === undefined && Option.isSome(state.defaultOutputProvider)) {
                const defaultProvider = Option.getOrUndefined(state.defaultOutputProvider)!
                resolvedOutput = defaultProvider(setupContext)
              }

              // Format and snapshot the result/error
              const serializer = Option.getOrElse(state.snapshotSerializer, () => defaultSnapshotSerializer)
              const snapshotContext = { i: input, n: name, o: resolvedOutput, ...setupContext, ...testContext }
              const formattedSnapshot = formatSnapshotWithInput(
                Array.isArray(input) ? input : [input],
                resolvedOutput,
                runnerError,
                runner,
                serializer,
                snapshotContext,
              )
              expect(formattedSnapshot).toMatchSnapshot()
              return
            } else {
              // Non-snapshot mode - let errors propagate
              runnerOutput = runner(runnerContext)
            }

            // Resolve output: runner return → default provider → undefined
            let resolvedOutput = runnerOutput
            if (resolvedOutput === undefined && Option.isSome(state.defaultOutputProvider)) {
              const defaultProvider = Option.getOrUndefined(state.defaultOutputProvider)!
              resolvedOutput = defaultProvider(setupContext)
            }

            // Apply output transform if configured
            const context = { i: input, n: name, o: resolvedOutput, ...testContext }
            const finalOutput = outputMapper ? outputMapper(resolvedOutput, context) : resolvedOutput

            // Function mode: call the function and assert
            if (fn) {
              const result = fn(...input)
              if (customTest) {
                // Merge vitest context into main context
                await customTest({
                  input,
                  output: finalOutput,
                  result,
                  n: name,
                  ...setupContext,
                  ...testContext,
                  ...vitestContext,
                })
              } else {
                if (state.config.matcher) {
                  ;(expect(result) as any)[state.config.matcher](finalOutput)
                } else {
                  assertEffectEqual(result, finalOutput)
                }
              }
            } else if (customTest) {
              // Generic mode: call custom test with resolved output
              await customTest({
                input,
                output: finalOutput,
                n: name,
                ...setupContext,
                ...testContext,
                ...vitestContext,
              })
            }
            return
          }

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
            if (output === undefined && !customTest) {
              // Snapshot mode - catch errors and snapshot them
              let result: any
              let error: Error | undefined
              try {
                result = fn(...input)
              } catch (e) {
                error = e as Error
              }
              const serializer = Option.getOrElse(state.snapshotSerializer, () => defaultSnapshotSerializer)
              const snapshotContext = { i: input, n: name, o: output, ...testContext }
              const formattedSnapshot = formatSnapshotWithInput(
                input,
                result,
                error,
                undefined,
                serializer,
                snapshotContext,
              )
              expect(formattedSnapshot).toMatchSnapshot()
            } else {
              // Non-snapshot mode - let errors propagate
              const result = fn(...input)
              const context = { i: input, n: name, o: output, ...testContext }
              const transformedOutput = outputMapper ? outputMapper(output, context) : output
              if (customTest) {
                // Custom assertion provided to .test() - merge vitest context
                const setupContext = state.setupFactories.reduce(
                  (acc, factory) => ({ ...acc, ...factory() }),
                  {} as object,
                )
                const testResult = await customTest({
                  input,
                  output: transformedOutput,
                  result,
                  n: name,
                  ...setupContext,
                  ...testContext,
                  ...vitestContext,
                })
                // Auto-snapshot if test returns a value
                if (testResult !== undefined) {
                  const serializer = Option.getOrElse(state.snapshotSerializer, () => defaultSnapshotSerializer)
                  const snapshotContext = { i: input, n: name, o: output, ...setupContext, ...testContext }
                  const formattedSnapshot = formatSnapshotWithInput(
                    input,
                    testResult,
                    undefined,
                    undefined,
                    serializer,
                    snapshotContext,
                  )
                  expect(formattedSnapshot).toMatchSnapshot()
                }
              } else {
                // Default assertion
                if (state.config.matcher) {
                  // Use configured matcher
                  ;(expect(result) as any)[state.config.matcher](transformedOutput)
                } else {
                  // Default to Effect's Equal.equals with fallback to toEqual
                  assertEffectEqual(result, transformedOutput)
                }
              }
            }
          } else if (customTest) {
            // Non-.on() mode with custom test
            const setupContext = state.setupFactories.reduce(
              (acc, factory) => ({ ...acc, ...factory() }),
              {} as object,
            )
            const result = await customTest({
              input,
              output,
              n: name,
              ...setupContext,
              ...testContext,
              ...vitestContext,
            })
            const context = { i: input, n: name, o: output, ...setupContext, ...testContext }
            // Auto-snapshot if result is returned
            if (result !== undefined) {
              const serializer = Option.getOrElse(state.snapshotSerializer, () => defaultSnapshotSerializer)
              const formattedSnapshot = formatSnapshotWithInput(
                Array.isArray(input) ? input : [input],
                result,
                undefined,
                undefined,
                serializer,
                context,
              )
              expect(formattedSnapshot).toMatchSnapshot()
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
  const builder: any = {
    // Internal state accessor (for nested describe extraction)
    _getState() {
      return state
    },

    // Type building methods
    inputType() {
      return createBuilder({
        ...state,
        typeState: { ...state.typeState, i: undefined as any },
      })
    },

    outputType() {
      return createBuilder({
        ...state,
        typeState: { ...state.typeState, o: undefined as any },
      })
    },

    outputDefault(provider: Fn.AnyAny) {
      return createBuilder({
        ...state,
        defaultOutputProvider: Option.some(provider),
      })
    },

    snapshotSerializer(serializer: (value: any, context: any) => string) {
      return createBuilder({
        ...state,
        snapshotSerializer: Option.some(serializer),
      })
    },

    onOutput(mapper: Fn.AnyAny) {
      // Output mapper for function mode
      return createBuilder({
        ...state,
        outputMapper: Option.some(mapper),
      })
    },

    contextType() {
      return createBuilder({
        ...state,
        typeState: { ...state.typeState, context: undefined as any },
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
      // Process cases - if a case is a function, call it with merged onSetup context
      const processedCases = cases.map(caseItem => {
        // Check if case is a function (function-based case pattern)
        if (typeof caseItem === 'function') {
          // Merge all onSetup factory results into a single context
          const context = state.setupFactories.reduce(
            (acc, factory) => ({ ...acc, ...factory() }),
            {} as object,
          )
          // Call the case function with the context to get the actual case
          return caseItem(context)
        }
        return caseItem
      })

      const newState = {
        ...state,
        currentCases: [...state.currentCases, ...processedCases],
      }
      // Always return builder for chaining - execution happens in .test()
      // Cast to proper type for type inference
      return createBuilder(flushCases(newState)) as any
    },

    casesIn(describeName: string) {
      return (...cases: any[]) => {
        // Process function cases like in cases()
        const processedCases = cases.map(caseItem => {
          if (typeof caseItem === 'function') {
            const context = state.setupFactories.reduce(
              (acc, factory) => ({ ...acc, ...factory() }),
              {} as object,
            )
            return caseItem(context)
          }
          return caseItem
        })

        // First flush any pending cases with their describe
        const flushed = flushCases(state)
        // Then add the new describe with its cases
        const newState = {
          ...flushed,
          pendingDescribe: Option.some(describeName),
          currentCases: processedCases,
        }
        return createBuilder(flushCases(newState))
      }
    },

    /**
     * Add test cases where each argument becomes a direct input to the function.
     *
     * **How it works:**
     * Uses `Fn.analyzeFunction` to parse the function signature and count parameters.
     * Based on the parameter count, it either wraps each case value (for unary functions)
     * or expects case values to already be parameter tuples (for multi-param functions).
     *
     * **Unary functions** (exactly 1 parameter in signature):
     * - Pass case values directly - they will be automatically wrapped
     * - Example: `casesAsArgs('hello', 'world')` → calls `fn('hello')`, `fn('world')`
     * - Works correctly even when the parameter type is an array:
     *   - `casesAsArgs(['a', 'b'], ['c', 'd'])` → calls `fn(['a', 'b'])`, `fn(['c', 'd'])`
     *
     * **Multi-parameter functions** (2+ parameters, including optional):
     * - Pass each case as an array/tuple of parameters
     * - Example: `casesAsArgs([1, 2], [3, 4])` → calls `fn(1, 2)`, `fn(3, 4)`
     * - Optional parameters still count (e.g., `(a, b?)` has 2 parameters):
     *   - `casesAsArgs(['value'], ['other'])` → calls `fn('value')`, `fn('other')`
     *   - You don't need to pass `undefined` for optional parameters
     *
     * **Why not just check if the argument is an array?**
     * Because a unary function might accept an array as its parameter. The only reliable
     * way to distinguish `fn(arr)` from `fn(a, b)` is to analyze the function signature.
     *
     * @param cases - Variable number of case inputs. For unary functions, pass values directly.
     *                For multi-param functions, pass tuples/arrays of parameters.
     * @returns Builder for method chaining
     *
     * @example
     * ```ts
     * // Unary function - pass values directly
     * const upperCase = (s: string) => s.toUpperCase()
     * Test.on(upperCase).casesAsArgs('hello', 'world').test()
     * // Calls: upperCase('hello'), upperCase('world')
     *
     * // Unary function with array parameter - still pass arrays directly
     * const sumArray = (nums: number[]) => nums.reduce((a, b) => a + b, 0)
     * Test.on(sumArray).casesAsArgs([1, 2, 3], [4, 5]).test()
     * // Calls: sumArray([1, 2, 3]), sumArray([4, 5])
     *
     * // Multi-parameter function - wrap each case in array
     * const add = (a: number, b: number) => a + b
     * Test.on(add).casesAsArgs([1, 2], [5, 5]).test()
     * // Calls: add(1, 2), add(5, 5)
     *
     * // Function with optional parameter - still wrap (optional params count!)
     * const decode = (input: string, options?: object) => JSON.parse(input)
     * Test.on(decode).casesAsArgs(['{"a":1}'], ['{"b":2}']).test()
     * // Calls: decode('{"a":1}'), decode('{"b":2}')
     * // Note: No need to pass undefined for options
     *
     * // Automatic error handling in snapshot mode
     * // Mix valid and invalid inputs - errors are captured automatically
     * Test.on(Positive.from)
     *   .casesAsArgs(
     *     1, 10, 100,      // Returns successfully
     *     0, -1, -10,      // Throws - captured as "THEN THROWS" in snapshots
     *   )
     *   .test()
     * ```
     */
    casesAsArgs(...cases: any[]) {
      const fn = Option.getOrUndefined(state.fn)
      if (!fn) {
        throw new Error('casesAsArgs requires .on() to be called first')
      }

      // Analyze function to get actual parameter count
      const analysis = FnUtils.analyzeFunction(fn)
      const isUnary = analysis.parameters.length === 1

      // Transform cases based on function arity:
      // Unary: anything → [anything] → fn(...[anything]) → fn(anything)
      // Multi-param: [1, 2] → [[1, 2]] → fn(...[1, 2]) → fn(1, 2)
      const processedCases = cases.map(args => [isUnary ? [args] : args])

      const newState = {
        ...state,
        currentCases: [...state.currentCases, ...processedCases],
      }
      return createBuilder(newState)
    },

    casesInAsArgs(describeName: string) {
      return (...cases: any[]) => {
        const fn = Option.getOrUndefined(state.fn)
        if (!fn) {
          throw new Error('casesInAsArgs requires .on() to be called first')
        }

        // Analyze function to get actual parameter count
        const analysis = FnUtils.analyzeFunction(fn)
        const isUnary = analysis.parameters.length === 1

        // Transform cases based on function arity (same as casesAsArgs)
        const processedCases = cases.map(args => [isUnary ? [args] : args])

        // First flush any pending cases with their describe
        const flushed = flushCases(state)

        // Then add the new describe with its cases
        const newState = {
          ...flushed,
          pendingDescribe: Option.some(describeName),
          currentCases: processedCases,
        }
        return createBuilder(flushCases(newState))
      }
    },

    case(...args: any[]) {
      // Check if this is a runner case: .case(name, runnerFn)
      // Detection: if we have exactly 2 args and second is a function, it's a runner
      if (args.length === 2 && typeof args[0] === 'string' && typeof args[1] === 'function') {
        const name = args[0]
        const runner = args[1]

        // Store as a special runner case object
        const runnerCase = {
          n: name,
          runner: runner, // Mark as runner case
          isRunnerCase: true,
        }

        return createBuilder({
          ...state,
          currentCases: [...state.currentCases, runnerCase],
        })
      }

      // Otherwise parse as normal case
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

    describe(name: string, callback: Fn.AnyAny) {
      // Create child builder with inherited state
      const childBuilder = createBuilder({
        ...state,
        // Inherit parent's setup, providers, and mappers
        setupFactories: [...state.setupFactories],
        defaultOutputProvider: state.defaultOutputProvider,
        outputMapper: state.outputMapper,
        typeState: { ...state.typeState },
        // Fresh state for child
        currentCases: [],
        accumulatedGroups: [],
        nestedDescribeGroups: [],
        pendingDescribe: Option.none(),
      })

      // Execute callback to build child cases
      const resultBuilder = callback(childBuilder)

      // Extract child's final state
      const childState = resultBuilder._getState()

      // Flush child's cases to get final groups
      const flushedChild = flushCases(childState)

      // Create nested group with child's cases and groups
      const nestedGroup: TestGroup = {
        describe: Option.some(name),
        cases: [...flushedChild.currentCases],
        nestedGroups: [
          ...flushedChild.accumulatedGroups,
          ...flushedChild.nestedDescribeGroups,
        ],
      }

      // Return builder with nested group added
      return createBuilder({
        ...state,
        nestedDescribeGroups: [...state.nestedDescribeGroups, nestedGroup],
        // Type state merging happens at type level
      })
    },

    // Setup method
    onSetup(factory: () => object) {
      return createBuilder({
        ...state,
        setupFactories: [...state.setupFactories, factory],
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

      // Execute all accumulated groups (from .casesIn())
      for (const group of finalState.accumulatedGroups) {
        executeTests(
          fn as ((params: any) => any) | undefined,
          Option.getOrUndefined(group.describe),
          group.cases,
        )
      }

      // Execute all nested describe groups (from .describe(name, callback))
      for (const nestedGroup of finalState.nestedDescribeGroups) {
        executeNestedGroup(nestedGroup, fn as ((params: any) => any) | undefined)
      }
    },

    testEffect(fn: Fn.AnyAny): void {
      // Flush any remaining cases
      const finalState = flushCases(state)
      const layerOrFactory = Option.getOrUndefined(finalState.layerOrFactory)
      const layerType = Option.getOrUndefined(finalState.layerType)

      const effectWrapper = (params: any) => {
        const { n, input, output, ...restCtx } = params
        const effect = fn({ input, output, n, ...restCtx })
        const layer = layerType === 'static'
          ? layerOrFactory
          : (layerOrFactory as (testCase: any) => Layer.Layer<any>)({ input, output, ...params })

        const effectWithLayer = Effect.provide(effect, layer as any) as Effect.Effect<any, any, never>
        return Effect.runPromise(effectWithLayer)
      }

      // Execute with Effect wrapper (from .casesIn())
      for (const group of finalState.accumulatedGroups) {
        executeTests(
          effectWrapper,
          Option.getOrUndefined(group.describe),
          group.cases,
        )
      }

      // Execute nested describe groups (from .describe(name, callback))
      for (const nestedGroup of finalState.nestedDescribeGroups) {
        executeNestedGroup(nestedGroup, effectWrapper)
      }
    },
  }

  return builder
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
 *   .onOutput((partial, context) => ({ ...defaultUser, name: context.i[0], ...partial }))  // Transform expected output
 *   .cases(
 *     [['Alice'], { role: 'admin' }],    // Only specify what differs from defaults
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
 *   .casesAsArgs(
 *     '42',      // Returns: 42
 *     'hello',   // Returns: NaN
 *   )
 *   .test()
 *
 * // Validation functions - errors documented in snapshots
 * Test.on(Positive.from)
 *   .casesAsArgs(
 *     1, 10, 100,        // THEN RETURNS the value
 *     0, -1, -10,        // THEN THROWS "Value must be positive"
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
