import { Schema as S } from 'effect'
import * as RelativeDir from '../members/relative-dir.ts'
import * as RelativeFile from '../members/relative-file.ts'

/**
 * Union of relative path types.
 */
export const Relative = S.Union(RelativeFile.RelativeFile, RelativeDir.RelativeDir)

/**
 * Type representing a relative path (file or directory).
 */
export type Relative = typeof Relative.Type

/**
 * Check if a path is relative.
 *
 * @param value - The value to check
 * @returns True if the path is relative
 */
export const is = S.is(Relative)

/**
 * Decode a value into a relative path.
 */
export const decode = S.decode(Relative)

/**
 * Synchronously decode a value into a relative path.
 */
export const decodeSync = S.decodeSync(Relative)

/**
 * Encode a relative path to a string.
 */
export const encode = S.encode(Relative)

/**
 * Synchronously encode a relative path to a string.
 */
export const encodeSync = S.encodeSync(Relative)
