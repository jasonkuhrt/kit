import { describe, type TestContext } from 'vitest'
import type { CaseTodo, SuiteCase, TestCase } from './case.js'
import { each } from './each.js'

interface Suite extends SuiteBase {
  only: SuiteBase
}

/**
 * Creates a test suite that combines describe and Test.each for cleaner table-driven tests.
 *
 * This reduces boilerplate by automatically wrapping Test.each in a describe block,
 * eliminating the need for separate interface declarations and nested structures.
 *
 * @example Basic usage with i/o
 * ```typescript
 * // dprint-ignore  <-- Place directly above Test.suite for column alignment
 * Test.suite<{ i: string; o: string }>('string transformations', [
 *   { name: 'uppercase', i: 'hello', o: 'HELLO' },
 *   { name: 'lowercase', i: 'WORLD', o: 'world' },
 * ], ({ i, o }) => {
 *   expect(transform(i)).toBe(o)
 * })
 * ```
 *
 * @example With custom name template and column alignment
 * ```typescript
 * type MathCase = {
 *   i: { a: number; b: number }
 *   o: number
 * }
 *
 * // dprint-ignore
 * Test.suite<MathCase>('math operations', '$i.a + $i.b = $o', [
 *   { name: 'addition',     i: { a: 2, b: 3 }, o: 5 },
 *   { name: 'subtraction',  i: { a: 5, b: 3 }, o: 2 },
 * ], ({ i, o }) => {
 *   expect(calculate(i.a, i.b)).toBe(o)
 * })
 * ```
 *
 * @example With data and custom properties
 * ```typescript
 * type ComplexCase = {
 *   i: string
 *   o: { result: string; length: number }
 *   data: { locale: string; options: { trim: boolean } }
 *   custom: { category: 'transform' | 'validate' }
 * }
 *
 * Test.suite<ComplexCase>('complex transformations', [
 *   { name: 'uppercase with trimming',
 *     i: '  hello  ',
 *     o: { result: 'HELLO', length: 5 },
 *     data: { locale: 'en-US', options: { trim: true } },
 *     category: 'transform' },
 *   { name: 'lowercase validation',
 *     i: 'WORLD',
 *     o: { result: 'world', length: 5 },
 *     data: { locale: 'de-DE', options: { trim: false } },
 *     category: 'validate' },
 * ], ({ i, o, data, category }) => {
 *   const result = complexTransform(i, data.locale, data.options)
 *   expect(result.value).toBe(o.result)
 *   expect(result.length).toBe(o.length)
 *   expect(result.category).toBe(category)
 * })
 * ```
 *
 * @example Inline case typing with column alignment
 * ```typescript
 * Test.suite<{
 *   i: string
 *   o: number
 * }>(
 *   'string length',
 *   // dprint-ignore
 *   [
 *     { name: 'short string',    i: 'hi',     o: 2 },
 *     { name: 'medium string',   i: 'hello',  o: 5 },
 *     { name: 'long string',     i: 'world!', o: 6 },
 *   ],
 *   ({ i, o }) => {
 *     expect(i.length).toBe(o)
 *   }
 * )
 * ```
 *
 * @example With todo and skip cases
 * ```typescript
 * Test.suite<{ i: string; o: boolean }>('feature tests', [
 *   { name: 'implemented feature', i: 'login', o: true },
 *   { name: 'upcoming feature', todo: 'Not implemented yet' },
 *   { name: 'flaky test', i: 'api', o: false, skip: 'Flaky on CI' },
 * ], ({ i, o }) => {
 *   expect(isFeatureEnabled(i)).toBe(o)
 * })
 * ```
 *
 * @remarks
 * - Type parameter defines the test specification with optional i/o/data/custom properties
 * - Supports all Test.each features (todo, skip, only, etc.)
 * - Automatically handles describe block creation
 * - Name template is optional - defaults to using the 'name' property
 * - Best practice: Use 'i' for inputs, 'o' for expected outputs, 'data' for test metadata,
 *   and 'custom' for any additional user-defined properties
 * - For simple types, prefer inline typing with column alignment over separate type
 *   declarations for better readability.
 * - Place `// dprint-ignore` comment directly before the array literal only, not before
 *   the entire Test.suite call. This preserves column alignment for test cases while
 *   allowing normal formatting for the rest of the code.
 */
export const suite: Suite = <$I, $O, $Custom = {}>(
  description: string,
  arg2: string | (TestCase<$I, $O, $Custom> | CaseTodo)[],
  arg3: (TestCase<$I, $O, $Custom> | CaseTodo)[] | ((caseInput: SuiteCase<$I, $O, $Custom>, context: TestContext) => void | Promise<void>),
  arg4?: (caseInput: SuiteCase<$I, $O, $Custom>, context: TestContext) => void | Promise<void>,
) => {
  describe(description, () => {
    if (typeof arg2 === 'string') {
      // Called with custom name template
      each(arg2, arg3 as any, arg4!)
    } else {
      // Called without custom name template
      each(arg2 as any, arg3 as (caseInput: SuiteCase<$I, $O, $Custom>, context: TestContext) => void | Promise<void>)
    }
  })
}

suite.only = <$I, $O, $Custom = {}>(
  description: string,
  arg2: string | (TestCase<$I, $O, $Custom> | CaseTodo)[],
  arg3:
    | (TestCase<$I, $O, $Custom> | CaseTodo)[]
    | ((caseInput: SuiteCase<$I, $O, $Custom>, context: TestContext) => void | Promise<void>),
  arg4?: (caseInput: SuiteCase<$I, $O, $Custom>, context: TestContext) => void | Promise<void>,
) => {
  describe.only(description, () => {
    if (typeof arg2 === 'string') {
      // Called with custom name template
      each(arg2, arg3 as any, arg4!)
    } else {
      // Called without custom name template
      each(arg2 as any, arg3 as (caseInput: SuiteCase<$I, $O, $Custom>, context: TestContext) => void | Promise<void>)
    }
  })
}

interface SuiteBase {
  <$I, $O, $Custom = {}>(
    description: string,
    cases: (TestCase<$I, $O, $Custom> | CaseTodo)[],
    runner: (caseInput: SuiteCase<$I, $O, $Custom>, context: TestContext) => void | Promise<void>,
  ): void
  <$I, $O, $Custom = {}>(
    description: string,
    nameTemplate: string,
    cases: (TestCase<$I, $O, $Custom> | CaseTodo)[],
    runner: (caseInput: SuiteCase<$I, $O, $Custom>, context: TestContext) => void | Promise<void>,
  ): void
}
