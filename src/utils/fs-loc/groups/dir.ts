import { Schema as S } from 'effect'
import * as FsLoc from '../fs-loc.js'

/**
 * Union of all directory location types.
 */
export const Dir = S.Union(
  FsLoc.AbsDir.AbsDir,
  FsLoc.RelDir.RelDir,
)

/**
 * Type representing any directory location.
 */
export type Dir = typeof Dir.Type

/**
 * Check if a value is a directory location.
 */
export const is = S.is(Dir)
