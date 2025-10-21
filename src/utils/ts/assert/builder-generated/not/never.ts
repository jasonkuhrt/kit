import type { Inhabitance } from '#ts/ts'
import { builder } from '../../builder-singleton.js'

/**
 * Unary relator (negated) - asserts type is NOT `never`.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.not.never<string>
 * Assert.not.never(value as string)
 *
 * // ✗ Fail
 * type _ = Assert.not.never<never>
 * Assert.not.never(value as never)
 * ```
 */
type never_<$Actual> = Inhabitance.GetCase<$Actual> extends 'never'
  ? { ERROR: 'Type is never, but expected not never'; actual: $Actual }
  : never
const never_ = builder.not.never

export { never_ as never }
