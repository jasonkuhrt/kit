import * as FsLoc from '../fs-loc.js'
import * as Groups from '../groups/$$.js'
import * as Inputs from '../inputs.js'
import { ensureAbsolute } from './ensure-absolute.js'

/**
 * Type-level EnsureOptionalAbsolute operation.
 */
export type EnsureOptionalAbsolute<
  L extends FsLoc.FsLoc | undefined,
  B extends FsLoc.AbsDir,
> = L extends undefined ? B
  : L extends FsLoc.AbsFile ? FsLoc.AbsFile
  : L extends FsLoc.AbsDir ? FsLoc.AbsDir
  : L extends FsLoc.RelFile ? FsLoc.AbsFile
  : L extends FsLoc.RelDir ? FsLoc.AbsDir
  : Groups.Abs.Abs

/**
 * Type-level ensureOptionalAbsolute wrapper for Input types.
 */
export type ensureOptionalAbsolute<
  $Loc extends Inputs.Input.Any | undefined,
  $Base extends Inputs.Input.AbsDir,
> = EnsureOptionalAbsolute<
  $Loc extends Inputs.Input.Any ? Inputs.normalize<$Loc> : undefined,
  Inputs.normalize<$Base>
>

/**
 * Ensure an optional location is absolute.
 *
 * @param loc - The optional location to ensure is absolute
 * @param base - The base directory to resolve relative locations against or use as default
 * @returns An absolute location or the base if loc is undefined
 *
 * @example
 * ```ts
 * const base = FsLoc.AbsDir.decodeStringSync('/home/user/')
 * const loc = undefined
 * const result = ensureOptionalAbsolute(loc, base) // returns base
 * ```
 */
export const ensureOptionalAbsolute = <
  loc extends Inputs.Input.Any | undefined,
  base extends Inputs.Input.AbsDir,
>(
  loc: loc extends Inputs.Input.Any ? Inputs.Guard.Any<loc> : undefined,
  base: Inputs.Guard.AbsDir<base>,
): ensureOptionalAbsolute<loc, base> => {
  const normalizedBase = FsLoc.normalizeInput(base)
  if (loc === undefined) {
    return normalizedBase as any
  }
  return ensureAbsolute(loc as any, normalizedBase) as any
}
