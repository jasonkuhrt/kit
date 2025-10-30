import { Match } from 'effect'
import type { $Dir } from '../$Dir/$.js'
import type { $Rel } from '../$Rel/$.js'
import { AbsDir } from '../AbsDir/$.js'
import { AbsFile } from '../AbsFile/$.js'
import { RelDir } from '../RelDir/$.js'
import { RelFile } from '../RelFile/$.js'
import { resolveSegments } from './_internal.js'

/**
 * Type-level join operation.
 * Maps base and path types to their result type.
 */
export type join<
  Base extends $Dir,
  Path extends $Rel,
> = Base extends AbsDir ? (
    Path extends RelFile ? AbsFile
      : Path extends RelDir ? AbsDir
      : never
  )
  : Base extends RelDir ? (
      Path extends RelFile ? RelFile
        : Path extends RelDir ? RelDir
        : never
    )
  : never

/**
 * Join path segments into a file location.
 * Type-safe conditional return type ensures only valid combinations.
 *
 * @param dir - The base directory (absolute or relative)
 * @param rel - The relative path to join (file or directory)
 * @returns A path with the same absoluteness as dir and the same file/dir nature as rel
 *
 * @example
 * ```ts
 * const absDir = Path.AbsDir.make({ segments: ['home', 'user'] })
 * const relFile = Path.RelFile.make({
 *   segments: ['src'],
 *   fileName: { stem: 'index', extension: '.ts' }
 * })
 * const result = join(absDir, relFile)
 * // AbsFile with segments: ['home', 'user', 'src'], fileName: 'index.ts'
 * ```
 */
export const join = <
  $dir extends $Dir,
  $rel extends $Rel,
>(
  dir: $dir,
  rel: $rel,
): join<$dir, $rel> => {
  const rawSegments = [...dir.segments, ...rel.segments]
  const segments = resolveSegments(rawSegments)
  const fileName = 'fileName' in rel ? rel.fileName : null

  // The result keeps the absolute/relative nature of dir and file/dir nature of rel
  return Match.value(dir as $Dir).pipe(
    Match.tagsExhaustive({
      FsPathAbsDir: () => {
        if (fileName !== null) {
          return AbsFile.make({ segments, fileName })
        } else {
          return AbsDir.make({ segments })
        }
      },
      FsPathRelDir: () => {
        if (fileName !== null) {
          return RelFile.make({ segments, fileName })
        } else {
          return RelDir.make({ segments })
        }
      },
    }),
  ) as any
}
