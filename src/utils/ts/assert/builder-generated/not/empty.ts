import type { Inhabitance } from '#ts/ts'
import { builder } from '../../builder-singleton.js'

/**
 * Unary relator (negated) - asserts type is NOT empty.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.not.empty<[1]>
 * type _ = Assert.not.empty<{ a: 1 }>
 * Assert.not.empty([1])
 * Assert.not.empty({ a: 1 })
 *
 * // ✗ Fail
 * type _ = Assert.not.empty<[]>
 * type _ = Assert.not.empty<''>
 * Assert.not.empty([])
 * Assert.not.empty('')
 * ```
 */
type empty_<$Actual> = Inhabitance.IsEmpty<$Actual> extends true
  ? { ERROR: 'Expected type to not be empty, but was'; actual: $Actual }
  : never
const empty_ = builder.not.empty

export { empty_ as empty }
