import { Effect, Layer } from 'effect'
import { describe, test } from 'vitest'
import type { CaseTodo, SuiteCase, TestCase } from './case.js'

/**
 * Creates Effect-based test suites with automatic layer provision and Effect execution.
 *
 * This curried function enables front-loading layers while constraining test functions
 * to return Effects. Each test case is automatically wrapped in vitest's test framework
 * with proper error handling, skip/todo support, and Effect execution.
 *
 * **Key Features:**
 * - Type-safe test functions that must return Effects
 * - Automatic layer provision via `Effect.provide`
 * - Full support for todo, skip, skipIf, and only test cases
 * - Perfect type inference for test case properties
 * - Natural parameter destructuring in test functions
 *
 * @example Basic usage with single layer and i/o pattern
 * ```typescript
 * type LoadCase = {
 *   i: Config
 *   o: { result: string | null }
 * }
 *
 * const testWithSchema = Test.suiteWithLayers(TestLayers.schema)
 *
 * testWithSchema<LoadCase>('Schema operations', [
 *   { name: 'no config', i: {}, o: { result: null } },
 *   { name: 'with config', i: { enabled: true }, o: { result: 'loaded' } },
 * ], ( i, o ) => Effect.gen(function* () {
 *   const result = yield* Schema.loadOrNull(i)  // Schema service available
 *   expect(result).toEqual(o.result)
 * }))
 * ```
 *
 * @example Multiple layers with complex requirements
 * ```typescript
 * type ApiTestCase = {
 *   i: { endpoint: string; payload: { id: string } }
 *   o: { status: number }
 *   data: { timeout: number }
 * }
 *
 * const testIntegration = Test.suiteWithLayers(
 *   Layer.merge(TestLayers.database, TestLayers.fileSystem, TestLayers.httpClient)
 * )
 *
 * testIntegration<ApiTestCase>('API integration', cases,
 *   ({ i, o, data }) => Effect.gen(function* () {
 *     // All services from merged layers are available
 *     const dbData = yield* Database.findById(i.payload.id)
 *     const file = yield* FileSystem.readFile(dbData.configPath)
 *     const response = yield* HttpClient.post(i.endpoint,
 *       { ...i.payload, config: file },
 *       { timeout: data.timeout }
 *     )
 *     expect(response.status).toBe(o.status)
 *   })
 * )
 * ```
 *
 * @example With test case modifiers
 * ```typescript
 * type TestCase = {
 *   i: string
 *   o: string
 * }
 *
 * testWithLayers<TestCase>('feature tests', [
 *   { name: 'working case', i: 'valid', o: 'output' },
 *   { name: 'todo case', todo: 'Need to implement validation' },
 *   { name: 'skipped case', i: 'flaky', o: 'result', skip: 'Flaky on CI' },
 *   { name: 'focused case', i: 'debug', o: 'test', only: true },
 * ], ( i, o ) => Effect.gen(function* () {
 *   const result = yield* processInput(i)
 *   expect(result).toBe(o)
 * }))
 * ```
 *
 * @example Error handling in Effects
 * ```typescript
 * type ErrorCase = {
 *   i: string
 *   custom: { shouldFail: boolean }
 * }
 *
 * testWithLayers<ErrorCase>('error scenarios', cases,
 *   ({ i, shouldFail }) => Effect.gen(function* () {
 *     if (shouldFail) {
 *       // Effect failures are properly caught and reported
 *       yield* Effect.fail(new Error('Expected failure'))
 *     } else {
 *       const result = yield* processInput(i)
 *       expect(result).toBeDefined()
 *     }
 *   })
 * )
 * ```
 *
 * @example Typed error handling with withErrors
 * ```typescript
 * class ValidationError extends Error {
 *   constructor(message: string) { super(message) }
 * }
 *
 * type UserCase = {
 *   i: User
 *   custom: { shouldValidate: boolean }
 * }
 *
 * // Use .withErrors<T>() for precise error type constraints
 * testWithLayers.withErrors<ValidationError>()<UserCase>('validation tests', cases,
 *   ({ i, shouldValidate }) => Effect.gen(function* () {
 *     if (!shouldValidate) {
 *       // Type-safe - can only fail with ValidationError
 *       yield* Effect.fail(new ValidationError('Invalid user'))
 *     }
 *     const result = yield* validateUser(i)
 *     expect(result.isValid).toBe(true)
 *   })
 * )
 * ```
 *
 * @template $Requirements - Context requirements that the layers parameter must satisfy
 * @param layers - Layer providing services/context required by test Effects
 * @returns Curried function that accepts test suite parameters and creates the suite
 *
 * @remarks
 * **Two API variants available:**
 * - **Simple**: `testWithLayers<$Spec>(description, cases, testFn)` - error types inferred as `any`
 * - **Typed**: `testWithLayers.withErrors<$Error>()<$Spec>(description, cases, testFn)` - precise error types
 *
 * **Type signatures:**
 * - Main function: Only `$Spec` type parameter required
 * - WithErrors function: `$Error` type parameter for error constraint, then `$Spec` parameter
 * - Test functions return `Effect<void, $Error, $Requirements>`
 * - Uses 3-parameter pattern for test specification: $I, $O, $Custom
 *
 * **Implementation details:**
 * - All test case properties available with proper type inference
 * - Effects executed with `Effect.runPromise` for vitest compatibility
 * - Layer provision automatic via `Effect.provide(effect, layers)`
 * - Full support for Test.Case features (skip, todo, only, skipIf, tags)
 * - Both APIs share the same underlying implementation for consistency
 */
export function suiteWithLayers<$Requirements>(
  layers: Layer.Layer<$Requirements>,
) {
  const createSuite = <$I, $O, $Custom = {}, $Error = any>(
    description: string,
    cases: (TestCase<$I, $O, $Custom> | CaseTodo)[],
    testFn: (testCase: SuiteCase<$I, $O, $Custom>) => Effect.Effect<void, $Error, $Requirements>,
  ): void => {
    describe(description, () => {
      // Check if any cases have 'only' set
      const hasOnly = cases.some(c => 'only' in c && c.only === true)
      const viTestFn = hasOnly ? test.only : test

      viTestFn.for<TestCase<$I, $O, $Custom> | CaseTodo>(cases)('$name', async (caseInput, context) => {
        if ('todo' in caseInput) {
          const { todo } = caseInput
          context.skip(typeof todo === 'string' ? todo : undefined)
          return
        }

        const filledCase = caseInput as SuiteCase<$I, $O, $Custom>

        // Handle skip
        if (filledCase.skip) {
          context.skip(typeof filledCase.skip === 'string' ? filledCase.skip : undefined)
          return
        }

        // Handle skipIf
        if (filledCase.skipIf?.()) {
          context.skip('Skipped by condition')
          return
        }

        // If we're using test.only, skip cases that don't have only: true
        if (hasOnly && !filledCase.only) {
          context.skip('Skipped - focusing on only tests')
          return
        }

        // Execute the Effect-based test
        const effect = testFn(filledCase)
        const effectWithLayers = Effect.provide(effect, layers)
        await Effect.runPromise(effectWithLayers)
      })
    })
  }

  // Main API - simple version with inferred error types
  const suite = <$I, $O, $Custom = {}>(
    description: string,
    cases: (TestCase<$I, $O, $Custom> | CaseTodo)[],
    testFn: (testCase: SuiteCase<$I, $O, $Custom>) => Effect.Effect<void, any, $Requirements>,
  ): void => {
    return createSuite<$I, $O, $Custom, any>(description, cases, testFn)
  }

  // Extended API - typed error version
  suite.withErrors = <$Error>() =>
  <$I, $O, $Custom = {}>(
    description: string,
    cases: (TestCase<$I, $O, $Custom> | CaseTodo)[],
    testFn: (testCase: SuiteCase<$I, $O, $Custom>) => Effect.Effect<void, $Error, $Requirements>,
  ): void => {
    return createSuite<$I, $O, $Custom, $Error>(description, cases, testFn)
  }

  return suite
}

/**
 * Creates Effect-based test suites with dynamic layer creation per test case.
 *
 * This function enables creating test-specific layers based on each test case's data,
 * eliminating the need to manually create and provide layers within test bodies.
 *
 * **Key Features:**
 * - Dynamic layer creation based on test case data
 * - Automatic layer provision for each test
 * - Separation of layer creation from test logic
 * - Full support for Test.Case features (skip, todo, only, etc.)
 * - Type-safe throughout with proper inference
 * - Uses 3-parameter pattern for test specification: $I, $O, $Custom
 *
 * @example Basic usage with mock FileSystem
 * ```typescript
 * type TestCase = {
 *   data: string[]
 *   o: { path: string | null }
 * }
 *
 * Test.Table.suiteWithDynamicLayers<TestCase>({
 *   description: 'file operations',
 *   cases: [
 *     { name: 'finds file', data: ['/test/a.json'], o: { path: '/test/a.json' } },
 *     { name: 'no files', data: [], o: { path: null } }
 *   ],
 *   createLayer: ({ data }) => Layer.mock(FileSystem.FileSystem, {
 *     exists: (path) => Effect.succeed(data.includes(path))
 *   }),
 *   test: ({ o }) => Effect.gen(function* () {
 *     const result = yield* checkFile()
 *     expect(result).toEqual(o.path)
 *   })
 * })
 * ```
 *
 * @example With complex layer requirements
 * ```typescript
 * type ApiTestCase = {
 *   i: { url: string }
 *   o: { status: number }
 *   data: { mockResponses: Record<string, any> }
 * }
 *
 * Test.Table.suiteWithDynamicLayers<ApiTestCase>({
 *   description: 'API tests',
 *   cases,
 *   createLayer: ({ data }) =>
 *     Layer.merge(
 *       Layer.mock(HttpClient, {
 *         get: (url) => Effect.succeed(data.mockResponses[url] ?? { status: 404 })
 *       }),
 *       Layer.succeed(Logger, ConsoleLogger)
 *     ),
 *   test: ( i, o ) => Effect.gen(function* () {
 *     const response = yield* apiCall(i.url)
 *     expect(response.status).toBe(o.status)
 *   })
 * })
 * ```
 */
export function suiteWithDynamicLayers<$I, $O, $Custom = {}, $Requirements = any, $Error = any>(
  config: {
    description: string
    cases: (TestCase<$I, $O, $Custom> | CaseTodo)[]
    layer: (testCase: SuiteCase<$I, $O, $Custom>) => Layer.Layer<$Requirements>
    test: (testCase: SuiteCase<$I, $O, $Custom>) => Effect.Effect<void, $Error, $Requirements>
  },
): void {
  const { description, cases, layer: createLayer, test: testFn } = config

  describe(description, () => {
    // Check if any cases have 'only' set
    const hasOnly = cases.some(c => 'only' in c && c.only === true)
    const viTestFn = hasOnly ? test.only : test

    viTestFn.for<TestCase<$I, $O, $Custom> | CaseTodo>(cases)('$name', async (caseInput, context) => {
      if ('todo' in caseInput) {
        const { todo } = caseInput
        context.skip(typeof todo === 'string' ? todo : undefined)
        return
      }

      const filledCase = caseInput as SuiteCase<$I, $O, $Custom>

      // Handle skip
      if (filledCase.skip) {
        context.skip(typeof filledCase.skip === 'string' ? filledCase.skip : undefined)
        return
      }

      // Handle skipIf
      if (filledCase.skipIf?.()) {
        context.skip('Skipped by condition')
        return
      }

      // If we're using test.only, skip cases that don't have only: true
      if (hasOnly && !filledCase.only) {
        context.skip('Skipped - focusing on only tests')
        return
      }

      // Create the layer for this specific test case
      const layer = createLayer(filledCase)

      // Execute the Effect-based test with the dynamically created layer
      const effect = testFn(filledCase)
      const effectWithLayer = Effect.provide(effect, layer)
      await Effect.runPromise(effectWithLayer)
    })
  })
}
