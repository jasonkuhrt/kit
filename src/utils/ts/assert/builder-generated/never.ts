import type { Inhabitance } from '#ts/ts'
import { builder } from '../builder-singleton.js'

/**
 * Unary relator - asserts type is `never`.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.never<never>
 * Assert.never(value as never)
 *
 * // ✗ Fail
 * type _ = Assert.never<string>
 * Assert.never(value as string)
 * ```
 */
type never_<$Actual> = Inhabitance.GetCase<$Actual> extends 'never' ? never
  : { ERROR: 'Type is not never'; actual: $Actual }
const never_ = builder.never

export { never_ as never }
