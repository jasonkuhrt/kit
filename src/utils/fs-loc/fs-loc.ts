import { Schema as S } from 'effect'
import * as Inputs from './inputs.js'
import { AbsDir } from './members/abs-dir.js'
import { AbsFile } from './members/abs-file.js'
import { RelDir } from './members/rel-dir.js'
import { RelFile } from './members/rel-file.js'

export { AbsDir, AbsFile, RelDir, RelFile }

/**
 * Union of all location types.
 */
export const FsLoc = S.Union(
  AbsFile.String,
  AbsDir.String,
  RelFile.String,
  RelDir.String,
)

/**
 * Type representing any location.
 */
export type FsLoc = typeof FsLoc.Type

export const fromString = Inputs.normalize(FsLoc)

export const normalizeInput = Inputs.normalizeDynamic(FsLoc)

export const encodeSync = S.encodeSync(FsLoc)
export const encode = S.encode(FsLoc)
export const decodeSync = S.decodeSync(FsLoc)
export const decode = S.decode(FsLoc)

/**
 * Equivalence for FsLoc union type.
 */
export const equivalence = S.equivalence(FsLoc)
