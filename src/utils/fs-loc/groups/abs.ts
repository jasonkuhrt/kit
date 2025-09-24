import { Schema as S } from 'effect'
import type { ParseOptions } from 'effect/SchemaAST'
import { AbsDir } from '../members/abs-dir.js'
import { AbsFile } from '../members/abs-file.js'

/**
 * Union of all absolute location types.
 */
export const Abs = S.Union(
  AbsFile,
  AbsDir,
)

/**
 * Type representing any absolute location.
 */
export type Abs = typeof Abs.Type

/**
 * Check if a value is an absolute location.
 */
export const is = S.is(Abs)

/**
 * Assert that a value is an absolute location.
 * @throws {ParseError} if the value is not an absolute location
 */
export const assert: (input: unknown, options?: ParseOptions) => asserts input is Abs = S.asserts(Abs)
