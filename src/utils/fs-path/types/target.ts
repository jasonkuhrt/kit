import { Schema as S } from 'effect'

/**
 * Branded type for file targets.
 */
export const TargetFile = S.Literal('file').pipe(S.brand('TargetFile'))

/**
 * Type representing a file target.
 */
export type TargetFile = typeof TargetFile.Type

/**
 * Branded type for directory targets.
 */
export const TargetDir = S.Literal('dir').pipe(S.brand('TargetDir'))

/**
 * Type representing a directory target.
 */
export type TargetDir = typeof TargetDir.Type

/**
 * Union of file and directory targets.
 */
export const Target = S.Union(TargetFile, TargetDir)

/**
 * Type representing any target (file or directory).
 */
export type Target = typeof Target.Type

/**
 * Check if a target is a file.
 *
 * @param value - The value to check
 * @returns True if the target is a file
 */
export const isFile = S.is(TargetFile)

/**
 * Check if a target is a directory.
 *
 * @param value - The value to check
 * @returns True if the target is a directory
 */
export const isDir = S.is(TargetDir)

/**
 * Check if a value is a valid target.
 *
 * @param value - The value to check
 * @returns True if the value is a valid target
 */
export const is = S.is(Target)
