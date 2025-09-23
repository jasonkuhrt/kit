import * as Inputs from '../inputs.js'

export const isRoot = <loc extends Inputs.Input.Any>(
  loc: Inputs.Validate.Any<loc>,
): boolean => {
  const normalized = Inputs.normalize(loc)
  return normalized.path.segments.length === 0
}
