import type { Inhabitance } from '#ts/ts'
import { builder } from '../../builder-singleton.js'

/**
 * Unary relator (negated) - asserts type is NOT `any`.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.not.any<string>
 * Assert.not.any(value as string)
 *
 * // ✗ Fail
 * type _ = Assert.not.any<any>
 * Assert.not.any(value as any)
 * ```
 */
type any_<$Actual> = Inhabitance.GetCase<$Actual> extends 'any'
  ? { ERROR: 'Type is any, but expected not any'; actual: $Actual }
  : never
const any_ = builder.not.any

export { any_ as any }
