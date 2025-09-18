/**
 * Flattening data types allows us to have e.g. `Num.Even` be a type and namespace.
 *
 * IMPORTANT: TypeScript limitation with namespace and type exports
 *
 * We cannot use the pattern:
 *   export type { Foo } from './foo/$$.js'
 *   export * from './foo/$.js'
 *
 * This breaks TypeScript's ability to recognize the namespace exports.
 *
 * Instead, we must use:
 *   import type { Foo as Foo_ } from './foo/$$.js'
 *   export { Foo } from './foo/$.js'
 *   export type Foo = Foo_
 *
 * This pattern:
 * 1. Imports the type with an alias to avoid conflicts
 * 2. Explicitly exports the namespace value
 * 3. Creates a type alias (not a re-export) which TypeScript allows
 *
 * This enables `Num.Foo` to work as both a type and a namespace.
 */

import type { Degrees as Degrees_ } from './degrees/$$.js'
export { Degrees } from './degrees/$.js'
export type Degrees = Degrees_
import type { Even as Even_ } from './even/$$.js'
export { Even } from './even/$.js'
export type Even = Even_
import type { Finite as Finite_ } from './finite/$$.js'
export { Finite } from './finite/$.js'
export type Finite = Finite_
import type { Float as Float_ } from './float/$$.js'
export { Float } from './float/$.js'
export type Float = Float_
import type { InRange as InRange_ } from './in-range/$$.js'
export { InRange } from './in-range/$.js'
export type InRange<Min extends number = number, Max extends number = number> = InRange_<Min, Max>
import type { Int as Int_ } from './int/$$.js'
export { Int } from './int/$.js'
export type Int = Int_
import type { Natural as Natural_ } from './natural/$$.js'
export { Natural } from './natural/$.js'
export type Natural = Natural_
import type { Negative as Negative_ } from './negative/$$.js'
export { Negative } from './negative/$.js'
export type Negative = Negative_
import type { NonNegative as NonNegative_ } from './non-negative/$$.js'
export { NonNegative } from './non-negative/$.js'
export type NonNegative = NonNegative_
import type { NonPositive as NonPositive_ } from './non-positive/$$.js'
export { NonPositive } from './non-positive/$.js'
export type NonPositive = NonPositive_
import type { NonZero as NonZero_ } from './non-zero/$$.js'
export { NonZero } from './non-zero/$.js'
export type NonZero = NonZero_
import type { Odd as Odd_ } from './odd/$$.js'
export { Odd } from './odd/$.js'
export type Odd = Odd_
import type { Percentage as Percentage_ } from './percentage/$$.js'
export { Percentage } from './percentage/$.js'
export type Percentage = Percentage_
import type { Positive as Positive_ } from './positive/$$.js'
export { Positive } from './positive/$.js'
export type Positive = Positive_
import type { Radians as Radians_ } from './radians/$$.js'
export { Radians } from './radians/$.js'
export type Radians = Radians_
import type { SafeInt as SafeInt_ } from './safe-int/$$.js'
export { SafeInt } from './safe-int/$.js'
export type SafeInt = SafeInt_
import type { Whole as Whole_ } from './whole/$$.js'
export { Whole } from './whole/$.js'
export type Whole = Whole_
import type { Zero as Zero_ } from './zero/$$.js'
export { Zero } from './zero/$.js'
export type Zero = Zero_
import type { Prime as Prime_ } from './prime/$$.js'
export { Prime } from './prime/$.js'
export type Prime = Prime_
import type { Ratio as Ratio_ } from './ratio/$$.js'
export { Ratio } from './ratio/$.js'
export type Ratio = Ratio_
import type { Frac as Frac_ } from './frac/$$.js'
export { Frac } from './frac/$.js'
export type Frac = Frac_
import type { Complex as Complex_ } from './complex/$$.js'
export { Complex } from './complex/$.js'
export type Complex = Complex_
import type { BigInteger as BigInteger_ } from './big-integer/$$.js'
export { BigInteger as BigInt } from './big-integer/$.js'
export type BigInt = BigInteger_

export * from './math.js'
export * from './operations.js'
export * from './range.js'
export { Arb } from './traits/arb.js'
export { Eq } from './traits/eq.js'
export { Type } from './traits/type.js'
