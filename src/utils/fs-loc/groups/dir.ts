import { Schema as S } from 'effect'
import type { ParseOptions } from 'effect/SchemaAST'
import { AbsDir } from '../members/abs-dir.js'
import { RelDir } from '../members/rel-dir.js'

/**
 * Union of all directory location types.
 */
export const Dir = S.Union(
  AbsDir,
  RelDir,
)

/**
 * Type representing any directory location.
 */
export type Dir = typeof Dir.Type

/**
 * Check if a value is a directory location.
 */
export const is = S.is(Dir)

/**
 * Assert that a value is a directory location.
 * @throws {ParseError} if the value is not a directory location
 */
export const assert: (input: unknown, options?: ParseOptions) => asserts input is Dir = S.asserts(Dir)
