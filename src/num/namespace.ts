/**
 * Num namespace with both runtime exports and types.
 */

// Import all runtime exports
import * as NumExports from './$$.ts'

// Import namespace modules
export { Degrees } from './degrees/$.ts'
export { Finite } from './finite/$.ts'
export { Float } from './float/$.ts'
export { InRange } from './in-range/$.ts'
export { Natural } from './natural/$.ts'
export { Negative } from './negative/$.ts'
export { NonNegative } from './non-negative/$.ts'
export { NonPositive } from './non-positive/$.ts'
export { Odd } from './odd/$.ts'
export { Percentage } from './percentage/$.ts'
export { Radians } from './radians/$.ts'
export { SafeInt } from './safe-int/$.ts'
export { Whole } from './whole/$.ts'
export { Zero } from './zero/$.ts'

// Import all types
import type { Degrees as DegreesType } from './degrees/degrees.ts'
import type { Even as EvenType } from './even/even.ts'
import type { Finite as FiniteType } from './finite/finite.ts'
import type { Float as FloatType } from './float/float.ts'
import type { InRange as InRangeType } from './in-range/in-range.ts'
import type { Int as IntType } from './int/int.ts'
import type { Natural as NaturalType } from './natural/natural.ts'
import type { Negative as NegativeType } from './negative/negative.ts'
import type { NonNegative as NonNegativeType } from './non-negative/non-negative.ts'
import type { NonPositive as NonPositiveType } from './non-positive/non-positive.ts'
import type { NonZero as NonZeroType } from './non-zero/non-zero.ts'
import type { Odd as OddType } from './odd/odd.ts'
import type { Percentage as PercentageType } from './percentage/percentage.ts'
import type { Positive as PositiveType } from './positive/positive.ts'
import type { Radians as RadiansType } from './radians/radians.ts'
import type { SafeInt as SafeIntType } from './safe-int/safe-int.ts'
import type { Whole as WholeType } from './whole/whole.ts'
import type { Zero as ZeroType } from './zero/zero.ts'

// Re-export all runtime values from NumExports
export * from './$$.ts'

// Re-export types
export type Degrees = DegreesType
export type Even = EvenType
export type Finite = FiniteType
export type Float = FloatType
export type InRange<Min extends number = number, Max extends number = number> = InRangeType<Min, Max>
export type Int = IntType
export type Natural = NaturalType
export type Negative = NegativeType
export type NonNegative = NonNegativeType
export type NonPositive = NonPositiveType
export type NonZero = NonZeroType
export type Odd = OddType
export type Percentage = PercentageType
export type Positive = PositiveType
export type Radians = RadiansType
export type SafeInt = SafeIntType
export type Whole = WholeType
export type Zero = ZeroType
