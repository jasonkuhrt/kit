import { test } from 'vitest'

/**
 * Type-level tests for the Percentage module
 */

import { Ts } from '#ts'
import { Assert } from '#ts/ts'
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

test('Type narrowing works correctly with isPercentage predicate', () => {
  const value: unknown = 0.5

  // Predicate narrows to Percentage type
  if (isPercentage(value)) {
    Assert.sub.of.as<Percentage>()(value)
    // Percentage is also InRange<0, 1>
    Assert.sub.of.as<InRange<0, 1>>()(value)
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

test('Constructor functions produce correctly branded types', () => {
  // Basic percentage constructor
  const pct1 = percentage(0.5)
  Assert.exact.of.as<Percentage>()(pct1)

  // Edge cases
  const pct2 = percentage(0)
  Assert.exact.of.as<Percentage>()(pct2)

  const pct3 = percentage(1)
  Assert.exact.of.as<Percentage>()(pct3)

  // Try constructor
  const try1 = tryPercentage(0.75)
  Assert.exact.of.as<Percentage | null>()(try1)

  // Type narrowing with try constructor
  if (try1 !== null) {
    Assert.exact.of.as<Percentage>()(try1)
  }

  // From percent conversion
  const pct4 = fromPercent(50) // 50% -> 0.5
  Assert.exact.of.as<Percentage>()(pct4)
})

// === Type Relationships ===

test('Percentage has correct relationship with InRange<0, 1>', () => {
  const pct: Percentage = percentage(0.5)

  // Percentage can be assigned to InRange<0, 1>
  const range: InRange<0, 1> = pct
  Assert.sub.of.as<InRange<0, 1>>()(range)

  // But InRange<0, 1> cannot be directly assigned to Percentage
  const _rangeValue = {} as InRange<0, 1>
  // @ts-expect-error - InRange<0, 1> is not assignable to Percentage
  const _bad: Percentage = _rangeValue
})

// === Conversion Operations ===

test('Conversion operations have correct types', () => {
  const pct: Percentage = percentage(0.75)

  // toPercent returns plain number
  const percent = toPercent(pct)
  Assert.exact.of.as<number>()(percent)

  // fromPercent returns Percentage
  const fromPct = fromPercent(75)
  Assert.exact.of.as<Percentage>()(fromPct)

  // clampToPercentage always returns Percentage
  const clamped1 = clampToPercentage(1.5)
  Assert.exact.of.as<Percentage>()(clamped1)

  const clamped2 = clampToPercentage(-0.5)
  Assert.exact.of.as<Percentage>()(clamped2)
})

// === Type-Level Only Tests ===

// Test that Percentage extends both number and InRange<0, 1>
type _PercentageRelationships = Ts.Assert.Cases<
  // Percentage extends number
  Assert.sub.of<number, Percentage>,
  // Percentage extends InRange<0, 1>
  Assert.sub.of<InRange<0, 1>, Percentage>,
  // InRange<0, 1> does not extend Percentage (Percentage has additional brand)
  Ts.Assert.not.sub<Percentage, InRange<0, 1>>,
  // Percentage does not extend other ranges
  Ts.Assert.not.sub<Percentage, InRange<0, 100>>,
  Ts.Assert.not.sub<Percentage, InRange<-1, 1>>
>

// Test constructor return types
type _ConstructorReturnTypes = Ts.Assert.Cases<
  Assert.exact.of<ReturnType<typeof percentage>, Percentage>,
  Assert.exact.of<ReturnType<typeof tryPercentage>, Percentage | null>,
  Assert.exact.of<ReturnType<typeof fromPercent>, Percentage>,
  Assert.exact.of<ReturnType<typeof clampToPercentage>, Percentage>
>

// Test conversion function types
type _ConversionTypes = Ts.Assert.Cases<
  // toPercent accepts Percentage and returns number
  Assert.exact.of<Parameters<typeof toPercent>[0], Percentage>,
  Assert.exact.of<ReturnType<typeof toPercent>, number>,
  // fromPercent accepts number and returns Percentage
  Assert.exact.of<Parameters<typeof fromPercent>[0], number>,
  Assert.exact.of<ReturnType<typeof fromPercent>, Percentage>
>

// Demonstrate the dual nature of Percentage
test('Percentage has dual brand nature', () => {
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
test('Percentage is nominal (brand-based), not structural', () => {
  // Even though 0.5 is in range 0-1, it's not a Percentage without the brand
  // @ts-expect-error - Cannot assign raw number to Percentage
  const _bad1: Percentage = 0.5

  // Even InRange<0, 1> is not directly assignable
  const _inRange: InRange<0, 1> = {} as InRange<0, 1>
  // @ts-expect-error - Cannot assign InRange<0, 1> to Percentage
  const _bad2: Percentage = _inRange
})
