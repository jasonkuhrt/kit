import type { Path } from '#fs/fs'
import { Match } from 'effect'
import { AbsDir } from '../AbsDir/_.js'
import { AbsFile } from '../AbsFile/_.js'
import { RelDir } from '../RelDir/_.js'
import { RelFile } from '../RelFile/_.js'
import type { FileName } from '../types/fileName.js'

/**
 * Internal unsafe setter for Path operations.
 * Updates segments and/or fileName properties while preserving the path's type structure.
 *
 * @internal
 */
export const set = (
  path: Path,
  options: { segments?: readonly string[]; fileName?: FileName | null },
): Path => {
  const segments = options.segments ?? path.segments
  const fileName = options.fileName !== undefined ? options.fileName : ('fileName' in path ? path.fileName : undefined)

  return Match.value(path).pipe(
    Match.tagsExhaustive({
      FsPathAbsFile: () =>
        AbsFile.make({
          segments,
          fileName: fileName!,
        }),
      FsPathRelFile: () =>
        RelFile.make({
          segments,
          fileName: fileName!,
        }),
      FsPathAbsDir: () =>
        AbsDir.make({
          segments,
        }),
      FsPathRelDir: () =>
        RelDir.make({
          segments,
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
