/**
 * A test case that can be either executable, skipped, or marked as todo.
 *
 * @typeParam $Input - Additional properties required for the test case.
 *                     When no additional properties are needed, defaults to empty object.
 *
 * @example With input properties
 * ```typescript
 * interface StringCase {
 *   input: string
 *   expected: string
 * }
 *
 * const cases: Test.Case<StringCase>[] = [
 *   { name: 'uppercase', input: 'hello', expected: 'HELLO' },
 *   { name: 'empty string', input: '', expected: '' },
 *   { name: 'unicode support', todo: 'Implement unicode handling' },
 * ]
 * ```
 */
export type Case<$Input extends object = object> =
  | (object extends $Input ? CaseFilled : (CaseFilled & $Input))
  | CaseTodo

/**
 * Represents a test case that will be executed.
 * Can be temporarily skipped with an optional reason.
 */
export interface CaseFilled {
  /** Descriptive name for the test case */
  name: string
  /** Skip this test case. If string, provides skip reason */
  skip?: boolean | string
  /** Conditionally skip this test case based on runtime condition */
  skipIf?: () => boolean
  /** Run only this test case (and other test cases marked with only) */
  only?: boolean
  /** Tags for categorizing and filtering test cases */
  tags?: string[]
}

/**
 * Represents a test case that is not yet implemented.
 * Will be marked as todo in the test output.
 */
export interface CaseTodo {
  /** Descriptive name for the test case */
  name: string
  /** Mark as todo. If string, provides todo reason */
  todo: boolean | string
}
