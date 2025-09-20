import { Effect, Layer } from 'effect'
import { describe, test } from 'vitest'
import type { Case, CaseFilled } from './case.js'

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
 * @example Basic usage with single layer
 * ```typescript
 * interface LoadCase {
 *   config: Config
 *   expected: { result: string | null }
 * }
 *
 * const testWithSchema = Test.suiteWithLayers(TestLayers.schema)
 *
 * testWithSchema<LoadCase>('Schema operations', [
 *   { name: 'no config', config: {}, expected: { result: null } },
 *   { name: 'with config', config: { enabled: true }, expected: { result: 'loaded' } },
 * ], ({ config, expected }) => Effect.gen(function* () {
 *   const result = yield* Schema.loadOrNull(config)  // Schema service available
 *   expect(result).toEqual(expected.result)
 * }))
 * ```
 *
 * @example Multiple layers with complex requirements
 * ```typescript
 * const testIntegration = Test.suiteWithLayers(
 *   Layer.merge(TestLayers.database, TestLayers.fileSystem, TestLayers.httpClient)
 * )
 *
 * testIntegration<ApiTestCase>('API integration', cases,
 *   ({ endpoint, payload, expected }) => Effect.gen(function* () {
 *     // All services from merged layers are available
 *     const data = yield* Database.findById(payload.id)
 *     const file = yield* FileSystem.readFile(data.configPath)
 *     const response = yield* HttpClient.post(endpoint, { ...payload, config: file })
 *     expect(response.status).toBe(expected.status)
 *   })
 * )
 * ```
 *
 * @example With test case modifiers
 * ```typescript
 * testWithLayers<TestCase>('feature tests', [
 *   { name: 'working case', input: 'valid', expected: 'output' },
 *   { name: 'todo case', todo: 'Need to implement validation' },
 *   { name: 'skipped case', input: 'flaky', expected: 'result', skip: 'Flaky on CI' },
 *   { name: 'focused case', input: 'debug', expected: 'test', only: true },
 * ], ({ input, expected }) => Effect.gen(function* () {
 *   const result = yield* processInput(input)
 *   expect(result).toBe(expected)
 * }))
 * ```
 *
 * @example Error handling in Effects
 * ```typescript
 * testWithLayers<ErrorCase>('error scenarios', cases,
 *   ({ input, shouldFail }) => Effect.gen(function* () {
 *     if (shouldFail) {
 *       // Effect failures are properly caught and reported
 *       yield* Effect.fail(new Error('Expected failure'))
 *     } else {
 *       const result = yield* processInput(input)
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
 * // Use .withErrors<T>() for precise error type constraints
 * testWithLayers.withErrors<ValidationError>()<UserCase>('validation tests', cases,
 *   ({ user, shouldValidate }) => Effect.gen(function* () {
 *     if (!shouldValidate) {
 *       // Type-safe - can only fail with ValidationError
 *       yield* Effect.fail(new ValidationError('Invalid user'))
 *     }
 *     const result = yield* validateUser(user)
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
 * - **Simple**: `testWithLayers<$Case>(description, cases, testFn)` - error types inferred as `any`
 * - **Typed**: `testWithLayers.withErrors<$Error>()<$Case>(description, cases, testFn)` - precise error types
 *
 * **Type signatures:**
 * - Main function: Only `$Case` type parameter required
 * - WithErrors function: `$Error` type parameter for error constraint, then `$Case` parameter
 * - Test functions return `Effect<void, $Error, $Requirements>`
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
  const createSuite = <$Case extends object, $Error = any>(
    description: string,
    cases: Case<$Case>[],
    testFn: (testCase: CaseFilled & $Case) => Effect.Effect<void, $Error, $Requirements>,
  ): void => {
    describe(description, () => {
      // Check if any cases have 'only' set
      const hasOnly = cases.some(c => 'only' in c && c.only === true)
      const viTestFn = hasOnly ? test.only : test

      viTestFn.for<Case<$Case>>(cases)('$name', async (caseInput, context) => {
        if ('todo' in caseInput) {
          const { todo } = caseInput
          context.skip(typeof todo === 'string' ? todo : undefined)
          return
        }

        const filledCase = caseInput as CaseFilled & $Case

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
  const suite = <$Case extends object>(
    description: string,
    cases: Case<$Case>[],
    testFn: (testCase: CaseFilled & $Case) => Effect.Effect<void, any, $Requirements>,
  ): void => {
    return createSuite<$Case, any>(description, cases, testFn)
  }

  // Extended API - typed error version
  suite.withErrors = <$Error>() =>
  <$Case extends object>(
    description: string,
    cases: Case<$Case>[],
    testFn: (testCase: CaseFilled & $Case) => Effect.Effect<void, $Error, $Requirements>,
  ): void => {
    return createSuite<$Case, $Error>(description, cases, testFn)
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
 *
 * @example Basic usage with mock FileSystem
 * ```typescript
 * interface TestCase {
 *   data: string[]
 *   expected: { path: string | null }
 * }
 *
 * Test.Table.suiteWithDynamicLayers<TestCase>({
 *   description: 'file operations',
 *   cases: [
 *     { name: 'finds file', data: ['/test/a.json'], expected: { path: '/test/a.json' } },
 *     { name: 'no files', data: [], expected: { path: null } }
 *   ],
 *   createLayer: ({ data }) => Layer.mock(FileSystem.FileSystem, {
 *     exists: (path) => Effect.succeed(data.includes(path))
 *   }),
 *   test: ({ expected }) => Effect.gen(function* () {
 *     const result = yield* checkFile()
 *     expect(result).toEqual(expected.path)
 *   })
 * })
 * ```
 *
 * @example With complex layer requirements
 * ```typescript
 * interface ApiTestCase {
 *   mockResponses: Record<string, any>
 *   expected: { status: number }
 * }
 *
 * Test.Table.suiteWithDynamicLayers<ApiTestCase>({
 *   description: 'API tests',
 *   cases,
 *   createLayer: ({ mockResponses }) =>
 *     Layer.merge(
 *       Layer.mock(HttpClient, {
 *         get: (url) => Effect.succeed(mockResponses[url] ?? { status: 404 })
 *       }),
 *       Layer.succeed(Logger, ConsoleLogger)
 *     ),
 *   test: ({ expected }) => Effect.gen(function* () {
 *     const response = yield* apiCall()
 *     expect(response.status).toBe(expected.status)
 *   })
 * })
 * ```
 */
export function suiteWithDynamicLayers<$Case extends object, $Requirements = any, $Error = any>(
  config: {
    description: string
    cases: Case<$Case>[]
    layer: (testCase: CaseFilled & $Case) => Layer.Layer<$Requirements>
    test: (testCase: CaseFilled & $Case) => Effect.Effect<void, $Error, $Requirements>
  },
): void {
  const { description, cases, layer: createLayer, test: testFn } = config

  describe(description, () => {
    // Check if any cases have 'only' set
    const hasOnly = cases.some(c => 'only' in c && c.only === true)
    const viTestFn = hasOnly ? test.only : test

    viTestFn.for<Case<$Case>>(cases)('$name', async (caseInput, context) => {
      if ('todo' in caseInput) {
        const { todo } = caseInput
        context.skip(typeof todo === 'string' ? todo : undefined)
        return
      }

      const filledCase = caseInput as CaseFilled & $Case

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
// /**
//  * Test function that returns an Effect for use with Effect-based test suites.
//  *
//  * The function receives a test case (merged with CaseFilled properties) and must return
//  * an Effect that performs the test logic. The Effect will be automatically executed
//  * with appropriate layers and error handling.
//  *
//  * @template $Case - The test case type containing input data and expected results
//  * @template $Error - The error type the Effect can fail with (typically never or Error)
//  * @template $Requirements - The context requirements that must be satisfied by layers
//  *
//  * @param testCase - Test case data merged with Test.CaseFilled properties (name, skip, etc.)
//  * @returns Effect that performs the test, typically yielding void on success
//  */
// export type EffectTestFn<$Case, $Error, $Requirements> = (
//   testCase: CaseFilled & $Case,
// ) => Effect.Effect<void, $Error, $Requirements>
