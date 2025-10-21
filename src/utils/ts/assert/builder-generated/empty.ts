import type { Inhabitance } from '#ts/ts'
import { builder } from '../builder-singleton.js'

/**
 * Unary relator - asserts type is empty.
 *
 * Empty types:
 * - Empty array: `[]` or `readonly []`
 * - Empty object: `keyof T extends never` (no properties)
 * - Empty string: `''`
 *
 * **Important:** `{}` means "non-nullish", not empty!
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.empty<[]>
 * type _ = Assert.empty<''>
 * type _ = Assert.empty<Record<string, never>>
 * Assert.empty([])
 * Assert.empty('')
 *
 * // ✗ Fail
 * type _ = Assert.empty<[1]>
 * type _ = Assert.empty<{}>  // {} = non-nullish!
 * Assert.empty([1])
 * Assert.empty({})
 * ```
 */
type empty_<$Actual> = Inhabitance.IsEmpty<$Actual> extends true ? never
  : {
    ERROR: 'Type is not empty'
    actual: $Actual
    tip_array: 'Empty array: [] or readonly []'
    tip_object: 'Empty object: keyof T extends never (not {}!)'
    tip_string: "Empty string: ''"
  }
const empty_ = builder.empty

export { empty_ as empty }
