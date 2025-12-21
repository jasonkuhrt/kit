import { Schema as S } from 'effect'
import * as Segment from './segment.js'

/**
 * Schema for validating arrays of path segments.
 * Used by all path member types to represent directory structure.
 *
 * When used in class definitions, wrap with propertySignature and withConstructorDefault.
 */
const SegmentsArray = S.Array(Segment.Segment)

/**
 * Property signature for segments with default empty array.
 * Use this in TaggedClass definitions.
 */
export const Segments = SegmentsArray.pipe(
  S.propertySignature,
  S.withConstructorDefault(() => []),
)
