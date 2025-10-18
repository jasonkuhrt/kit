import type { Obj } from '#obj'
import type { Kind } from '#ts/ts'
import type { ShowInTemplate } from '../../ts.js'
import type { StaticErrorAssertion } from '../assertion-error.js'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Transformation Extractors
//
//
//
//

/**
 * Awaited extractor - extracts the resolved type of a Promise.
 *
 * Parameters: [$Actual]
 * Returns: Awaited<$Actual>
 *
 * Transforms $Actual by awaiting it.
 * Used by `.awaited` assertions to check what a Promise resolves to.
 */
export interface Awaited$ {
  parameters: [$Actual: unknown]
  return: Awaited<this['parameters'][0]>
}

/**
 * Returned extractor - extracts the return type of a function.
 *
 * Parameters: [$Actual]
 * Returns: ReturnType<$Actual>
 *
 * Used by `.returned` assertions to check what a function returns.
 */
export interface Returned {
  parameters: [$Actual: (...args: any[]) => any]
  return: ReturnType<this['parameters'][0]>
}

/**
 * Indexed extractor - extracts element at specific index from array/tuple.
 *
 * Parameters: [$Index, $Actual]
 * Returns: $Actual[$Index]
 *
 * Note: This is parameterized - needs $Index passed separately.
 * Used by `.indexed` assertions to check specific array/tuple elements.
 */
export interface Indexed {
  parameters: [$Index: number, $Actual: any]
  return: this['parameters'][1] extends infer __actual__
    ? this['parameters'][0] extends keyof __actual__ ? __actual__[this['parameters'][0]]
    : never
    : never
}

/**
 * ArrayElement extractor - extracts element type from an array.
 *
 * Parameters: [$Actual]
 * Returns: ElementType
 *
 * Used by composite extractors like `.awaited.array` to check array element types.
 */
export interface ArrayElement {
  parameters: [$Actual: unknown]
  return: this['parameters'][0] extends (infer __element__)[] ? __element__ : never
}

//
// Expectations (Never, Any, Unknown, Empty) moved to expectations.ts
// These provide built-in $Expected values rather than transforming $Actual
//

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Function Extractors
//
//
//
//

/**
 * Parameter extractor - extracts a specific parameter type from a function.
 *
 * Parameters: [$Index, $Actual]
 * Returns: Parameters<$Actual>[$Index]
 *
 * Used by `.parameter`, `.parameter1-5` assertions.
 */
export interface Parameter {
  parameters: [$Index: number, $Actual: (...args: any[]) => any]
  return: Parameters<this['parameters'][1]>[this['parameters'][0] & number]
}

/**
 * Parameters extractor - extracts full parameters tuple from a function.
 *
 * Parameters: [$Actual]
 * Returns: Parameters<$Actual>
 *
 * Used by `.parameters` assertion (full tuple matching).
 */
export interface Parameters$ {
  parameters: [$Actual: (...args: any[]) => any]
  return: Parameters<this['parameters'][0]>
}

/**
 * Parameter1 extractor - extracts the first parameter type from a function.
 *
 * Parameters: [$Actual]
 * Returns: Parameters<$Actual>[0]
 */
export interface Parameter1 {
  parameters: [$Actual: (...args: any[]) => any]
  return: Parameters<this['parameters'][0]>[0]
}

/**
 * Parameter2 extractor - extracts the second parameter type from a function.
 *
 * Parameters: [$Actual]
 * Returns: Parameters<$Actual>[1]
 */
export interface Parameter2 {
  parameters: [$Actual: (...args: any[]) => any]
  return: Parameters<this['parameters'][0]>[1]
}

/**
 * Parameter3 extractor - extracts the third parameter type from a function.
 *
 * Parameters: [$Actual]
 * Returns: Parameters<$Actual>[2]
 */
export interface Parameter3 {
  parameters: [$Actual: (...args: any[]) => any]
  return: Parameters<this['parameters'][0]>[2]
}

/**
 * Parameter4 extractor - extracts the fourth parameter type from a function.
 *
 * Parameters: [$Actual]
 * Returns: Parameters<$Actual>[3]
 */
export interface Parameter4 {
  parameters: [$Actual: (...args: any[]) => any]
  return: Parameters<this['parameters'][0]>[3]
}

/**
 * Parameter5 extractor - extracts the fifth parameter type from a function.
 *
 * Parameters: [$Actual]
 * Returns: Parameters<$Actual>[4]
 */
export interface Parameter5 {
  parameters: [$Actual: (...args: any[]) => any]
  return: Parameters<this['parameters'][0]>[4]
}

export interface TupleAt<$Index extends number> {
  parameters: [$Actual: readonly [...readonly any[]]]
  return: this['parameters'][0][$Index]
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Object Extractors
//
//
//
//

// Properties extractor removed - it was redundant with base relation checks.
// Use the base relations directly instead:
//   sub<{ id: string }, Config>  - Check that Config has at least these properties

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Modifier Extractors
//
//
//
//

/**
 * NoExcess modifier - wraps a relation check and adds excess property validation.
 *
 * Parameters: [[$Expected, $RelationResult, $OriginalExpected, $OriginalActual]]
 * Returns: [$Expected, never | StaticErrorAssertion]
 *
 * Used by `.noExcess` modifier on sub and equiv relations.
 *
 * Checks two conditions:
 * 1. Base relation passes (provided as $RelationResult)
 * 2. $OriginalActual has no properties beyond those in $OriginalExpected
 */
// dprint-ignore
export interface NoExcess {
  parameters: [[$Expected: unknown, $RelationResult: unknown, $OriginalExpected: unknown, $OriginalActual: unknown]]
  return:
    this['parameters'][0] extends [infer __expected__, infer __relationResult__, infer __originalExpected__, infer __originalActual__]
      ? __relationResult__ extends never
        ? [keyof Obj.SubtractShallow<__originalActual__, __originalExpected__>] extends [never]
          ? [__expected__, never]
          : [__expected__, StaticErrorAssertion<
              'ACTUAL has excess properties not in EXPECTED',
              __originalExpected__,
              __originalActual__,
              `Excess: ${ShowInTemplate<keyof Obj.SubtractShallow<__originalActual__, __originalExpected__>>}`
            >]
        : [__expected__, __relationResult__]
      : never
}

//
//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Composite Extractors
//
//
//
//

// Composite extractors removed - use Kind.Pipe to compose extractors instead.
// For example:
//   Kind.Pipe<[Awaited$, ArrayElement], $Actual>
//   Kind.Pipe<[Returned, Awaited$], $Actual>
//   Kind.Pipe<[Returned, ArrayElement], $Actual>

/**
 * Apply a tuple of extractors sequentially (right-to-left composition).
 *
 * Takes an array of extractor Kinds and applies them in sequence from right to left.
 * This enables flexible extractor chaining without creating specialized composite types.
 *
 * @example
 * ```typescript
 * // Apply Awaited, then extract array element
 * type Result = ApplyExtractors<[Extractors.Awaited, Extractors.ArrayElement], Promise<string[]>>
 * // Result: string
 *
 * // Apply ReturnType, then Awaited
 * type Result2 = ApplyExtractors<[Extractors.Returned, Extractors.Awaited], () => Promise<number>>
 * // Result2: number
 * ```
 *
 * @param $Extractors - Tuple of extractor Kinds to apply sequentially
 * @param $Actual - The type to extract from
 * @returns The result of applying all extractors in sequence
 */
export type ApplyExtractors<$Extractors extends readonly Kind.Kind[], $Actual> = $Extractors extends
  readonly [infer __first__ extends Kind.Kind, ...infer __rest__ extends readonly Kind.Kind[]]
  ? ApplyExtractors<__rest__, Kind.Apply<__first__, [$Actual]>>
  : $Actual
