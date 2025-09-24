import * as FsLoc from '../fs-loc.js'
import * as Inputs from '../inputs.js'

export const isRoot = <loc extends Inputs.Input.Any>(
  loc: Inputs.Guard.Any<loc>,
): boolean => {
  const normalized = FsLoc.normalizeInput(loc)
  return normalized.path.segments.length === 0
}
