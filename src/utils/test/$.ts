/**
 * Enhanced test utilities for parameterized testing with Vitest.
 *
 * Provides a declarative API for table-driven tests with built-in support for
 * todo and skip cases, reducing boilerplate and improving test maintainability.
 *
 * @example Basic usage with formatting best practices
 * ```typescript
 * interface MathCase {
 *   a: number
 *   b: number
 *   expected: number
 * }
 *
 * // dprint-ignore
 * const cases: Test.Case<MathCase>[] = [
 *   { name: '2 + 2 = 4',         a: 2, b: 2, expected: 4 },
 *   { name: '3 + 5 = 8',         a: 3, b: 5, expected: 8 },
 *   { name: 'negative numbers',  todo: 'Not implemented yet' },
 * ]
 *
 * Test.each(cases, (case_) => {
 *   const { a, b, expected } = case_
 *   expect(add(a, b)).toBe(expected)
 * })
 * ```
 *
 * @example Column formatting for complex cases
 * ```typescript
 * interface ComplexCase {
 *   input: string
 *   transform: 'upper' | 'lower' | 'capitalize'
 *   expected: string
 *   description?: string
 * }
 *
 * // dprint-ignore - Preserves column alignment for readability
 * const cases: Test.Case<ComplexCase>[] = [
 *   { name: 'uppercase transform',
 *     input: 'hello', transform: 'upper', expected: 'HELLO' },
 *   { name: 'lowercase transform with long description',
 *     input: 'WORLD', transform: 'lower', expected: 'world',
 *     description: 'This is a very long description that would break alignment' },
 *   { name: 'capitalize first letter',
 *     input: 'test', transform: 'capitalize', expected: 'Test' },
 * ]
 * ```
 *
 * @example With skip cases
 * ```typescript
 * const cases: Test.Case<MyCase>[] = [
 *   { name: 'normal case', input: 'foo', expected: 'bar' },
 *   { name: 'edge case', input: '', expected: '', skip: 'Flaky on CI' },
 *   { name: 'future feature', todo: true },
 * ]
 * ```
 *
 * @example With advanced features
 * ```typescript
 * const cases: Test.Case<TestData>[] = [
 *   { name: 'basic test', data: 'foo', expected: 'bar' },
 *   { name: 'windows only', data: 'baz', expected: 'qux',
 *     skipIf: () => process.platform !== 'win32' },
 *   { name: 'focus on this', data: 'test', expected: 'result', only: true },
 *   { name: 'integration test', data: 'api', expected: 'response',
 *     tags: ['integration', 'api'] },
 * ]
 * ```
 */
export * as Test from './$$.js'
