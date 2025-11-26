/**
 * Flattening data types allows us to have e.g. `Num.Even` be a type and namespace.
 *
 * IMPORTANT: TypeScript limitation with namespace and type exports
 *
 * We cannot use the pattern:
 *   export type { Foo } from './foo/__.js'
 *   export * from './foo/_.js'
 *
 * This breaks TypeScript's ability to recognize the namespace exports.
 *
 * Instead, we must use:
 *   import type { Foo as Foo_ } from './foo/__.js'
 *   export { Foo } from './foo/_.js'
 *   export type Foo = Foo_
 *
 * This pattern:
 * 1. Imports the type with an alias to avoid conflicts
 * 2. Explicitly exports the namespace value
 * 3. Creates a type alias (not a re-export) which TypeScript allows
 *
 * This enables `Num.Foo` to work as both a type and a namespace.
 */

import type { Degrees as Degrees_ } from './degrees/__.js'
export { Degrees } from './degrees/_.js'
export type Degrees = Degrees_
import type { Even as Even_ } from './even/__.js'
export { Even } from './even/_.js'
export type Even = Even_
import type { Finite as Finite_ } from './finite/__.js'
export { Finite } from './finite/_.js'
export type Finite = Finite_
import type { Float as Float_ } from './float/__.js'
export { Float } from './float/_.js'
export type Float = Float_
import type { InRange as InRange_ } from './in-range/__.js'
export { InRange } from './in-range/_.js'
export type InRange<Min extends number = number, Max extends number = number> = InRange_<Min, Max>
import type { Int as Int_ } from './int/__.js'
export { Int } from './int/_.js'
export type Int = Int_
import type { Natural as Natural_ } from './natural/__.js'
export { Natural } from './natural/_.js'
export type Natural = Natural_
import type { Negative as Negative_ } from './negative/__.js'
export { Negative } from './negative/_.js'
export type Negative = Negative_
import type { NonNegative as NonNegative_ } from './non-negative/__.js'
export { NonNegative } from './non-negative/_.js'
export type NonNegative = NonNegative_
import type { NonPositive as NonPositive_ } from './non-positive/__.js'
export { NonPositive } from './non-positive/_.js'
export type NonPositive = NonPositive_
import type { NonZero as NonZero_ } from './non-zero/__.js'
export { NonZero } from './non-zero/_.js'
export type NonZero = NonZero_
import type { Odd as Odd_ } from './odd/__.js'
export { Odd } from './odd/_.js'
export type Odd = Odd_
import type { Percentage as Percentage_ } from './percentage/__.js'
export { Percentage } from './percentage/_.js'
export type Percentage = Percentage_
import type { Positive as Positive_ } from './positive/__.js'
export { Positive } from './positive/_.js'
export type Positive = Positive_
import type { Radians as Radians_ } from './radians/__.js'
export { Radians } from './radians/_.js'
export type Radians = Radians_
import type { SafeInt as SafeInt_ } from './safe-int/__.js'
export { SafeInt } from './safe-int/_.js'
export type SafeInt = SafeInt_
import type { Whole as Whole_ } from './whole/__.js'
export { Whole } from './whole/_.js'
export type Whole = Whole_
import type { Zero as Zero_ } from './zero/__.js'
export { Zero } from './zero/_.js'
export type Zero = Zero_
import type { Prime as Prime_ } from './prime/__.js'
export { Prime } from './prime/_.js'
export type Prime = Prime_
import type { Ratio as Ratio_ } from './ratio/__.js'
export { Ratio } from './ratio/_.js'
export type Ratio = Ratio_
import type { Frac as Frac_ } from './frac/__.js'
export { Frac } from './frac/_.js'
export type Frac = Frac_
import type { Complex as Complex_ } from './complex/__.js'
export { Complex } from './complex/_.js'
export type Complex = Complex_
import type { BigInteger as BigInteger_ } from './big-integer/__.js'
export { BigInteger as BigInt } from './big-integer/_.js'
export type BigInt = BigInteger_

export * from './math.js'
export * from './operations.js'
export * from './range.js'
