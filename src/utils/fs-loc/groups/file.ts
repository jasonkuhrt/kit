import { Schema as S } from 'effect'
import type { ParseOptions } from 'effect/SchemaAST'
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

/**
 * Assert that a value is a file location.
 * @throws {ParseError} if the value is not a file location
 */
export const assert: (input: unknown, options?: ParseOptions) => asserts input is File = S.asserts(File)
