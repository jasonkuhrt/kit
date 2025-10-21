import type { Inhabitance } from '#ts/ts'
import { builder } from '../builder-singleton.js'

/**
 * Unary relator - asserts type is `unknown`.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.unknown<unknown>
 * Assert.unknown(value as unknown)
 *
 * // ✗ Fail
 * type _ = Assert.unknown<string>
 * Assert.unknown(value as string)
 * ```
 */
type unknown_<$Actual> = Inhabitance.GetCase<$Actual> extends 'unknown' ? never
  : { ERROR: 'Type is not unknown'; actual: $Actual }
const unknown_ = builder.unknown

export { unknown_ as unknown }
