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
  /** todo */
  expected?: object
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

// New types for Suite API with 3-parameter pattern

/**
 * Base properties for suite cases.
 */
export interface SuiteCaseBase {
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
 * A filled test case with input, output, and optional custom properties.
 * Merges SuiteCaseBase with i, o, and custom properties.
 */
export type SuiteCase<$I, $O, $Custom = {}> =
  & SuiteCaseBase
  & { i: $I; o: $O }
  & $Custom

/**
 * A test case that can be either executable or marked as todo.
 *
 * @typeParam $I - Input type for the test case
 * @typeParam $O - Output/expected type for the test case
 * @typeParam $Custom - Additional custom properties (optional)
 *
 * @example Basic usage with i/o
 * ```typescript
 * const cases: Test.TestCase<string, string>[] = [
 *   { name: 'uppercase', i: 'hello', o: 'HELLO' },
 *   { name: 'empty string', i: '', o: '' },
 *   { name: 'unicode support', todo: 'Implement unicode handling' },
 * ]
 * ```
 *
 * @example With custom properties
 * ```typescript
 * const cases: Test.TestCase<
 *   number,
 *   number,
 *   { precision: number; category: string }
 * >[] = [
 *   { name: 'round up', i: 1.5, o: 2, precision: 0, category: 'rounding' },
 * ]
 * ```
 */
export type TestCase<$I, $O, $Custom = {}> =
  | SuiteCase<$I, $O, $Custom>
  | CaseTodo
