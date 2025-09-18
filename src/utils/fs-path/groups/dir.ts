import { Schema as S } from 'effect'
import * as AbsoluteDir from '../members/absolute-dir.js'
import * as RelativeDir from '../members/relative-dir.js'

/**
 * Union of directory path types.
 */
export const Dir = S.Union(AbsoluteDir.AbsoluteDir, RelativeDir.RelativeDir)

/**
 * Type representing a directory path (absolute or relative).
 */
export type Dir = typeof Dir.Type

/**
 * Check if a path is a directory.
 *
 * @param value - The value to check
 * @returns True if the path is a directory
 */
export const is = S.is(Dir)

/**
 * Decode a value into a directory path.
 */
export const decode = S.decode(Dir)

/**
 * Synchronously decode a value into a directory path.
 */
export const decodeSync = S.decodeSync(Dir)

/**
 * Encode a directory path to a string.
 */
export const encode = S.encode(Dir)

/**
 * Synchronously encode a directory path to a string.
 */
export const encodeSync = S.encodeSync(Dir)
