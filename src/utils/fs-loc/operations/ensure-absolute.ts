import { Pro } from '#pro'
import * as FsLoc from '../$$.js'
import * as Groups from '../groups/$$.js'
import * as Inputs from '../inputs.js'
import { join } from './join.js'

/**
 * Type-level EnsureAbsolute operation.
 */
export type EnsureAbsolute<
  L extends FsLoc.FsLoc,
  B extends FsLoc.AbsDir.AbsDir | undefined = undefined,
> = L extends FsLoc.AbsFile.AbsFile ? FsLoc.AbsFile.AbsFile
  : L extends FsLoc.AbsDir.AbsDir ? FsLoc.AbsDir.AbsDir
  : L extends FsLoc.RelFile.RelFile ? (B extends undefined ? Groups.Abs.Abs : FsLoc.AbsFile.AbsFile)
  : L extends FsLoc.RelDir.RelDir ? (B extends undefined ? Groups.Abs.Abs : FsLoc.AbsDir.AbsDir)
  : L extends Groups.Abs.Abs ? Groups.Abs.Abs
  : L extends Groups.Rel.Rel ? Groups.Abs.Abs
  : Groups.Abs.Abs

/**
 * Type-level ensureAbsolute wrapper for Input types.
 */
export type ensureAbsolute<
  $Loc extends Inputs.Input.Any,
  $Base extends Inputs.Input.AbsDir | undefined = undefined,
> = EnsureAbsolute<
  Inputs.normalize<$Loc>,
  $Base extends Inputs.Input.AbsDir ? Inputs.normalize<$Base> : undefined
>

/**
 * Ensure a location is absolute, converting relative locations to absolute.
 *
 * @param loc - The location to ensure is absolute
 * @param base - The base directory to resolve relative locations against (defaults to current working directory)
 * @returns An absolute location
 *
 * @example
 * ```ts
 * const relPath = FsLoc.RelFile.decodeSync('./foo/bar.ts')
 * const cwd = FsLoc.AbsDir.decodeSync(process.cwd())
 * const absPath = ensureAbsolute(relPath, cwd) // AbsFile
 * ```
 */
export const ensureAbsolute = <
  loc extends Inputs.Input.Any,
  base extends Inputs.Input.AbsDir | undefined = undefined,
>(
  loc: Inputs.Validate.Any<loc>,
  base?: base,
): ensureAbsolute<loc, base> => {
  const normalizedLoc = Inputs.normalize(loc)
  // If already absolute, return as-is
  if (Groups.Abs.is(normalizedLoc)) {
    return normalizedLoc as any
  }

  // Relative location needs a base
  const resolvedBase = base ? Inputs.normalize(base) : Pro.cwd()

  // Join base with relative location
  if (FsLoc.RelFile.is(normalizedLoc)) {
    return join(resolvedBase, normalizedLoc) as any
  } else {
    return join(resolvedBase, normalizedLoc as FsLoc.RelDir.RelDir) as any
  }
}
