import { Schema as S } from 'effect'
import type { ParseOptions } from 'effect/SchemaAST'
import { RelDir } from '../members/rel-dir.js'
import { RelFile } from '../members/rel-file.js'

/**
 * Union of all relative location types.
 */
export const Rel = S.Union(
  RelFile,
  RelDir,
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
