import type { Obj } from '#obj'
import type { Kind } from '#ts/ts'
import type { ShowInTemplate } from '../../ts.js'
import type { StaticErrorAssertion } from '../assertion-error.js'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Helpers
//
//
//
//

/**
 * Check if two types are completely disjoint (cannot overlap).
 * Only returns true when types are GUARANTEED to never intersect.
 *
 * This allows unions that include valid types to pass through.
 * @example
 * IsDisjoint<string, PromiseLike<any>> // true - guaranteed disjoint
 * IsDisjoint<Promise<number>, PromiseLike<any>> // false - they overlap
 * IsDisjoint<string | Promise<number>, PromiseLike<any>> // false - Promise part overlaps
 */
type IsDisjoint<$T, $Constraint> = [Extract<$T, $Constraint>] extends [never] ? true : false

/**
 * Format a constraint type for display in error messages.
 * Provides human-readable descriptions for common type patterns.
 */
type FormatConstraint<$Constraint> = $Constraint extends readonly any[] ? 'Type must extend array (readonly any[])'
  : $Constraint extends PromiseLike<any> ? 'Type must extend PromiseLike<any>'
  : $Constraint extends (...args: any) => any ? 'Type must extend function ((...args: any) => any)'
  : ShowInTemplate<$Constraint>

/**
 * Validates an input type against a constraint and returns extraction result or error.
 * This is used by extractors to provide helpful errors when used on incompatible types.
 *
 * @param $Actual - The type to validate and extract from
 * @param $Constraint - The required constraint type
 * @param $ExtractorName - Human-readable name of the extractor
 * @param $ExtractionLogic - The extraction logic to apply if validation passes
 */
type ValidateAndExtract<
  $Actual,
  $Constraint,
  $ExtractorName extends string,
  $ExtractionLogic,
> = IsDisjoint<$Actual, $Constraint> extends true ? StaticErrorAssertion<
    `Cannot extract ${$ExtractorName} from incompatible type`,
    FormatConstraint<$Constraint>,
    $Actual,
    { attempted: `${$ExtractorName} extractor` }
  >
  : $ExtractionLogic

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
  constraint: PromiseLike<any>
  extractorName: 'awaited'
  parameters: [$Actual: unknown]
  return: ValidateAndExtract<
    this['parameters'][0],
    this['constraint'],
    this['extractorName'],
    Awaited<this['parameters'][0]>
  >
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
  constraint: (...args: any[]) => any
  extractorName: 'returned'
  parameters: [$Actual: unknown]
  return: ValidateAndExtract<
    this['parameters'][0],
    this['constraint'],
    this['extractorName'],
    ReturnType<Extract<this['parameters'][0], this['constraint']>>
  >
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
  constraint: readonly any[]
  extractorName: 'array'
  parameters: [$Actual: unknown]
  return: ValidateAndExtract<
    this['parameters'][0],
    this['constraint'],
    this['extractorName'],
    this['parameters'][0] extends (infer __element__)[] ? __element__ : never
  >
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
  constraint: (...args: any[]) => any
  extractorName: 'parameters'
  parameters: [$Actual: unknown]
  return: ValidateAndExtract<
    this['parameters'][0],
    this['constraint'],
    this['extractorName'],
    Parameters<Extract<this['parameters'][0], this['constraint']>>
  >
}

/**
 * Parameter1 extractor - extracts the first parameter type from a function.
 *
 * Parameters: [$Actual]
 * Returns: Parameters<$Actual>[0]
 */
export interface Parameter1 {
  constraint: (...args: any[]) => any
  extractorName: 'parameter1'
  parameters: [$Actual: unknown]
  return: ValidateAndExtract<
    this['parameters'][0],
    this['constraint'],
    this['extractorName'],
    Parameters<Extract<this['parameters'][0], this['constraint']>>[0]
  >
}

/**
 * Parameter2 extractor - extracts the second parameter type from a function.
 *
 * Parameters: [$Actual]
 * Returns: Parameters<$Actual>[1]
 */
export interface Parameter2 {
  constraint: (...args: any[]) => any
  extractorName: 'parameter2'
  parameters: [$Actual: unknown]
  return: ValidateAndExtract<
    this['parameters'][0],
    this['constraint'],
    this['extractorName'],
    Parameters<Extract<this['parameters'][0], this['constraint']>>[1]
  >
}

/**
 * Parameter3 extractor - extracts the third parameter type from a function.
 *
 * Parameters: [$Actual]
 * Returns: Parameters<$Actual>[2]
 */
export interface Parameter3 {
  constraint: (...args: any[]) => any
  extractorName: 'parameter3'
  parameters: [$Actual: unknown]
  return: ValidateAndExtract<
    this['parameters'][0],
    this['constraint'],
    this['extractorName'],
    Parameters<Extract<this['parameters'][0], this['constraint']>>[2]
  >
}

/**
 * Parameter4 extractor - extracts the fourth parameter type from a function.
 *
 * Parameters: [$Actual]
 * Returns: Parameters<$Actual>[3]
 */
export interface Parameter4 {
  constraint: (...args: any[]) => any
  extractorName: 'parameter4'
  parameters: [$Actual: unknown]
  return: ValidateAndExtract<
    this['parameters'][0],
    this['constraint'],
    this['extractorName'],
    Parameters<Extract<this['parameters'][0], this['constraint']>>[3]
  >
}

/**
 * Parameter5 extractor - extracts the fifth parameter type from a function.
 *
 * Parameters: [$Actual]
 * Returns: Parameters<$Actual>[4]
 */
export interface Parameter5 {
  constraint: (...args: any[]) => any
  extractorName: 'parameter5'
  parameters: [$Actual: unknown]
  return: ValidateAndExtract<
    this['parameters'][0],
    this['constraint'],
    this['extractorName'],
    Parameters<Extract<this['parameters'][0], this['constraint']>>[4]
  >
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
 * Validates each extractor's constraint before applying to provide helpful error messages.
 *
 * @example
 * ```typescript
 * // Apply Awaited, then extract array element
 * type Result = ApplyExtractors<[Extractors.Awaited, Extractors.ArrayElement], Promise<string[]>>
 * // Result: string
 *
 * // Error on incompatible type
 * type Error = ApplyExtractors<[Extractors.ArrayElement], string>
 * // Result: StaticErrorAssertion<"Cannot extract array element from non-array type", ...>
 * ```
 *
 * @param $Extractors - Tuple of extractor Kinds to apply sequentially
 * @param $Actual - The type to extract from
 * @returns The result of applying all extractors in sequence, or StaticErrorAssertion on validation failure
 */
export type ApplyExtractors<$Extractors extends readonly Kind.Kind[], $Actual> = $Extractors extends
  readonly [infer __first__ extends Kind.Kind, ...infer __rest__ extends readonly Kind.Kind[]]
  ? __first__ extends { constraint: infer __constraint__; extractorName: infer __name__ }
    // Extractor has constraint - validate before applying
    ? IsDisjoint<$Actual, __constraint__> extends true
      // Type is disjoint from constraint - guaranteed failure
      ? StaticErrorAssertion<
        `Cannot extract ${__name__ & string} from incompatible type`,
        FormatConstraint<__constraint__>,
        $Actual,
        { attempted: `${__name__ & string} extractor` }
      >
      // Type overlaps with constraint - proceed with extraction
    : ApplyExtractors<__rest__, Kind.Apply<__first__, [$Actual]>>
    // No constraint - apply directly
  : ApplyExtractors<__rest__, Kind.Apply<__first__, [$Actual]>>
  : $Actual
