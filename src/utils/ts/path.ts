import type { Fn } from '#fn'
import type { Obj } from '#obj'
import type { Either } from 'effect'
import type { StaticError } from './err.js'
import type { ShowInTemplate } from './ts.js'

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
 * Error type helpers that avoid using `this` inside object literal positions.
 * These use StaticError for consistent error formatting.
 */
type PathErrorKeyNotFound<$Key, $Actual> = StaticError<
  ['path', 'key-not-found'],
  { message: 'Key does not exist on type'; key: $Key; actual: $Actual }
>

type PathErrorArrayExtract<$Actual> = StaticError<
  ['path', 'array-extract'],
  { message: 'Failed to extract array element from type'; expected: readonly any[]; actual: $Actual }
>

type PathErrorTupleExtract<$Actual> = StaticError<
  ['path', 'tuple-extract'],
  { message: 'Failed to extract tuple element from type'; expected: readonly any[]; actual: $Actual }
>

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
export type ValidateAndExtract<
  $Actual,
  $Constraint,
  $ExtractorName extends string,
  $ExtractionLogic,
> = IsDisjoint<$Actual, $Constraint> extends true ? Either.Left<
    StaticError<
      ['path', 'extractor-incompatible'],
      {
        message: `Cannot extract ${$ExtractorName} from incompatible type`
        expected: FormatConstraint<$Constraint>
        actual: $Actual
        attempted: `${$ExtractorName} extractor`
      }
    >,
    never
  >
  : Either.Right<never, $ExtractionLogic>

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
export interface Awaited$ extends Fn.Kind.Kind {
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
export interface Returned extends Fn.Kind.Kind {
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
 * Indexed extractor - accesses a property of an object by key.
 *
 * Parameters: [$Actual, $Key]
 * Returns: $Actual[$Key]
 *
 * Used for property access in extraction chains.
 */
export interface Indexed extends Fn.Kind.Kind {
  constraint: unknown
  extractorName: 'indexed'
  parameters: [$Actual: unknown, $Key: PropertyKey]
  return: this['parameters'][1] extends keyof this['parameters'][0]
    ? Either.Right<never, this['parameters'][0][this['parameters'][1]]>
    : Either.Left<PathErrorKeyNotFound<this['parameters'][1], this['parameters'][0]>, never>
}

/**
 * ArrayElement extractor - extracts element type from an array.
 *
 * Parameters: [$Actual]
 * Returns: ElementType<$Actual>
 *
 * Used by `.array` assertions to check array element types.
 */
export interface ArrayElement extends Fn.Kind.Kind {
  constraint: readonly any[]
  extractorName: 'array'
  parameters: [$Actual: unknown]
  return: ValidateAndExtract<
    this['parameters'][0],
    this['constraint'],
    this['extractorName'],
    this['parameters'][0] extends readonly (infer __element__)[] ? __element__
      : PathErrorArrayExtract<this['parameters'][0]>
  >
}

/**
 * Generic parameter extractor - extracts specific parameter by index.
 *
 * Parameters: [$Actual, $Index]
 * Returns: Parameters<$Actual>[$Index]
 *
 * Used for extracting function parameters by index.
 */
export interface Parameter extends Fn.Kind.Kind {
  constraint: (...args: any[]) => any
  extractorName: 'parameter'
  parameters: [$Actual: unknown, $Index: number]
  return: ValidateAndExtract<
    this['parameters'][0],
    this['constraint'],
    this['extractorName'],
    Parameters<Extract<this['parameters'][0], this['constraint']>>[this['parameters'][1]]
  >
}

/**
 * Parameters extractor - extracts all function parameters as a tuple.
 *
 * Parameters: [$Actual]
 * Returns: Parameters<$Actual>
 *
 * Used by `.parameters` assertions to check function parameter tuple type.
 */
export interface Parameters$ extends Fn.Kind.Kind {
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
 * Parameter1 extractor - extracts first function parameter.
 *
 * Parameters: [$Actual]
 * Returns: Parameters<$Actual>[0]
 *
 * Used by `.parameter1` assertions.
 */
export interface Parameter1 extends Fn.Kind.Kind {
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
 * Parameter2 extractor - extracts second function parameter.
 *
 * Parameters: [$Actual]
 * Returns: Parameters<$Actual>[1]
 *
 * Used by `.parameter2` assertions.
 */
export interface Parameter2 extends Fn.Kind.Kind {
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
 * Parameter3 extractor - extracts third function parameter.
 *
 * Parameters: [$Actual]
 * Returns: Parameters<$Actual>[2]
 *
 * Used by `.parameter3` assertions.
 */
export interface Parameter3 extends Fn.Kind.Kind {
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
 * Parameter4 extractor - extracts fourth function parameter.
 *
 * Parameters: [$Actual]
 * Returns: Parameters<$Actual>[3]
 *
 * Used by `.parameter4` assertions.
 */
export interface Parameter4 extends Fn.Kind.Kind {
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
 * Parameter5 extractor - extracts fifth function parameter.
 *
 * Parameters: [$Actual]
 * Returns: Parameters<$Actual>[4]
 *
 * Used by `.parameter5` assertions.
 */
export interface Parameter5 extends Fn.Kind.Kind {
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

/**
 * TupleAt extractor - extracts element from tuple at specific index.
 *
 * Parameters: [$Actual]
 * Returns: $Actual[$Index]
 *
 * Used for extracting specific tuple elements by index.
 */
export interface TupleAt<$Index extends number> extends Fn.Kind.Kind {
  constraint: readonly any[]
  extractorName: 'tupleAt'
  parameters: [$Actual: unknown]
  return: ValidateAndExtract<
    this['parameters'][0],
    this['constraint'],
    this['extractorName'],
    this['parameters'][0] extends readonly any[] ? this['parameters'][0][$Index]
      : PathErrorTupleExtract<this['parameters'][0]>
  >
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Constraint Extractors
//
//
//
//

/**
 * NoExcess extractor - checks for excess properties.
 *
 * Parameters: [$Actual]
 * Returns: $Actual (with excess property check)
 *
 * Used by `.noExcess` to ensure no extra properties beyond expected type.
 */
export interface NoExcess extends Fn.Kind.Kind {
  constraint: unknown
  extractorName: 'noExcess'
  parameters: [$Expected: unknown, $Actual: unknown]
  return: this['parameters'] extends [infer __expected__, infer __actual__]
    ? [keyof Obj.SubtractShallow<__actual__, __expected__>] extends [never] ? __actual__
    : StaticError<
      ['path', 'excess-properties'],
      {
        message: 'Type has excess properties'
        expected: __expected__
        actual: __actual__
        excess: keyof Obj.SubtractShallow<__actual__, __expected__>
      }
    >
    : never
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Composition
//
//
//
//

/**
 * Apply a sequence of extractors to a type.
 *
 * Takes a tuple of extractor kinds and applies them sequentially from left to right.
 * Each extractor transforms the output of the previous one.
 *
 * @example
 * ```ts
 * type T = ApplyExtractors<[Awaited$, ArrayElement], Promise<number[]>>
 * // Applies: Promise<number[]> → number[] → number
 * ```
 */
export type ApplyExtractors<$Extractors extends readonly Fn.Kind.Kind[], $Actual> = $Extractors extends
  readonly [infer __first__ extends Fn.Kind.Kind, ...infer __rest__ extends Fn.Kind.Kind[]]
  ? Fn.Kind.Apply<__first__, [$Actual]> extends infer ___result___
    ? ___result___ extends Either.Left<infer __error__, infer _> ? Either.Left<__error__, never> // Short-circuit on error
    : ___result___ extends Either.Right<infer _, infer __value__> ? ApplyExtractors<__rest__, __value__> // Continue with unwrapped value
    : never // Shouldn't happen - extractor must return Either
  : never
  : Either.Right<never, $Actual> // No extractors - wrap in success

/**
 * Unwrap Either to get the value or error for type-level shortcuts.
 *
 * - Left<E, never> → E (propagate error)
 * - Right<never, V> → V (extract value)
 *
 * Used by generated type-level assertion shortcuts to unwrap extractor results
 * before passing to relators.
 */
export type UnwrapEither<$Result> = $Result extends Either.Left<infer __error__, infer _> ? __error__
  : $Result extends Either.Right<infer _, infer __value__> ? __value__
  : never

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Applicability Analysis
//
//
//
//

/**
 * Determine which extractors are applicable to a given type based on its structure.
 *
 * This performs type analysis to determine which path extractors can meaningfully
 * operate on a type:
 * - Promise types → `awaited`
 * - Function types → `returned`, `parameters`, `parameter1-5`
 * - Array types → `array`
 *
 * Returns a mapped type with applicable extractor names as keys.
 * Used by the assertion builder to provide contextual extractor methods.
 *
 * @example
 * ```ts
 * type PromiseExtractors = GetApplicableExtractors<Promise<string>>
 * // { awaited: true }
 *
 * type FunctionExtractors = GetApplicableExtractors<() => number>
 * // { returned: true; parameters: true; parameter1: true; ... }
 *
 * type ArrayExtractors = GetApplicableExtractors<string[]>
 * // { array: true }
 * ```
 */
// dprint-ignore
export type GetApplicableExtractors<$T> =
  // Check Promise first (outermost layer)
  $T extends Promise<any>
    ? { awaited: true }
    // Not Promise - check Function
    : $T extends (...args: any) => any
      ? { returned: true; parameters: true; parameter1: true; parameter2: true; parameter3: true; parameter4: true; parameter5: true }
      // Not Function - check Array
      : $T extends readonly any[]
        ? { array: true }
        // Not any of the above - no extractors applicable
        : {}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Registry
//
//
//
//

/**
 * Central registry of all type path extractors.
 *
 * **This is the single source of truth for extractors.**
 *
 * To add a new extractor:
 * 1. Define the Kind interface above in this file
 * 2. Add entry here: `extractorName: ExtractorKind`
 * 3. Run `pnpm generate:test-namespaces`
 *
 * Everything else (builder API, generated files) derives automatically.
 */
export interface ExtractorRegistry {
  awaited: Awaited$
  returned: Returned
  array: ArrayElement
  parameters: Parameters$
  parameter1: Parameter1
  parameter2: Parameter2
  parameter3: Parameter3
  parameter4: Parameter4
  parameter5: Parameter5
}

/**
 * Get extractor Kind by name.
 */
export type GetExtractor<$Name extends keyof ExtractorRegistry> = ExtractorRegistry[$Name]

/**
 * All registered extractor names.
 */
export type ExtractorName = keyof ExtractorRegistry
