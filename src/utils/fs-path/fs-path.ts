import { Schema as S } from 'effect'
import * as AbsoluteDir from './members/absolute-dir.ts'
import * as AbsoluteFile from './members/absolute-file.ts'
import * as RelativeDir from './members/relative-dir.ts'
import * as RelativeFile from './members/relative-file.ts'
import * as Extension from './types/extension.js'
import * as Segment from './types/segment.js'

/**
 * Schema for file paths that can be either absolute or relative.
 * Provides validation and encoding/decoding capabilities.
 */
export const FsPath = S.Union(
  AbsoluteFile.AbsoluteFile,
  AbsoluteDir.AbsoluteDir,
  RelativeFile.RelativeFile,
  RelativeDir.RelativeDir,
)
  .annotations({
    identifier: 'FilePath',
    title: 'File Path',
    description: 'A file path that can be either absolute or relative',
  })

/**
 * Type representing a file path (absolute or relative).
 */
export type FsPath = typeof FsPath.Type

/**
 * Check if a value is a valid file path.
 *
 * @param value - The value to check
 * @returns True if the value is a valid file path
 */
export const is = S.is(FsPath)

/**
 * Decode a value into a file path.
 * Returns an Effect that may fail with a parse error.
 */
export const decode = S.decode(FsPath)

/**
 * Synchronously decode a value into a file path.
 * Throws if the value is not a valid file path.
 */
export const decodeSync = S.decodeSync(FsPath)

/**
 * Encode a file path to a string representation.
 */
export const encode = S.encode(FsPath)

/**
 * Synchronously encode a file path to a string representation.
 */
export const encodeSync = S.encodeSync(FsPath)

/**
 * Check if a file path ends with one of the given extensions.
 * Uses the last segment to check for extensions.
 *
 * @param path - The file path to check
 * @param extensions - Single extension or array of extensions to check
 * @returns True if the path ends with one of the extensions
 *
 * @example
 * ```ts
 * const path = decodeSync('/src/index.js')
 * hasExtension(path, Extensions.ts) // true
 * hasExtension(path, Extensions.buildArtifacts) // false
 * ```
 */
export const hasExtension = (
  path: FsPath,
  extensions: Extension.Extension | readonly Extension.Extension[],
): boolean => {
  const exts = Array.isArray(extensions) ? extensions : [extensions]
  const segments = path.segments
  if (segments.length === 0) return false
  const lastSegment = segments[segments.length - 1]
  if (!lastSegment) return false
  return exts.some(ext => lastSegment.endsWith(ext))
}

/**
 * Get the name from a file path (last segment without extension).
 *
 * @param path - The file path
 * @returns The name without extension
 *
 * @example
 * ```ts
 * const path = decodeSync('/src/index.js')
 * getName(path) // 'index'
 * ```
 */
export const getTargetName = (path: FsPath): string => {
  const segments = path.segments
  if (segments.length === 0) return ''
  const lastSegment = segments[segments.length - 1]
  if (!lastSegment) return ''
  const lastDot = lastSegment.lastIndexOf('.')
  return lastDot > 0 ? lastSegment.slice(0, lastDot) : lastSegment
}

/**
 * Get the target (last segment with extension) from a file path.
 *
 * @param path - The file path
 * @returns The last segment
 *
 * @example
 * ```ts
 * const path = decodeSync('/src/index.js')
 * getTarget(path) // 'index.js'
 * ```
 */
export const getTarget = (path: FsPath): Segment.Segment => {
  const segments = path.segments
  if (segments.length === 0) return '' as Segment.Segment
  const lastSegment = segments[segments.length - 1]
  return lastSegment || ('' as Segment.Segment)
}
