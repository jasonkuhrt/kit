/**
 * Extractor interface for callable type-level transformations.
 *
 * Extractors are functions with a `.kind` property that enables both:
 * - Runtime extraction (callable function)
 * - Type-level transformation (via Kind metadata)
 *
 * This allows extractors to work with `Fn.compose()` while preserving
 * type-level transformation metadata for use in type assertions.
 *
 * @module
 *
 * @example
 * ```ts
 * import { Fn } from '@wollybeard/kit'
 * import type { Lens } from '@wollybeard/kit'
 *
 * // Create an awaited extractor
 * const awaited: Fn.Extractor<Promise<any>, any> = Object.assign(
 *   (value: Promise<any>) => value, // Runtime (identity - assumes resolved)
 *   { kind: {} as Lens.Awaited.$Get }    // Type-level metadata
 * )
 *
 * // Use in composition
 * const extract = Fn.compose(awaited, otherExtractor)
 * ```
 */

import type * as Kind from './kind.js'

/**
 * An extractor is a callable function with type-level metadata.
 *
 * @template $In - The input type for runtime extraction
 * @template $Out - The output type for runtime extraction
 *
 * @property kind - Type-level metadata (Kind) for type transformations
 *
 * @example
 * ```ts
 * // Awaited extractor
 * const awaited: Extractor<Promise<number>, number> = Object.assign(
 *   (value: Promise<number>) => value, // Runtime
 *   { kind: {} as Awaited$ }            // Type-level
 * )
 * ```
 */
export interface Extractor<$In = any, $Out = any> {
  /**
   * Runtime extraction function.
   * Called to extract/transform values at runtime.
   */
  (value: $In): $Out

  /**
   * Type-level metadata for type transformations.
   * Used by type system to infer transformed types.
   */
  readonly kind: Kind.Kind
}

/**
 * Check if a value is an Extractor (has both callable and .kind property).
 *
 * @param value - Value to check
 * @returns True if value is an Extractor
 *
 * @example
 * ```ts
 * const awaited: Extractor = ...
 * const regularFn = (x: number) => x * 2
 *
 * isExtractor(awaited)    // true
 * isExtractor(regularFn)  // false
 * ```
 */
export const isExtractor = (value: unknown): value is Extractor => {
  return typeof value === 'function' && 'kind' in value
}
