import * as FsLoc from '../$$.js'
import * as Groups from '../groups/$$.js'
import * as Inputs from '../inputs.js'
import { Path } from '../path/$.js'
import { join } from './join.js'

/**
 * Type-level ToAbs operation.
 * Maps relative location types to their absolute counterparts.
 */
export type ToAbs<R extends Groups.Rel.Rel> = R extends FsLoc.RelFile.RelFile ? FsLoc.AbsFile.AbsFile
  : R extends FsLoc.RelDir.RelDir ? FsLoc.AbsDir.AbsDir
  : Groups.Abs.Abs

/**
 * Type-level toAbs wrapper for Input types.
 */
export type toAbs<$Input extends Inputs.Input.Rel> = ToAbs<Inputs.normalize<$Input>>

/**
 * Convert a relative location to an absolute location.
 *
 * @param loc - The relative location to convert
 * @param base - Optional base directory to resolve against. If not provided, simply converts ./path to /path
 * @returns An absolute location
 *
 * @example
 * ```ts
 * const relFile = FsLoc.RelFile.decodeSync('./src/index.ts')
 * const absFile = toAbs(relFile) // /src/index.ts (just re-tags)
 *
 * const base = FsLoc.AbsDir.decodeSync('/home/user/')
 * const absFile2 = toAbs(relFile, base) // /home/user/src/index.ts (resolves against base)
 * ```
 */
export const toAbs = <loc extends Inputs.Input.Rel>(
  loc: Inputs.Validate.Rel<loc>,
  base?: FsLoc.AbsDir.AbsDir | string,
): toAbs<loc> => {
  const normalized = Inputs.normalize(loc)
  if (base) {
    const normalizedBase = typeof base === 'string' ? FsLoc.AbsDir.decodeSync(base) : base
    // Use join to combine base with relative location
    return join(normalizedBase, normalized as Groups.Rel.Rel) as any
  }

  // No base: just convert relative to absolute by re-tagging
  // This essentially changes ./path to /path
  if (Groups.File.is(normalized)) {
    const file = (normalized as any).file
    return FsLoc.AbsFile.make({
      path: Path.Abs.make({ segments: normalized.path.segments }),
      file,
    }) as any
  } else {
    return FsLoc.AbsDir.make({
      path: Path.Abs.make({ segments: normalized.path.segments }),
    }) as any
  }
}
