import { Schema as S } from 'effect'
import type { Path } from '../_.js'
import type { normalize } from '../inputs.js'
import { Schema } from '../Schema.js'

/**
 * Decode a string literal to the appropriate Path type.
 * Type is inferred at compile time when using string literals.
 *
 * This provides compile-time type inference magic based on the string literal shape.
 *
 * @example
 * ```ts
 * const path1 = fromLiteral('/home/user/file.txt')  // AbsFile
 * const path2 = fromLiteral('./src/')               // RelDir
 * ```
 */
export const fromLiteral = <const $input extends string>(
  $input: $input,
): normalize<$input> => S.decodeSync(Schema)($input) as any

/**
 * Decode a runtime string to a Path instance.
 * Use this for dynamic/runtime string values.
 *
 * @example
 * ```ts
 * const path = fromString(someRuntimeVariable)  // Path
 * ```
 */
export const fromString = (input: string): Path => S.decodeSync(Schema)(input)
