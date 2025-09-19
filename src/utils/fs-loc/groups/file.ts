import { Schema as S } from 'effect'
import * as FsLoc from '../fs-loc.js'

/**
 * Union of all file location types.
 */
export const File = S.Union(
  FsLoc.AbsFile.AbsFile,
  FsLoc.RelFile.RelFile,
)

/**
 * Type representing any file location.
 */
export type File = typeof File.Type

/**
 * Check if a value is a file location.
 */
export const is = S.is(File)
