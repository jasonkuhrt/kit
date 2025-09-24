import * as FsLoc from '../fs-loc.js'
import * as Inputs from '../inputs.js'
import { Path } from '../path/$.js'

export const isRoot = <loc extends Inputs.Input.Any>(
  loc: Inputs.Guard.Any<loc>,
): boolean => {
  const normalized = FsLoc.normalizeInput(loc)
  return Path.isRoot(normalized.path)
}
