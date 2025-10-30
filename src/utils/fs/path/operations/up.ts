import type { Path } from '#fs/fs'
import { Match } from 'effect'
import { AbsDir } from '../AbsDir/_.js'
import { AbsFile } from '../AbsFile/_.js'
import type { Guard, Input, normalize } from '../inputs.js'
import { normalizeDynamic } from '../inputs.js'
import { RelDir } from '../RelDir/_.js'
import { RelFile } from '../RelFile/_.js'
import { Schema } from '../Schema.js'

const normalizer = normalizeDynamic(Schema)

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
export function up<$input extends Input>($input: $input): normalize<$input> {
  const $path = normalizer($input) as Path
  const newSegments = $path.segments.slice(0, -1)

  return Match.value($path).pipe(
    Match.tagsExhaustive({
      FsPathAbsFile: (file) => AbsFile.make({ segments: newSegments, fileName: file.fileName }),
      FsPathAbsDir: () => AbsDir.make({ segments: newSegments }),
      FsPathRelFile: (file) => RelFile.make({ segments: newSegments, fileName: file.fileName }),
      FsPathRelDir: () => RelDir.make({ segments: newSegments }),
    }),
  ) as any
}
