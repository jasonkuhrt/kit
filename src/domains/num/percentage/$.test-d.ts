/**
 * Type-level tests for the Percentage module
 */

import { Ts } from '#ts'
import type { InRange } from '../in-range/$$.js'
import type { Percentage } from './$$.js'
import {
  clamp as clampToPercentage,
  from as percentage,
  fromPercent,
  is as isPercentage,
  toPercent,
  tryFrom as tryPercentage,
} from './$$.js'

// === Type Narrowing with Predicates ===

Ts.test('Type narrowing works correctly with isPercentage predicate', () => {
  const value: unknown = 0.5

  // Predicate narrows to Percentage type
  if (isPercentage(value)) {
    Ts.assert<Percentage>()(value)
    // Percentage is also InRange<0, 1>
    Ts.assert<InRange<0, 1>>()(value)
  }

  // Runtime check confirms the relationship
  const _narrowed = (v: unknown): void => {
    if (isPercentage(v)) {
      // v is both Percentage and InRange<0, 1>
      const _p: Percentage = v
      const _r: InRange<0, 1> = v
    }
  }
})

// === Constructor Functions ===

Ts.test('Constructor functions produce correctly branded types', () => {
  // Basic percentage constructor
  const pct1 = percentage(0.5)
  Ts.assert<Percentage>()(pct1)

  // Edge cases
  const pct2 = percentage(0)
  Ts.assert<Percentage>()(pct2)

  const pct3 = percentage(1)
  Ts.assert<Percentage>()(pct3)

  // Try constructor
  const try1 = tryPercentage(0.75)
  Ts.assert<Percentage | null>()(try1)

  // Type narrowing with try constructor
  if (try1 !== null) {
    Ts.assert<Percentage>()(try1)
  }

  // From percent conversion
  const pct4 = fromPercent(50) // 50% -> 0.5
  Ts.assert<Percentage>()(pct4)
})

// === Type Relationships ===

Ts.test('Percentage has correct relationship with InRange<0, 1>', () => {
  const pct: Percentage = percentage(0.5)

  // Percentage can be assigned to InRange<0, 1>
  const range: InRange<0, 1> = pct
  Ts.assert<InRange<0, 1>>()(range)

  // But InRange<0, 1> cannot be directly assigned to Percentage
  const _rangeValue = {} as InRange<0, 1>
  // @ts-expect-error - InRange<0, 1> is not assignable to Percentage
  const _bad: Percentage = _rangeValue
})

// === Conversion Operations ===

Ts.test('Conversion operations have correct types', () => {
  const pct: Percentage = percentage(0.75)

  // toPercent returns plain number
  const percent = toPercent(pct)
  Ts.assert<number>()(percent)

  // fromPercent returns Percentage
  const fromPct = fromPercent(75)
  Ts.assert<Percentage>()(fromPct)

  // clampToPercentage always returns Percentage
  const clamped1 = clampToPercentage(1.5)
  Ts.assert<Percentage>()(clamped1)

  const clamped2 = clampToPercentage(-0.5)
  Ts.assert<Percentage>()(clamped2)
})

// === Type-Level Only Tests ===

// Test that Percentage extends both number and InRange<0, 1>
type _PercentageRelationships = Ts.Cases<
  // Percentage extends number
  Ts.Assert<number, Percentage>,
  // Percentage extends InRange<0, 1>
  Ts.Assert<InRange<0, 1>, Percentage>,
  // Percentage is more specific than InRange<0, 1>
  Ts.AssertExtendsTyped<Percentage, InRange<0, 1>>,
  // InRange<0, 1> does not extend Percentage (Percentage has additional brand)
  Ts.AssertNotExtends<InRange<0, 1>, Percentage>,
  // Percentage does not extend other ranges
  Ts.AssertNotExtends<Percentage, InRange<0, 100>>,
  Ts.AssertNotExtends<Percentage, InRange<-1, 1>>
>

// Test constructor return types
type _ConstructorReturnTypes = Ts.Cases<
  Ts.AssertExact<ReturnType<typeof percentage>, Percentage>,
  Ts.AssertExact<ReturnType<typeof tryPercentage>, Percentage | null>,
  Ts.AssertExact<ReturnType<typeof fromPercent>, Percentage>,
  Ts.AssertExact<ReturnType<typeof clampToPercentage>, Percentage>
>

// Test conversion function types
type _ConversionTypes = Ts.Cases<
  // toPercent accepts Percentage and returns number
  Ts.AssertExact<Parameters<typeof toPercent>[0], Percentage>,
  Ts.AssertExact<ReturnType<typeof toPercent>, number>,
  // fromPercent accepts number and returns Percentage
  Ts.AssertExact<Parameters<typeof fromPercent>[0], number>,
  Ts.AssertExact<ReturnType<typeof fromPercent>, Percentage>
>

// Demonstrate the dual nature of Percentage
Ts.test('Percentage has dual brand nature', () => {
  const pct: Percentage = percentage(0.5)

  // Can use as InRange<0, 1>
  const _asRange: InRange<0, 1> = pct

  // Can use as number
  const _asNumber: number = pct

  // But cannot go backwards without constructor
  const _range: InRange<0, 1> = {} as InRange<0, 1>
  // @ts-expect-error - InRange<0, 1> lacks Percentage brand
  const _badPct: Percentage = _range
})

// Test that Percentage is a nominal type
Ts.test('Percentage is nominal (brand-based), not structural', () => {
  // Even though 0.5 is in range 0-1, it's not a Percentage without the brand
  // @ts-expect-error - Cannot assign raw number to Percentage
  const _bad1: Percentage = 0.5

  // Even InRange<0, 1> is not directly assignable
  const _inRange: InRange<0, 1> = {} as InRange<0, 1>
  // @ts-expect-error - Cannot assign InRange<0, 1> to Percentage
  const _bad2: Percentage = _inRange
})
