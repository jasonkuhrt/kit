import { Match } from 'effect'
import * as FsLoc from '../$$.js'
import { Path } from '../path/$.js'
import * as File from '../types/file.js'

/**
 * Internal unsafe setter for FsLoc operations.
 * Updates segments and/or file properties while preserving the location's type structure.
 *
 * @internal
 */
export const set = (
  loc: FsLoc.FsLoc,
  options: { segments?: readonly string[]; file?: File.File | null },
): FsLoc.FsLoc => {
  const segments = options.segments ?? loc.path.segments
  const file = options.file !== undefined ? options.file : ('file' in loc ? loc.file : undefined)

  return Match.value(loc).pipe(
    Match.tagsExhaustive({
      LocAbsFile: () =>
        FsLoc.AbsFile.make({
          path: Path.Abs.make({ segments }),
          file: file!,
        }),
      LocRelFile: () =>
        FsLoc.RelFile.make({
          path: Path.Rel.make({ segments }),
          file: file!,
        }),
      LocAbsDir: () =>
        FsLoc.AbsDir.make({
          path: Path.Abs.make({ segments }),
        }),
      LocRelDir: () =>
        FsLoc.RelDir.make({
          path: Path.Rel.make({ segments }),
        }),
    }),
  )
}

/**
 * Resolve path segments by collapsing parent references (..)
 * @internal
 */
export const resolveSegments = (segments: readonly string[]): string[] => {
  const resolved: string[] = []

  for (const segment of segments) {
    if (segment === '..') {
      // Remove the last segment if it exists and we're not at root
      if (resolved.length > 0) {
        resolved.pop()
      }
    } else if (segment !== '.' && segment !== '') {
      // Skip current directory references and empty segments
      resolved.push(segment)
    }
  }

  return resolved
}
