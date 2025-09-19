import { Schema as S } from 'effect'
import * as AbsDir from './members/abs-dir.js'
import * as AbsFile from './members/abs-file.js'
import * as RelDir from './members/rel-dir.js'
import * as RelFile from './members/rel-file.js'

export { AbsDir, AbsFile, RelDir, RelFile }

/**
 * Union of all location types.
 */
export const FsLoc = S.Union(
  AbsFile.AbsFile,
  AbsDir.AbsDir,
  RelFile.RelFile,
  RelDir.RelDir,
)

/**
 * Type representing any location.
 */
export type FsLoc = typeof FsLoc.Type

export const encodeSync = S.encodeSync(FsLoc)
export const encode = S.encode(FsLoc)
export const decodeSync = S.decodeSync(FsLoc)
export const decode = S.decode(FsLoc)
