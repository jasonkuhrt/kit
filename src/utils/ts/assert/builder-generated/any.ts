import type { Inhabitance } from '#ts/ts'
import { builder } from '../builder-singleton.js'

/**
 * Unary relator - asserts type is `any`.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.any<any>
 * Assert.any(value as any)
 *
 * // ✗ Fail
 * type _ = Assert.any<string>
 * Assert.any(value as string)
 * ```
 */
type any_<$Actual> = Inhabitance.GetCase<$Actual> extends 'any' ? never : { ERROR: 'Type is not any'; actual: $Actual }
const any_ = builder.any

export { any_ as any }
