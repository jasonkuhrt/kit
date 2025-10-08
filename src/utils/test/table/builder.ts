import type { Fn } from '#fn'
import { Array, Effect, Layer, Option } from 'effect'
import { expect, test } from 'vitest'
import type { CaseObject, CaseTuple } from './builder-types.js'
import {
  assertEffectEqual,
  createNestedDescribe,
  defaultSnapshotSerializer,
  formatSnapshotWithInput,
  generateMatrixCombinations,
  validateContextKeys,
} from './utils.js'

// ============================================================================
// Configuration & State Types
// ============================================================================

export interface Config {
  description?: string
  nameTemplate?: string
  only?: boolean
  skip?: boolean | string
  skipIf?: () => boolean
  concurrent?: boolean
  tags?: string[]
  matcher?: string
}

interface Group {
  describe: Option.Option<string>
  cases: any[] // Effect's Array module works with regular arrays
  nestedGroups?: Group[] // Nested describe blocks created via .describe(name, callback)
}

export interface State {
  fn: Option.Option<Fn.AnyAny>
  config: Config
  outputMapper: Option.Option<Fn.AnyAny>
  defaultOutputProvider: Option.Option<Fn.AnyAny>
  snapshotSerializer: Option.Option<(value: any, context: any) => string>
  pendingDescribe: Option.Option<string>
  accumulatedGroups: Group[] // Effect's Array module works with regular arrays
  currentCases: any[] // Effect's Array module works with regular arrays
  nestedDescribeGroups: Group[] // Nested describe blocks from .describe(name, callback)
  layerOrFactory: Option.Option<Layer.Layer<any> | ((testCase: any) => Layer.Layer<any>)>
  layerType: Option.Option<'static' | 'dynamic'>
  setupFactories: Array<() => object>
  matrixConfig: Option.Option<Record<string, readonly any[]>>
}

// ============================================================================
// Default State
// ============================================================================

export const defaultState: State = {
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
  setupFactories: [],
  matrixConfig: Option.none(),
}

// ============================================================================
// Functional Builder Implementation
// ============================================================================

export function create(state: State = defaultState): any {
  // Helper to flush current cases to accumulated groups
  const flushCases = (s: State): State => {
    if (s.currentCases.length > 0) {
      const group: Group = {
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

  // Parse case arguments helper for .case() method
  const parseCaseArgs = (args: any[]): any => {
    // If single argument and it's an object with 'input' or 'comment' property, it's object form
    if (
      args.length === 1 && typeof args[0] === 'object' && args[0] !== null
      && ('input' in args[0] || 'comment' in args[0])
    ) {
      return args[0] as CaseObject<any, any>
    }

    const fn = Option.getOrUndefined(state.fn)
    if (!fn) return args // Can't parse without function

    // For .on() mode, params are always passed as a tuple
    if (Array.isArray(args[0])) {
      const params = args[0] as any[]
      const hasOutput = args.length > 1
      const output = hasOutput ? args[1] : undefined

      // Build tuple case - no name variants
      if (hasOutput) {
        return [params, output] as CaseTuple<any, any>
      } else {
        return [params] as CaseTuple<any, any>
      }
    } else {
      // Direct params (not in array) - collect based on function arity
      const fnArity = fn.length
      const params = args.slice(0, fnArity)
      const hasOutput = args.length > fnArity
      const output = hasOutput ? args[fnArity] : undefined

      // Build tuple case - no name variants
      if (hasOutput) {
        return [params, output] as CaseTuple<any, any>
      } else {
        return [params] as CaseTuple<any, any>
      }
    }
  }

  // Recursive helper to execute nested describe groups
  const executeNestedGroup = (
    group: Group,
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
      createNestedDescribe(describeName, runGroupTests)
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
        const { comment, input, output, skip, skipIf, only, todo, tags, ...context } = obj

        // Generate name from comment or auto-generate from input/output
        const name = comment || (input !== undefined
          ? generateName(input, output)
          : 'test case')

        return {
          name,
          input: fn ? (input ?? []) : input, // Only default to [] for function mode
          output,
          skip: skip as boolean | string | undefined,
          skipIf: skipIf as (() => boolean) | undefined,
          only: only as boolean | undefined,
          todo: todo as boolean | string | undefined,
          tags: tags as string[] | undefined,
          ...context, // Preserve any additional properties like 'data'
        } as any
      }

      // Tuple form - [input, output?, context?]
      // Function mode and generic mode use same format for consistency
      const tuple = caseData as any[] // Use any[] to access optional 3rd element
      let input = tuple[0]
      const output = tuple[1]
      const contextObj = tuple[2] // Context is 3rd element

      // Function mode: wrap non-array inputs so they can be spread as parameters
      // Generic mode: keep input as-is (don't wrap)
      if (fn && !Array.isArray(input)) {
        input = [input]
      }

      // Extract comment from context if present
      const { comment, ...context } = (contextObj && typeof contextObj === 'object' && !Array.isArray(contextObj))
        ? contextObj
        : {}

      return {
        name: comment || generateName(input, output),
        input,
        output,
        ...context,
      }
    }

    const runTests = () => {
      // Get matrix combinations (or single empty combo if no matrix)
      const matrixCombinations = Option.isSome(state.matrixConfig)
        ? generateMatrixCombinations(Option.getOrUndefined(state.matrixConfig)!)
        : [{}]

      // For each matrix combination, run all test cases
      for (const matrixCombo of matrixCombinations) {
        for (const caseData of cases) {
          const {
            name: baseName,
            input,
            output,
            skip,
            skipIf,
            only,
            todo,
            tags,
            runner,
            isRunnerCase,
            ...testContext
          } = parseCase(
            caseData,
          )

          // Add matrix to context
          const fullContext = {
            ...testContext,
            ...(Object.keys(matrixCombo).length > 0 ? { matrix: matrixCombo } : {}),
          }

          // Generate test name with matrix info
          const name = Object.keys(matrixCombo).length > 0
            ? `${baseName} [matrix: ${
              Object.entries(matrixCombo)
                .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
                .join(', ')
            }]`
            : baseName

          // Validate that user context doesn't contain reserved keys
          validateContextKeys(fullContext, name)

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
                ...fullContext,
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
                const snapshotContext = { i: input, n: name, o: resolvedOutput, ...setupContext, ...fullContext }
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
              const context = { i: input, n: name, o: resolvedOutput, ...fullContext }
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
                    ...fullContext,
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
                  ...fullContext,
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
                const snapshotContext = { i: input, n: name, o: output, ...fullContext }
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
                const context = { i: input, n: name, o: output, ...fullContext }
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
                    ...fullContext,
                    ...vitestContext,
                  })
                  // Auto-snapshot if test returns a value
                  if (testResult !== undefined) {
                    const serializer = Option.getOrElse(state.snapshotSerializer, () => defaultSnapshotSerializer)
                    const snapshotContext = { i: input, n: name, o: output, ...setupContext, ...fullContext }
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
                ...fullContext,
                ...vitestContext,
              })
              const context = { i: input, n: name, o: output, ...setupContext, ...fullContext }
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
    }

    // Wrap in describe if description or describeBlock provided
    if (describeBlock) {
      createNestedDescribe(describeBlock, () => {
        if (state.config.description) {
          createNestedDescribe(state.config.description, runTests)
        } else {
          runTests()
        }
      })
    } else if (state.config.description) {
      createNestedDescribe(state.config.description, runTests)
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
      return create(state)
    },

    outputType() {
      return create(state)
    },

    outputDefault(provider: Fn.AnyAny) {
      return create({
        ...state,
        defaultOutputProvider: Option.some(provider),
      })
    },

    snapshotSerializer(serializer: (value: any, context: any) => string) {
      return create({
        ...state,
        snapshotSerializer: Option.some(serializer),
      })
    },

    onOutput(mapper: Fn.AnyAny) {
      // Output mapper for function mode
      return create({
        ...state,
        outputMapper: Option.some(mapper),
      })
    },

    contextType() {
      return create(state)
    },

    matrix(matrixConfig: Record<string, readonly any[]>) {
      return create({
        ...state,
        matrixConfig: Option.some(matrixConfig),
      })
    },

    // Function mode
    on(fn: Fn.AnyAny) {
      return create({
        ...state,
        fn: Option.some(fn),
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
      return create(flushCases(newState)) as any
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

        return create({
          ...state,
          currentCases: [...state.currentCases, runnerCase],
        })
      }

      // Otherwise parse as normal case
      const caseData = parseCaseArgs(args)
      return create({
        ...state,
        currentCases: [...state.currentCases, caseData],
      })
    },

    case$(caseObj: any) {
      // Add a single case in object form
      return create({
        ...state,
        currentCases: [...state.currentCases, caseObj],
      })
    },

    casesInput(...inputs: any[]) {
      // Wrap each input in snapshot tuple format [input]
      const cases = inputs.map(input => [input])
      return this.cases(...cases)
    },

    describeInputs(name: string, inputs: any[]) {
      // Wrap each input in snapshot tuple format [input]
      const cases = inputs.map(input => [input])
      return this.describe(name, cases)
    },

    // Configuration methods
    name(template: string) {
      return create({
        ...state,
        config: { ...state.config, nameTemplate: template },
      })
    },

    only() {
      return create({
        ...state,
        config: { ...state.config, only: true },
      })
    },

    skip(reason?: string) {
      return create({
        ...state,
        config: { ...state.config, skip: reason ?? true },
      })
    },

    skipIf(condition: () => boolean) {
      return create({
        ...state,
        config: { ...state.config, skipIf: condition },
      })
    },

    concurrent() {
      return create({
        ...state,
        config: { ...state.config, concurrent: true },
      })
    },

    tags(tags: string[]) {
      return create({
        ...state,
        config: { ...state.config, tags },
      })
    },

    onlyMatching(matcher: string) {
      return create({
        ...state,
        config: { ...state.config, matcher },
      })
    },

    describe(name: string, callbackOrCases: Fn.AnyAny | any[]) {
      // Check if second argument is array (direct cases) or function (callback)
      if (Array.isArray(callbackOrCases)) {
        // Direct cases array form - add as a new group with describe name
        const flushed = flushCases(state)
        const newState = {
          ...flushed,
          pendingDescribe: Option.some(name),
          currentCases: callbackOrCases,
        }
        return create(flushCases(newState))
      }

      // Callback form
      const callback = callbackOrCases as Fn.AnyAny
      // Create child builder with inherited state
      const childBuilder = create({
        ...state,
        // Inherit parent's setup, providers, and mappers
        setupFactories: [...state.setupFactories],
        defaultOutputProvider: state.defaultOutputProvider,
        outputMapper: state.outputMapper,
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
      const nestedGroup: Group = {
        describe: Option.some(name),
        cases: [...flushedChild.currentCases],
        nestedGroups: [
          ...flushedChild.accumulatedGroups,
          ...flushedChild.nestedDescribeGroups,
        ],
      }

      // Return builder with nested group added
      return create({
        ...state,
        nestedDescribeGroups: [...state.nestedDescribeGroups, nestedGroup],
        // Type state merging happens at type level
      })
    },

    // Setup method
    onSetup(factory: () => object) {
      return create({
        ...state,
        setupFactories: [...state.setupFactories, factory],
      })
    },

    // Layer methods
    layer(layer: Layer.Layer<any>) {
      return create({
        ...state,
        layerOrFactory: Option.some(layer),
        layerType: Option.some('static' as const),
      })
    },

    layerEach(factory: (testCase: any) => Layer.Layer<any>) {
      return create({
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
