import type { Path } from '#fs/fs'
import type { Guard, Input } from '../inputs.js'
import { normalizeDynamic } from '../inputs.js'
import { Schema } from '../Schema.js'

const normalizer = normalizeDynamic(Schema)

export type PathWithEmptySegments<T extends Path> = T & { segments: readonly [] }

/**
 * Type guard to check if a path is root (zero segments).
 * Narrows the type to have an empty segments array.
 *
 * @param path - The path to check (absolute or relative)
 * @returns True if the path has zero segments
 *
 * @example
 * ```ts
 * const absPath = FsLoc.Path.Abs.make({ segments: [] })
 * if (isRoot(absPath)) {
 *   // TypeScript knows: absPath.segments is readonly []
 * }
 * ```
 */
export function isRoot<$input extends Input>($input: $input): boolean {
  const path = normalizer($input) as Path
  return path.segments.length === 0
}

/**
 * Type guard to check if a path is top-level (one segment).
 * Narrows the type to have exactly one segment.
 *
 * @param path - The path to check (absolute or relative)
 * @returns True if the path has exactly one segment
 *
 * @example
 * ```ts
 * const absPath = FsLoc.Path.Abs.make({ segments: ['docs'] })
 * if (isTop(absPath)) {
 *   // TypeScript knows: absPath.segments is readonly [string]
 *   const [segment] = absPath.segments // Safe!
 * }
 * ```
 */
export function isTop<T extends Path>(path: T): path is PathWithOneSegment<T> {
  return path.segments.length === 1
}

export type PathWithOneSegment<T extends Path> = T & { segments: readonly [string] }

/**
 * Type guard to check if a path is sub-level (more than one segment).
 * Narrows the type to have at least two segments.
 *
 * @param path - The path to check (absolute or relative)
 * @returns True if the path has more than one segment
 *
 * @example
 * ```ts
 * const absPath = FsLoc.Path.Abs.make({ segments: ['docs', 'guides', 'intro'] })
 * if (isSub(absPath)) {
 *   // TypeScript knows: absPath.segments is readonly [string, string, ...string[]]
 * }
 * ```
 */
export function isSub<T extends Path>(path: T): path is PathWithTwoOrMoreSegments<T> {
  return path.segments.length > 1
}

export type PathWithTwoOrMoreSegments<T extends Path> = T & { segments: readonly [string, string, ...string[]] }
