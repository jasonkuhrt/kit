import { test } from 'vitest'

/**
 * Type-level tests for the Percentage module
 */

import { Type as A } from '#assert/assert'
import { Ts } from '#ts'
import type { InRange } from '../in-range/__.js'
import type { Percentage } from './__.js'
import {
  clamp as clampToPercentage,
  from as percentage,
  fromPercent,
  is as isPercentage,
  toPercent,
  tryFrom as tryPercentage,
} from './__.js'

// === Type Narrowing with Predicates ===

test('Type narrowing works correctly with isPercentage predicate', () => {
  const value: unknown = 0.5

  // Predicate narrows to Percentage type
  if (isPercentage(value)) {
    A.sub.ofAs<Percentage>().on(value)
    // Percentage is also InRange<0, 1>
    A.sub.ofAs<InRange<0, 1>>().on(value)
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
  A.exact.ofAs<Percentage>().on(pct1)

  // Edge cases
  const pct2 = percentage(0)
  A.exact.ofAs<Percentage>().on(pct2)

  const pct3 = percentage(1)
  A.exact.ofAs<Percentage>().on(pct3)

  // Try constructor
  const try1 = tryPercentage(0.75)
  A.exact.ofAs<Percentage | null>().on(try1)

  // Type narrowing with try constructor
  if (try1 !== null) {
    A.exact.ofAs<Percentage>().on(try1)
  }

  // From percent conversion
  const pct4 = fromPercent(50) // 50% -> 0.5
  A.exact.ofAs<Percentage>().on(pct4)
})

// === Type Relationships ===

test('Percentage has correct relationship with InRange<0, 1>', () => {
  const pct: Percentage = percentage(0.5)

  // Percentage can be assigned to InRange<0, 1>
  const range: InRange<0, 1> = pct
  A.sub.ofAs<InRange<0, 1>>().on(range)

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
  A.exact.ofAs<number>().on(percent)

  // fromPercent returns Percentage
  const fromPct = fromPercent(75)
  A.exact.ofAs<Percentage>().on(fromPct)

  // clampToPercentage always returns Percentage
  const clamped1 = clampToPercentage(1.5)
  A.exact.ofAs<Percentage>().on(clamped1)

  const clamped2 = clampToPercentage(-0.5)
  A.exact.ofAs<Percentage>().on(clamped2)
})

// === Type-Level Only Tests ===

// Test that Percentage extends both number and InRange<0, 1>
type _PercentageRelationships = A.Cases<
  // Percentage extends number
  A.sub.of<number, Percentage>,
  // Percentage extends InRange<0, 1>
  A.sub.of<InRange<0, 1>, Percentage>,
  // InRange<0, 1> does not extend Percentage (Percentage has additional brand)
  A.not.sub<Percentage, InRange<0, 1>>,
  // Percentage does not extend other ranges
  A.not.sub<Percentage, InRange<0, 100>>,
  A.not.sub<Percentage, InRange<-1, 1>>
>

// Test constructor return types
type _ConstructorReturnTypes = A.Cases<
  A.exact.of<ReturnType<typeof percentage>, Percentage>,
  A.exact.of<ReturnType<typeof tryPercentage>, Percentage | null>,
  A.exact.of<ReturnType<typeof fromPercent>, Percentage>,
  A.exact.of<ReturnType<typeof clampToPercentage>, Percentage>
>

// Test conversion function types
type _ConversionTypes = A.Cases<
  // toPercent accepts Percentage and returns number
  A.exact.of<Parameters<typeof toPercent>[0], Percentage>,
  A.exact.of<ReturnType<typeof toPercent>, number>,
  // fromPercent accepts number and returns Percentage
  A.exact.of<Parameters<typeof fromPercent>[0], number>,
  A.exact.of<ReturnType<typeof fromPercent>, Percentage>
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
