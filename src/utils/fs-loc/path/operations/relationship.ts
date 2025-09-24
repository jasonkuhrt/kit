import { Array, Equivalence } from 'effect'
import type { Path } from '../path.js'

// Create an equivalence for string arrays
const segmentsEquivalence = Array.getEquivalence(Equivalence.string)

/**
 * Check if one path is a descendant of another path.
 * Both paths must be of the same type (both absolute or both relative).
 *
 * @param child - The path that might be a descendant
 * @param parent - The path that might be an ancestor
 * @returns True if child is under parent, false otherwise
 *
 * @example
 * ```ts
 * const parent = FsLoc.Path.Abs.make({ segments: ['home', 'user'] })
 * const child = FsLoc.Path.Abs.make({ segments: ['home', 'user', 'docs'] })
 * isDescendantOf(child, parent) // true
 * ```
 */
export function isDescendantOf(child: Path, parent: Path): boolean {
  // Can't compare paths of different types
  if (child._tag !== parent._tag) {
    return false
  }

  const parentSegments = parent.segments
  const childSegments = child.segments

  // Child must have at least as many segments as parent
  if (childSegments.length < parentSegments.length) {
    return false
  }

  // Check if parent segments match the beginning of child segments
  return isSegmentsStartsWith(childSegments, parentSegments)
}

/**
 * Check if one path is an ancestor of another path.
 * Both paths must be of the same type (both absolute or both relative).
 * This is the inverse of isDescendantOf.
 *
 * @param parent - The path that might be an ancestor
 * @param child - The path that might be a descendant
 * @returns True if parent is above child, false otherwise
 */
export function isAncestorOf(parent: Path, child: Path): boolean {
  return isDescendantOf(child, parent)
}

/**
 * Check if one path starts with another path's segments.
 *
 * @param segments - The segments to check
 * @param prefix - The prefix segments to look for
 * @returns True if segments starts with prefix
 *
 * @example
 * ```ts
 * isSegmentsStartsWith(['a', 'b', 'c'], ['a', 'b']) // true
 * isSegmentsStartsWith(['a', 'b'], ['a', 'b', 'c']) // false
 * isSegmentsStartsWith(['x', 'y'], ['a', 'b']) // false
 * ```
 */
export function isSegmentsStartsWith(segments: readonly string[], prefix: readonly string[]): boolean {
  if (prefix.length > segments.length) {
    return false
  }

  for (let i = 0; i < prefix.length; i++) {
    const segment = segments[i]
    const prefixSegment = prefix[i]
    if (segment === undefined || prefixSegment === undefined || segment !== prefixSegment) {
      return false
    }
  }

  return true
}

/**
 * Check if two paths have the same segments.
 *
 * @param a - First path
 * @param b - Second path
 * @returns True if paths have identical segments
 */
export function isSameSegments(a: Path, b: Path): boolean {
  return segmentsEquivalence(a.segments, b.segments)
}

/**
 * Get the relative path from one path to another.
 * Removes the ancestor path prefix from the descendant.
 * Returns null if child is not a descendant of parent.
 *
 * @param child - The descendant path
 * @param parent - The ancestor path
 * @returns The relative segments, or null if not a descendant
 *
 * @example
 * ```ts
 * const parent = FsLoc.Path.Abs.make({ segments: ['home', 'user'] })
 * const child = FsLoc.Path.Abs.make({ segments: ['home', 'user', 'docs', 'readme'] })
 * getRelativeSegments(child, parent) // ['docs', 'readme']
 * ```
 */
export function getRelativeSegments(child: Path, parent: Path): readonly string[] | null {
  if (!isDescendantOf(child, parent)) {
    return null
  }

  return child.segments.slice(parent.segments.length)
}

/**
 * Find the common ancestor segments of two paths.
 *
 * @param a - First path
 * @param b - Second path
 * @returns The common prefix segments
 *
 * @example
 * ```ts
 * const a = FsLoc.Path.Abs.make({ segments: ['home', 'user', 'docs'] })
 * const b = FsLoc.Path.Abs.make({ segments: ['home', 'user', 'pictures'] })
 * getCommonAncestorSegments(a, b) // ['home', 'user']
 * ```
 */
export function getCommonAncestorSegments(a: Path, b: Path): readonly string[] {
  const minLength = Math.min(a.segments.length, b.segments.length)
  const common: string[] = []

  for (let i = 0; i < minLength; i++) {
    const aSegment = a.segments[i]
    const bSegment = b.segments[i]
    if (aSegment !== undefined && bSegment !== undefined && aSegment === bSegment) {
      common.push(aSegment)
    } else {
      break
    }
  }

  return common
}

// ============================================================================
// Curried variants
// ============================================================================

/**
 * Curried variant of isDescendantOf - provide parent first, then child.
 */
export const isDescendantOfPath = (parent: Path) => (child: Path): boolean => isDescendantOf(child, parent)

/**
 * Curried variant of isAncestorOf - provide child first, then parent.
 */
export const isAncestorOfPath = (child: Path) => (parent: Path): boolean => isAncestorOf(parent, child)

/**
 * Curried variant of isSegmentsStartsWith - provide prefix first, then segments.
 */
export const isSegmentsStartsWithPrefix = (prefix: readonly string[]) => (segments: readonly string[]): boolean =>
  isSegmentsStartsWith(segments, prefix)

/**
 * Curried variant of isSameSegments - provide one path first, then the other.
 */
export const isSameSegmentsAs = (a: Path) => (b: Path): boolean => isSameSegments(a, b)

/**
 * Curried variant of getRelativeSegments - provide parent first, then child.
 */
export const getRelativeSegmentsFrom = (parent: Path) => (child: Path): readonly string[] | null =>
  getRelativeSegments(child, parent)

/**
 * Curried variant of getCommonAncestorSegments - provide one path first, then the other.
 */
export const getCommonAncestorSegmentsWith = (a: Path) => (b: Path): readonly string[] =>
  getCommonAncestorSegments(a, b)
