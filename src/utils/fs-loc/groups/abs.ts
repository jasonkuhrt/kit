import { Schema as S } from 'effect'
import * as FsLoc from '../fs-loc.js'

/**
 * Union of all absolute location types.
 */
export const Abs = S.Union(
  FsLoc.AbsFile.AbsFile,
  FsLoc.AbsDir.AbsDir,
)

/**
 * Type representing any absolute location.
 */
export type Abs = typeof Abs.Type

/**
 * Check if a value is an absolute location.
 */
export const is = S.is(Abs)
