import { Pro } from '#pro'
import * as FsLoc from '../fs-loc.js'
import * as Groups from '../groups/$$.js'
import * as Inputs from '../inputs.js'
import { join } from './join.js'

/**
 * Type-level EnsureAbsolute operation.
 */
export type EnsureAbsolute<
  L extends FsLoc.FsLoc,
  B extends FsLoc.AbsDir | undefined = undefined,
> = L extends FsLoc.AbsFile ? FsLoc.AbsFile
  : L extends FsLoc.AbsDir ? FsLoc.AbsDir
  : L extends FsLoc.RelFile ? (B extends undefined ? Groups.Abs.Abs : FsLoc.AbsFile)
  : L extends FsLoc.RelDir ? (B extends undefined ? Groups.Abs.Abs : FsLoc.AbsDir)
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
 * const relPath = FsLoc.RelFile.decodeStringSync('./foo/bar.ts')
 * const cwd = FsLoc.AbsDir.decodeStringSync(process.cwd())
 * const absPath = ensureAbsolute(relPath, cwd) // AbsFile
 * ```
 */
export const ensureAbsolute = <
  loc extends Inputs.Input.Any,
  base extends Inputs.Input.AbsDir,
>(
  loc: Inputs.Guard.Any<loc>,
  base?: base,
): ensureAbsolute<loc, base> => {
  const loc$ = FsLoc.normalizeInput(loc)
  // If already absolute, return as-is
  if (Groups.Abs.is(loc$)) {
    return loc$ as any
  }

  // Relative location needs a base
  const resolvedBase = base ? FsLoc.normalizeInput(base) : Pro.cwd()

  // Join base with relative location
  if (FsLoc.RelFile.is(loc$)) {
    return join(resolvedBase, loc$ as FsLoc.RelFile) as any
  } else {
    return join(resolvedBase, loc$ as FsLoc.RelDir) as any
  }
}
