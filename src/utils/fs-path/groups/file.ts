import { Schema as S } from 'effect'
import * as AbsoluteFile from '../members/absolute-file.js'
import * as RelativeFile from '../members/relative-file.ts'

/**
 * Union of file path types.
 */
export const File = S.Union(AbsoluteFile.AbsoluteFile, RelativeFile.RelativeFile)

/**
 * Type representing a file path (absolute or relative).
 */
export type File = typeof File.Type

/**
 * Check if a path is a file.
 *
 * @param value - The value to check
 * @returns True if the path is a file
 */
export const is = S.is(File)

/**
 * Decode a value into a file path.
 */
export const decode = S.decode(File)

/**
 * Synchronously decode a value into a file path.
 */
export const decodeSync = S.decodeSync(File)

/**
 * Encode a file path to a string.
 */
export const encode = S.encode(File)

/**
 * Synchronously encode a file path to a string.
 */
export const encodeSync = S.encodeSync(File)
