/**
 * Type definitions for extractors.
 *
 * Re-exports Extractor interface and isExtractor guard from Fn module.
 *
 * @module
 */

import type { Fn } from '#fn'
import { Fn as FnRuntime } from '#fn'

/**
 * An extractor is a callable function with type-level metadata.
 * Combines runtime extraction with type-level Kind transformations.
 */
export type Extractor<$In = any, $Out = any> = Fn.Extractor<$In, $Out>

/**
 * Check if a value is an Extractor.
 * Re-exported from Fn module.
 */
export const isExtractor = FnRuntime.isExtractor
