import { describe, type TestContext } from 'vitest'
import type { Case, CaseFilled } from './case.js'
import { each } from './each.js'

interface Suite extends SuiteBase {
  only: SuiteBase
}

// export function suite<$Case extends object>(
//   description: string,
//   cases: Case<$Case>[],
//   runner: (caseInput: CaseFilled & $Case, context: TestContext) => void | Promise<void>
// ): void
// export function suite<$Case extends object>(
//   description: string,
//   nameTemplate: string,
//   cases: Case<$Case>[],
//   runner: (caseInput: CaseFilled & $Case, context: TestContext) => void | Promise<void>
// ): void
export const suite: Suite = <$Case extends object>(
  description: string,
  arg2: string | Case<$Case>[],
  arg3: Case<$Case>[] | ((caseInput: CaseFilled & $Case, context: TestContext) => void | Promise<void>),
  arg4?: (caseInput: CaseFilled & $Case, context: TestContext) => void | Promise<void>,
) => {
  describe(description, () => {
    if (typeof arg2 === 'string') {
      // Called with custom name template
      each(arg2, arg3 as Case<$Case>[], arg4!)
    } else {
      // Called without custom name template
      each(arg2, arg3 as (caseInput: CaseFilled & $Case, context: TestContext) => void | Promise<void>)
    }
  })
}

suite.only = <$Case extends object>(
  description: string,
  arg2: string | Case<$Case>[],
  arg3: Case<$Case>[] | ((caseInput: CaseFilled & $Case, context: TestContext) => void | Promise<void>),
  arg4?: (caseInput: CaseFilled & $Case, context: TestContext) => void | Promise<void>,
) => {
  describe.only(description, () => {
    if (typeof arg2 === 'string') {
      // Called with custom name template
      each(arg2, arg3 as Case<$Case>[], arg4!)
    } else {
      // Called without custom name template
      each(arg2, arg3 as (caseInput: CaseFilled & $Case, context: TestContext) => void | Promise<void>)
    }
  })
}

/**
 * Creates a test suite that combines describe and Test.each for cleaner table-driven tests.
 *
 * This reduces boilerplate by automatically wrapping Test.each in a describe block,
 * eliminating the need for separate interface declarations and nested structures.
 *
 * @example Basic usage
 * ```typescript
 * // dprint-ignore  <-- Place directly above Test.suite for column alignment
 * Test.suite<{ input: string; expected: string }>('string transformations', [
 *   { name: 'uppercase', input: 'hello', expected: 'HELLO' },
 *   { name: 'lowercase', input: 'WORLD', expected: 'world' },
 * ], ({ input, expected }) => {
 *   expect(transform(input)).toBe(expected)
 * })
 * ```
 *
 * @example With custom name template and column alignment
 * ```typescript
 * interface MathCase {
 *   a: number
 *   b: number
 *   expected: number
 * }
 *
 * // dprint-ignore
 * Test.suite<MathCase>('math operations', '$a + $b = $expected', [
 *   { name: 'addition',     a: 2, b: 3, expected: 5 },
 *   { name: 'subtraction',  a: 5, b: 3, expected: 2 },
 * ], ({ a, b, expected }) => {
 *   expect(calculate(a, b)).toBe(expected)
 * })
 * ```
 *
 * @example With nested expected property pattern (recommended for complex cases)
 * ```typescript
 * interface ComplexCase {
 *   input: string
 *   transform: 'upper' | 'lower'
 *   locale: string
 *   options: { trim: boolean; normalize: boolean }
 *   expected: {
 *     result: string
 *     length: number
 *     metadata: { processed: boolean; warnings?: string[] }
 *   }
 * }
 *
 * // Using expected property pattern keeps expectations together on one line
 * Test.suite<ComplexCase>('complex transformations', [
 *   { name: 'uppercase with trimming',
 *     input: '  hello  ',
 *     transform: 'upper',
 *     locale: 'en-US',
 *     options: { trim: true, normalize: false },
 *     expected: { result: 'HELLO', length: 5, metadata: { processed: true } } },
 *   { name: 'lowercase normalized',
 *     input: 'WORLD',
 *     transform: 'lower',
 *     locale: 'de-DE',
 *     options: { trim: false, normalize: true },
 *     expected: { result: 'world', length: 5, metadata: { processed: true, warnings: ['normalized'] } } },
 * ], ({ input, transform, locale, options, expected }) => {
 *   const result = complexTransform(input, transform, locale, options)
 *   expect(result.value).toBe(expected.result)
 *   expect(result.length).toBe(expected.length)
 *   expect(result.metadata).toEqual(expected.metadata)
 * })
 * ```
 *
 * @example Inline case typing with column alignment
 * ```typescript
 * Test.suite<{
 *   input: string
 *   expected: number
 * }>(
 *   'string length',
 *   // dprint-ignore
 *   [
 *     { name: 'short string',    input: 'hi',     expected: 2 },
 *     { name: 'medium string',   input: 'hello',  expected: 5 },
 *     { name: 'long string',     input: 'world!', expected: 6 },
 *   ],
 *   ({ input, expected }) => {
 *     expect(input.length).toBe(expected)
 *   }
 * )
 * ```
 *
 * @example With todo and skip cases
 * ```typescript
 * Test.suite<{ feature: string }>('feature tests', [
 *   { name: 'implemented feature', feature: 'login' },
 *   { name: 'upcoming feature', todo: 'Not implemented yet' },
 *   { name: 'flaky test', feature: 'api', skip: 'Flaky on CI' },
 * ], ({ feature }) => {
 *   expect(isFeatureEnabled(feature)).toBe(true)
 * })
 * ```
 *
 * @remarks
 * - Type parameter is mandatory to encourage explicit typing
 * - Supports all Test.each features (todo, skip, only, etc.)
 * - Automatically handles describe block creation
 * - Name template is optional - defaults to using the 'name' property
 * - Best practice: Use an `expected` property to group all expected values together,
 *   especially when test cases have many fields and span multiple lines. This keeps
 *   the expected outcomes clearly visible on a single line per case.
 * - For simple types, prefer inline typing with column alignment over separate interface
 *   declarations for better readability.
 * - Place `// dprint-ignore` comment directly before the array literal only, not before
 *   the entire Test.suite call. This preserves column alignment for test cases while
 *   allowing normal formatting for the rest of the code.
 */
interface SuiteBase {
     <$Case extends object>(
       description: string,
       cases: Case<$Case>[],
       runner: (caseInput: CaseFilled & $Case, context: TestContext) => void | Promise<void>
     ): void
     <$Case extends object>(
       description: string,
       nameTemplate: string,
       cases: Case<$Case>[],
       runner: (caseInput: CaseFilled & $Case, context: TestContext) => void | Promise<void>
     ): void
   }
