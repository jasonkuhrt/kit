import { test, type TestContext } from 'vitest'
import type { Case, CaseFilled } from './case.ts'

/**
 * Executes a parameterized test for each case in the provided array.
 *
 * Automatically handles todo, skip, skipIf, and only cases, reducing boilerplate
 * compared to using `test.for` directly.
 *
 * @example Basic test with default name
 * ```typescript
 * Test.each(cases, (case_) => {
 *   // No type assertion needed - properties are automatically typed
 *   const { input, expected } = case_
 *   expect(transform(input)).toBe(expected)
 * })
 * ```
 *
 * @example With custom name template
 * ```typescript
 * Test.each('transform $input to $expected', cases, (case_) => {
 *   const { input, expected } = case_
 *   expect(transform(input)).toBe(expected)
 * })
 * ```
 *
 * @example Name template syntax
 * ```typescript
 * // Access nested properties with dot notation
 * Test.each('$user.name is $age years old', cases, (case_) => {
 *   const { user, age } = case_
 *   expect(getAge(user)).toBe(age)
 * })
 *
 * // Use any case property in the template
 * Test.each('$method: $input → $output', cases, (case_) => {
 *   const { method, input, output } = case_
 *   expect(process(method, input)).toBe(output)
 * })
 * ```
 *
 * @remarks
 * - Default uses the `name` property from each case
 * - Custom templates use `$property` syntax for interpolation
 * - Todo cases are automatically skipped with their todo message
 * - Skip cases are skipped with their skip reason
 * - SkipIf conditionally skips based on runtime evaluation
 * - Only cases use test.only to focus on specific tests
 * - Tags can be used for categorization (future filtering support)
 * - The runner function is only called for executable cases (not todo/skip)
 * - Case properties are automatically typed in the runner function
 */
export function each<caseInput extends object>(
  cases: Case<caseInput>[],
  runner: (caseInput: CaseFilled & caseInput, context: TestContext) => void | Promise<void>,
): void
export function each<caseInput extends object>(
  nameTemplate: string,
  cases: Case<caseInput>[],
  runner: (caseInput: CaseFilled & caseInput, context: TestContext) => void | Promise<void>,
): void
export function each<caseInput extends object>(
  arg1: string | Case<caseInput>[],
  arg2: Case<caseInput>[] | ((caseInput: CaseFilled & caseInput, context: TestContext) => void | Promise<void>),
  arg3?: (caseInput: CaseFilled & caseInput, context: TestContext) => void | Promise<void>,
) {
  const nameTemplate = typeof arg1 === 'string' ? arg1 : '$name'
  const cases = typeof arg1 === 'string' ? arg2 as Case<caseInput>[] : arg1
  const runner = typeof arg1 === 'string'
    ? arg3!
    : arg2 as (caseInput: CaseFilled & caseInput, context: TestContext) => void | Promise<void>

  // Check if any cases have 'only' set
  const hasOnly = cases.some(c => 'only' in c && c.only === true)
  const testFn = hasOnly ? test.only : test

  testFn.for<Case<caseInput>>(cases)(nameTemplate, async (caseInput, context) => {
    if ('todo' in caseInput) {
      const { todo } = caseInput
      context.skip(typeof todo === 'string' ? todo : undefined)
      return
    }

    const filledCase = caseInput as CaseFilled

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

    await runner(caseInput as CaseFilled & caseInput, context)
  })
}
