import type { Inhabitance } from '#ts/ts'
import { builder } from '../../builder-singleton.js'

/**
 * Unary relator (negated) - asserts type is NOT `unknown`.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.not.unknown<string>
 * Assert.not.unknown(value as string)
 *
 * // ✗ Fail
 * type _ = Assert.not.unknown<unknown>
 * Assert.not.unknown(value as unknown)
 * ```
 */
type unknown_<$Actual> = Inhabitance.GetCase<$Actual> extends 'unknown'
  ? { ERROR: 'Type is unknown, but expected not unknown'; actual: $Actual }
  : never
const unknown_ = builder.not.unknown

export { unknown_ as unknown }
