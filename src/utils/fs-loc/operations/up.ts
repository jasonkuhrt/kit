import * as FsLoc from '../$$.js'
import * as Inputs from '../inputs.js'
import { set } from './_internal.js'

/**
 * Type-level up operation.
 * Returns the same FsLoc type with path segments modified.
 */
export type Up<$Loc extends FsLoc.FsLoc> = $Loc

/**
 * Type-level up wrapper for Input types.
 */
export type up<$Loc extends Inputs.Input.Any> = Up<Inputs.normalize<$Loc>>

/**
 * Move up by one segment on path.
 */
export const up = <loc extends Inputs.Input.Any>(
  loc: Inputs.Validate.Any<loc>,
): up<loc> => {
  const normalized = Inputs.normalize(loc)
  return set(normalized, { segments: normalized.path.segments.slice(0, -1) }) as any
}
