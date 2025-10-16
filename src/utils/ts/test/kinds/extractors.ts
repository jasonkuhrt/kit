import type { Obj } from '#obj'
import type { ShowInTemplate } from '../../ts.js'
import type { StaticErrorAssertion } from '../helpers.js'

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
 * Used by `.awaited` assertions to check what a Promise resolves to.
 */
export interface AwaitedExtractor {
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
export interface ReturnedExtractor {
  parameters: [$Actual: any]
  return: ReturnType<this['parameters'][0]>
}

/**
 * Indexed extractor - extracts element at specific index from array/tuple.
 *
 * Parameters: [$Index, $Actual]
 * Returns: $Actual[$Index]
 *
 * Used by `.indexed` assertions to check specific array/tuple elements.
 */
export interface IndexedExtractor {
  parameters: [$Index: number, $Actual: any]
  return: this['parameters'][1][this['parameters'][0]]
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Special Type Matchers
//
//
//
//

/**
 * Never matcher - provides the `never` type for comparison.
 *
 * Parameters: []
 * Returns: never
 *
 * Used by `.never` assertions like `exact.never<T>`.
 */
export interface NeverMatcher {
  parameters: []
  return: never
}

/**
 * Any matcher - provides the `any` type for comparison.
 *
 * Parameters: []
 * Returns: any
 *
 * Used by `.any` assertions like `exact.any<T>`.
 */
export interface AnyMatcher {
  parameters: []
  return: any
}

/**
 * Unknown matcher - provides the `unknown` type for comparison.
 *
 * Parameters: []
 * Returns: unknown
 *
 * Used by `.unknown` assertions like `exact.unknown<T>`.
 */
export interface UnknownMatcher {
  parameters: []
  return: unknown
}

/**
 * Empty matcher - checks if a type is an empty value ([], '', or empty object).
 *
 * Parameters: [$Actual]
 * Returns: true if empty, false otherwise
 *
 * Used by `.empty` assertions. Dispatches over multiple empty types:
 * - Empty array: []
 * - Empty string: ''
 * - Empty object: Record<string, never>
 */
// dprint-ignore
export interface EmptyMatcher {
  parameters: [$Actual: unknown]
  return:
    this['parameters'][0] extends unknown[]
      ? this['parameters'][0] extends []
        ? true
        : false
      : this['parameters'][0] extends string
        ? this['parameters'][0] extends ''
          ? true
          : false
        : this['parameters'][0] extends object
          ? Obj.IsEmpty<this['parameters'][0]> extends true
            ? true
            : false
          : false
}

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
export interface ParameterExtractor {
  parameters: [$Index: number, $Actual: any]
  return: Parameters<this['parameters'][1]>[this['parameters'][0]]
}

/**
 * Parameters extractor - extracts full parameters tuple from a function.
 *
 * Parameters: [$Actual]
 * Returns: Parameters<$Actual>
 *
 * Used by `.parameters` assertion (full tuple matching).
 */
export interface ParametersExtractor {
  parameters: [$Actual: any]
  return: Parameters<this['parameters'][0]>
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

/**
 * Properties extractor - extracts a subset of properties from an object.
 *
 * Parameters: [$Props, $Actual]
 * Returns: Pick<$Actual, keyof $Props>
 *
 * Used by `.properties` assertion to check specific object properties.
 */
export interface PropertiesExtractor {
  parameters: [$Props: object, $Actual: any]
  return: Pick<this['parameters'][1], keyof this['parameters'][0] & keyof this['parameters'][1]>
}

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
 * Parameters: [$RelationResult, $Expected, $Actual]
 * Returns: never if relation passes AND no excess, otherwise StaticErrorAssertion
 *
 * Used by `.noExcess` modifier on sub and equiv relations.
 *
 * Checks two conditions:
 * 1. Base relation passes (provided as $RelationResult)
 * 2. $Actual has no properties beyond those in $Expected
 */
// dprint-ignore
export interface NoExcessModifier {
  parameters: [$RelationResult: unknown, $Expected: unknown, $Actual: unknown]
  return:
    this['parameters'][0] extends never
      ? [keyof Obj.SubtractShallow<this['parameters'][2], this['parameters'][1]>] extends [never]
        ? never
        : StaticErrorAssertion<
            'Type has excess properties not present in expected type',
            this['parameters'][1],
            this['parameters'][2],
            `Excess properties: ${ShowInTemplate<keyof Obj.SubtractShallow<this['parameters'][2], this['parameters'][1]>>}`
          >
      : this['parameters'][0]
}

//
// Future extractors (add as needed):
//

// Function extractors:
// - LastParameterExtractor - extract last parameter (for variadic functions)
// - ThisParameterExtractor - extract 'this' context type

// Object extractors:
// - KeyExtractor - extract type of specific key
// - KeysExtractor - extract all keys (keyof)
// - ValuesExtractor - extract all value types

// Array/Tuple extractors:
// - LengthExtractor - extract tuple length
// - ElementExtractor - alias to IndexedExtractor for clarity

// Transformation extractors:
// - ReadonlyExtractor - apply Readonly<T>
// - PartialExtractor - apply Partial<T>
