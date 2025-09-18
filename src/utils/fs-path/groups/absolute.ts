import { Schema as S } from 'effect'
import * as AbsoluteDir from '../members/absolute-dir.js'
import * as AbsoluteFile from '../members/absolute-file.js'

/**
 * Union of absolute path types.
 */
export const Absolute = S.Union(AbsoluteFile.AbsoluteFile, AbsoluteDir.AbsoluteDir)

/**
 * Type representing an absolute path (file or directory).
 */
export type Absolute = typeof Absolute.Type

/**
 * Check if a path is absolute.
 *
 * @param value - The value to check
 * @returns True if the path is absolute
 */
export const is = S.is(Absolute)

/**
 * Decode a value into an absolute path.
 */
export const decode = S.decode(Absolute)

/**
 * Synchronously decode a value into an absolute path.
 */
export const decodeSync = S.decodeSync(Absolute)

/**
 * Encode an absolute path to a string.
 */
export const encode = S.encode(Absolute)

/**
 * Synchronously encode an absolute path to a string.
 */
export const encodeSync = S.encodeSync(Absolute)
