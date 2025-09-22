import { Schema as S } from 'effect'
import type { ParseOptions } from 'effect/SchemaAST'
import * as FsLoc from '../fs-loc.js'

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

/**
 * Assert that a value is a relative location.
 * @throws {ParseError} if the value is not a relative location
 */
export const assert: (input: unknown, options?: ParseOptions) => asserts input is Rel = S.asserts(Rel)
