import * as FsLoc from '../$$.js'
import * as Groups from '../groups/$$.js'
import * as Inputs from '../inputs.js'
import { Path } from '../path/$.js'
import { resolveSegments } from './_internal.js'

/**
 * Type-level join operation.
 * Maps base and path types to their result type.
 */
export type Join<
  Base extends Groups.Dir.Dir,
  Path extends Groups.Rel.Rel,
> = Base extends FsLoc.AbsDir.AbsDir ? (
    Path extends FsLoc.RelFile.RelFile ? FsLoc.AbsFile.AbsFile
      : Path extends FsLoc.RelDir.RelDir ? FsLoc.AbsDir.AbsDir
      : never
  )
  : Base extends FsLoc.RelDir.RelDir ? (
      Path extends FsLoc.RelFile.RelFile ? FsLoc.RelFile.RelFile
        : Path extends FsLoc.RelDir.RelDir ? FsLoc.RelDir.RelDir
        : never
    )
  : never

/**
 * Type-level join wrapper for Input types.
 * Normalizes inputs and delegates to Join.
 */
export type join<
  $Dir extends Inputs.Input.Dir,
  $Rel extends Inputs.Input.Rel,
> = Join<Inputs.normalize<$Dir>, Inputs.normalize<$Rel>>

/**
 * Join path segments into a file location.
 * Type-safe conditional return type ensures only valid combinations.
 */
export const join = <
  dir extends Inputs.Input.Dir,
  rel extends Inputs.Input.Rel,
>(
  dir: Inputs.Validate.Dir<dir>,
  rel: Inputs.Validate.Rel<rel>,
): join<dir, rel> => {
  const normalizedDir = Inputs.normalize(dir)
  const normalizedRel = Inputs.normalize(rel)
  const rawSegments = [...normalizedDir.path.segments, ...normalizedRel.path.segments]
  const segments = resolveSegments(rawSegments)
  const file = 'file' in normalizedRel ? normalizedRel.file : null

  // The result keeps the absolute/relative nature of dir and file/dir nature of rel
  // If rel is a file, we need to create a file location, not a directory
  const isAbsolute = Path.Abs.is(normalizedDir.path)

  if (file !== null) {
    // Joining with a file - create a file location
    const result = isAbsolute
      ? FsLoc.AbsFile.make({
        path: Path.Abs.make({ segments }),
        file,
      })
      : FsLoc.RelFile.make({
        path: Path.Rel.make({ segments }),
        file,
      })
    return result as join<dir, rel>
  } else {
    // Joining with a directory - create a directory location
    const result = isAbsolute
      ? FsLoc.AbsDir.make({
        path: Path.Abs.make({ segments }),
      })
      : FsLoc.RelDir.make({
        path: Path.Rel.make({ segments }),
      })
    return result as join<dir, rel>
  }
}
