/**
 * Flattening data types allows us to have e.g. `Num.Even` be a type and namespace.
 *
 * IMPORTANT: TypeScript limitation with namespace and type exports
 *
 * We cannot use the pattern:
 *   export type { Foo } from './foo/$$.ts'
 *   export * from './foo/$.ts'
 *
 * This breaks TypeScript's ability to recognize the namespace exports.
 *
 * Instead, we must use:
 *   import type { Foo as Foo_ } from './foo/$$.ts'
 *   export { Foo } from './foo/$.ts'
 *   export type Foo = Foo_
 *
 * This pattern:
 * 1. Imports the type with an alias to avoid conflicts
 * 2. Explicitly exports the namespace value
 * 3. Creates a type alias (not a re-export) which TypeScript allows
 *
 * This enables `Num.Foo` to work as both a type and a namespace.
 */

import type { Degrees as Degrees_ } from './degrees/$$.ts'
export { Degrees } from './degrees/$.ts'
export type Degrees = Degrees_
import type { Even as Even_ } from './even/$$.ts'
export { Even } from './even/$.ts'
export type Even = Even_
import type { Finite as Finite_ } from './finite/$$.ts'
export { Finite } from './finite/$.ts'
export type Finite = Finite_
import type { Float as Float_ } from './float/$$.ts'
export { Float } from './float/$.ts'
export type Float = Float_
import type { InRange as InRange_ } from './in-range/$$.ts'
export { InRange } from './in-range/$.ts'
export type InRange<Min extends number = number, Max extends number = number> = InRange_<Min, Max>
import type { Int as Int_ } from './int/$$.ts'
export { Int } from './int/$.ts'
export type Int = Int_
import type { Natural as Natural_ } from './natural/$$.ts'
export { Natural } from './natural/$.ts'
export type Natural = Natural_
import type { Negative as Negative_ } from './negative/$$.ts'
export { Negative } from './negative/$.ts'
export type Negative = Negative_
import type { NonNegative as NonNegative_ } from './non-negative/$$.ts'
export { NonNegative } from './non-negative/$.ts'
export type NonNegative = NonNegative_
import type { NonPositive as NonPositive_ } from './non-positive/$$.ts'
export { NonPositive } from './non-positive/$.ts'
export type NonPositive = NonPositive_
import type { NonZero as NonZero_ } from './non-zero/$$.ts'
export { NonZero } from './non-zero/$.ts'
export type NonZero = NonZero_
import type { Odd as Odd_ } from './odd/$$.ts'
export { Odd } from './odd/$.ts'
export type Odd = Odd_
import type { Percentage as Percentage_ } from './percentage/$$.ts'
export { Percentage } from './percentage/$.ts'
export type Percentage = Percentage_
import type { Positive as Positive_ } from './positive/$$.ts'
export { Positive } from './positive/$.ts'
export type Positive = Positive_
import type { Radians as Radians_ } from './radians/$$.ts'
export { Radians } from './radians/$.ts'
export type Radians = Radians_
import type { SafeInt as SafeInt_ } from './safe-int/$$.ts'
export { SafeInt } from './safe-int/$.ts'
export type SafeInt = SafeInt_
import type { Whole as Whole_ } from './whole/$$.ts'
export { Whole } from './whole/$.ts'
export type Whole = Whole_
import type { Zero as Zero_ } from './zero/$$.ts'
export { Zero } from './zero/$.ts'
export type Zero = Zero_

export * from './math.ts'
export * from './operations.ts'
export * from './range.ts'
