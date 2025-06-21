/**
 * Core number module barrel exports.
 */

// Re-export all branded types and their operations
// Only use wildcard exports for modules that don't have conflicting names
// or for the primary modules that should "win" in case of conflicts

// Export main functions from all modules
export {
  from as degrees,
  fromRadians,
  is as isDegrees,
  normalize as normalizeDegrees,
  toRadians,
  tryFrom as tryDegrees,
} from './degrees/$$.ts'
export { from as even, is as isEven, next as nextEven, prev as prevEven, tryFrom as tryEven } from './even/$$.ts'
export { from as finite, is as isFinite, tryFrom as tryFinite } from './finite/$$.ts'
export { from as float, is as isFloat, toFloat, tryFrom as tryFloat } from './float/$$.ts'
export {
  clamp,
  clampOn,
  clampWith,
  from as ranged,
  is as inRange,
  isOn as inRangeOn,
  isWith as inRangeWith,
  tryFrom as tryRanged,
} from './in-range/$$.ts'
export { from as int, is as isInt, parse as parseAsInt, round as roundToInt, tryFrom as tryInt } from './int/$$.ts'
export {
  from as natural,
  is as isNatural,
  next as nextNatural,
  parseAsNatural,
  prev as prevNatural,
  tryFrom as tryNatural,
} from './natural/$$.ts'
export { from as negative, is as isNegative, negate, tryFrom as tryNegative } from './negative/$$.ts'
export { from as nonNegative, is as isNonNegative, tryFrom as tryNonNegative } from './non-negative/$$.ts'
export { from as nonPositive, is as isNonPositive, tryFrom as tryNonPositive } from './non-positive/$$.ts'
export {
  from as nonZero,
  is as isNonZero,
  safeDiv,
  safeDivide,
  safeDivOn,
  safeDivWith,
  tryFrom as tryNonZero,
} from './non-zero/$$.ts'
export { from as odd, is as isOdd, next as nextOdd, prev as prevOdd, tryFrom as tryOdd } from './odd/$$.ts'
export {
  clamp as clampToPercentage,
  from as percentage,
  fromPercent,
  is as isPercentage,
  toPercent,
  tryFrom as tryPercentage,
} from './percentage/$$.ts'
export { from as positive, is as isPositive, tryFrom as tryPositive } from './positive/$$.ts'
export {
  from as radians,
  fromDegrees,
  is as isRadians,
  normalize as normalizeRadians,
  toDegrees,
  tryFrom as tryRadians,
} from './radians/$$.ts'
export { from as safeInt, is as isSafeInt, MAX_SAFE_INT, MIN_SAFE_INT, tryFrom as trySafeInt } from './safe-int/$$.ts'
export {
  from as whole,
  is as isWhole,
  next as nextWhole,
  parseAsWhole,
  prev as prevWhole,
  tryFrom as tryWhole,
} from './whole/$$.ts'
export { from as zero, is as isZero, tryFrom as tryZero, ZERO } from './zero/$$.ts'

// Re-export types
export type { Degrees } from './degrees/degrees.ts'
export type { Even } from './even/even.ts'
export type { Finite } from './finite/finite.ts'
export type { Float } from './float/float.ts'
export type { InRange } from './in-range/in-range.ts'
export type { Int } from './int/int.ts'
export type { Natural } from './natural/natural.ts'
export type { Negative } from './negative/negative.ts'
export type { NonNegative } from './non-negative/non-negative.ts'
export type { NonPositive } from './non-positive/non-positive.ts'
export type { NonZero } from './non-zero/non-zero.ts'
export type { Odd } from './odd/odd.ts'
export type { Percentage } from './percentage/percentage.ts'
export type { Positive } from './positive/positive.ts'
export type { Radians } from './radians/radians.ts'
export type { SafeInt } from './safe-int/safe-int.ts'
export type { Whole } from './whole/whole.ts'
export type { Zero } from './zero/zero.ts'

// Re-export core operations and math
export * from './math.ts'
export * from './operations.ts'
