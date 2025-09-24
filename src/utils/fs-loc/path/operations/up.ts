import { Abs } from '../abs.js'
import type { Path } from '../path.js'
import { Rel } from '../rel.js'

/**
 * Move up one level in the path hierarchy by removing the last segment.
 *
 * @param $path - The path to move up from
 * @returns A new path with the last segment removed
 *
 * @example
 * ```ts
 * const absPath = Path.Abs.make({ segments: ['home', 'user', 'docs'] })
 * const parent = up(absPath) // segments: ['home', 'user']
 *
 * const relPath = Path.Rel.make({ segments: ['src', 'lib', 'utils'] })
 * const parent2 = up(relPath) // segments: ['src', 'lib']
 *
 * const rootPath = Path.Abs.make({ segments: [] })
 * const stillRoot = up(rootPath) // segments: [] (stays at root)
 * ```
 */
export function up<$path extends Path>($path: $path): $path {
  const newSegments = $path.segments.slice(0, -1)

  if ($path._tag === 'PathAbs') {
    return Abs.make({ segments: newSegments }) as any
  } else {
    return Rel.make({ segments: newSegments }) as any
  }
}

/**
 * Curried variant of up - takes a path and returns the parent path.
 * Useful for functional composition.
 *
 * @example
 * ```ts
 * const paths = [path1, path2, path3]
 * const parents = paths.map(upPath)
 * ```
 */
export const upPath = <T extends Path>(path: T): T => up(path)
