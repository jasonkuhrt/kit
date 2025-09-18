import { Brand, Schema as S } from 'effect'
import * as Extension from './extension.js'

/**
 * Path separator constant.
 */
export const SEPARATOR = '/' as const

/**
 * A segment of a file path, branded for type safety.
 */
export type Segment = string & Brand.Brand<'FilePathSegment'>

/**
 * Schema for validating file path segments.
 */
export const Segment = S.String.pipe(
  S.brand('FilePathSegment'),
  S.annotations({
    identifier: 'FilePathSegment',
    description: 'A segment of a file path',
  }),
)

/**
 * Create a file path segment.
 *
 * @param path - The path string to convert to a segment
 * @returns A branded file path segment
 */
export const make = (path: string): Segment => path as Segment

/**
 * Check if a value is a file path segment.
 *
 * @param value - The value to check
 * @returns True if the value is a segment
 */
export const is = (value: unknown): value is Segment => typeof value === 'string'

/**
 * Decode a value into a file path segment.
 */
export const decode = S.decode(Segment)

/**
 * Synchronously decode a value into a file path segment.
 */
export const decodeSync = S.decodeSync(Segment)

/**
 * Encode a file path segment.
 */
export const encode = S.encode(Segment)

/**
 * Add extension to a file path.
 *
 * @param path - The file path segment
 * @param extension - The extension to add
 * @returns The path with extension added
 *
 * @example
 * ```ts
 * ensureExtension(make('file'), Extension.make('ts')) // 'file.ts'
 * ```
 */
export const ensureExtension = (
  path: Segment,
  extension: Extension.Extension,
): Segment => {
  return `${path}.${extension}` as Segment
}

/**
 * Remove extension from a file path.
 *
 * @param path - The file path segment
 * @returns The path without extension
 *
 * @example
 * ```ts
 * withoutExtension(make('file.js')) // 'file'
 * withoutExtension(make('path/file.js')) // 'path/file'
 * ```
 */
export const withoutExtension = (path: Segment): Segment => {
  const lastDotIndex = path.lastIndexOf('.')
  const lastSlashIndex = path.lastIndexOf(SEPARATOR)

  // Only remove extension if dot comes after last separator
  if (lastDotIndex > lastSlashIndex && lastDotIndex !== -1) {
    return path.slice(0, lastDotIndex) as Segment
  }
  return path
}

/**
 * Get the extension from a file path.
 *
 * @param path - The file path segment
 * @returns The extension, or undefined if no extension
 *
 * @example
 * ```ts
 * getExtension(make('file.js')) // Extension.make('js')
 * getExtension(make('file')) // undefined
 * ```
 */
export const getExtension = (path: Segment): Extension.Extension | undefined => {
  const lastDotIndex = path.lastIndexOf('.')
  const lastSlashIndex = path.lastIndexOf(SEPARATOR)

  // Only get extension if dot comes after last separator
  if (lastDotIndex > lastSlashIndex && lastDotIndex !== -1) {
    return Extension.make(path.slice(lastDotIndex + 1))
  }
  return undefined
}

/**
 * Get the file name from a path.
 *
 * @param path - The file path segment
 * @returns The file name including extension
 *
 * @example
 * ```ts
 * getFileName(make('path/to/file.js')) // 'file.js'
 * ```
 */
export const getFileName = (path: Segment): string => {
  const lastSlashIndex = path.lastIndexOf(SEPARATOR)
  return lastSlashIndex === -1 ? path : path.slice(lastSlashIndex + 1)
}

/**
 * Get the directory from a path.
 *
 * @param path - The file path segment
 * @returns The directory path as a segment
 *
 * @example
 * ```ts
 * getDirectory(make('path/to/file.js')) // 'path/to'
 * ```
 */
export const getDirectory = (path: Segment): Segment => {
  const lastSlashIndex = path.lastIndexOf(SEPARATOR)
  if (lastSlashIndex === -1) return '.' as Segment
  if (lastSlashIndex === 0) return SEPARATOR as Segment
  return path.slice(0, lastSlashIndex) as Segment
}

/**
 * Join multiple path segments together.
 *
 * @param segments - The segments to join
 * @returns The joined path as a segment
 *
 * @example
 * ```ts
 * join(make('path'), make('to'), make('file.js')) // 'path/to/file.js'
 * ```
 */
export const join = (...segments: ReadonlyArray<Segment>): Segment => {
  if (segments.length === 0) {
    return '' as Segment
  }

  // Filter out empty segments and join with separator
  const filtered = segments.filter(s => s !== '')
  if (filtered.length === 0) {
    return '' as Segment
  }

  return filtered.join(SEPARATOR) as Segment
}

/**
 * Upsert extension - adds extension if missing, replaces if present.
 *
 * @param path - The file path
 * @param extension - The extension to upsert
 * @returns The path with upserted extension
 *
 * @example
 * ```ts
 * upsertExtension(make('file'), Extension.make('ts')) // 'file.ts'
 * upsertExtension(make('file.js'), Extension.make('ts')) // 'file.ts'
 * ```
 */
export const upsertExtension = (
  path: Segment,
  extension: Extension.Extension,
): Segment => {
  const currentExt = getExtension(path)

  if (currentExt) {
    // Replace existing extension
    return ensureExtension(withoutExtension(path), extension)
  } else {
    // Add extension
    return ensureExtension(path, extension)
  }
}
