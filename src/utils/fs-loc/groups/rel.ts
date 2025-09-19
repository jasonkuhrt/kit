import { Schema as S } from 'effect'
import * as FsLoc from '../fs-loc.ts'

/**
 * Union of all relative location types.
 */
export const Rel = S.Union(
  FsLoc.RelFile.RelFile,
  FsLoc.RelDir.RelDir,
)

/**
 * Type representing any relative location.
 */
export type Rel = typeof Rel.Type

/**
 * Check if a value is a relative location.
 */
export const is = S.is(Rel)
