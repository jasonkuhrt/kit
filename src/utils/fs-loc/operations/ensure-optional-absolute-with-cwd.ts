import { Pro } from '#pro'
import * as FsLoc from '../fs-loc.js'
import * as Groups from '../groups/$$.js'
import * as Inputs from '../inputs.js'
import { ensureAbsolute } from './ensure-absolute.js'

/**
 * Type-level EnsureOptionalAbsoluteWithCwd operation.
 * Returns AbsDir when undefined, preserves file/dir distinction for other inputs.
 */
export type EnsureOptionalAbsoluteWithCwd<L extends FsLoc.FsLoc | undefined> = L extends undefined ? FsLoc.AbsDir
  : L extends FsLoc.AbsFile ? FsLoc.AbsFile
  : L extends FsLoc.AbsDir ? FsLoc.AbsDir
  : L extends FsLoc.RelFile ? FsLoc.AbsFile
  : L extends FsLoc.RelDir ? FsLoc.AbsDir
  : Groups.Abs.Abs

/**
 * Type-level ensureOptionalAbsoluteWithCwd wrapper for Input types.
 */
export type ensureOptionalAbsoluteWithCwd<$Loc extends Inputs.Input.Any | undefined> = EnsureOptionalAbsoluteWithCwd<
  $Loc extends Inputs.Input.Any ? Inputs.normalize<$Loc> : undefined
>

/**
 * Ensure an optional location is absolute, using current working directory as default.
 *
 * @param loc - The optional location to ensure is absolute
 * @returns An absolute location or current working directory if loc is undefined
 *
 * @example
 * ```ts
 * const loc = undefined
 * const result = ensureOptionalAbsoluteWithCwd(loc) // returns cwd as AbsDir
 * ```
 */
export const ensureOptionalAbsoluteWithCwd = <L extends Inputs.Input.Any | undefined>(
  loc: L extends Inputs.Input.Any ? Inputs.Guard.Any<L> : undefined,
): ensureOptionalAbsoluteWithCwd<L> => {
  const base = Pro.cwd()

  if (loc === undefined) {
    return base as any
  }

  return ensureAbsolute(loc as any, base) as any
}
