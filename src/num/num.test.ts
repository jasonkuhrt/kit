import { describe, expect, it } from 'vitest'
import * as Num from './$$.ts'

describe('num predicates with branded types', () => {
  describe('isFinite', () => {
    it('narrows to Finite type', () => {
      const value: unknown = 42
      if (Num.isFinite(value)) {
        // Type should be Num.Finite
        const finite: Num.Finite = value
        expect(finite).toBe(42)
      }
    })

    it('rejects non-finite values', () => {
      expect(Num.isFinite(Infinity)).toBe(false)
      expect(Num.isFinite(-Infinity)).toBe(false)
      expect(Num.isFinite(NaN)).toBe(false)
      expect(Num.isFinite('42')).toBe(false)
    })
  })

  describe('isInt', () => {
    it('narrows to Int type', () => {
      const value: unknown = 42
      if (Num.isInt(value)) {
        // Type should be Num.Int
        const int: Num.Int = value
        expect(int).toBe(42)
      }
    })

    it('rejects non-integers', () => {
      expect(Num.isInt(42.5)).toBe(false)
      expect(Num.isInt(NaN)).toBe(false)
      expect(Num.isInt(Infinity)).toBe(false)
    })
  })

  describe('isPositive', () => {
    it('narrows to Positive type', () => {
      const value: unknown = 5
      if (Num.isPositive(value)) {
        // Type should be Num.Positive
        const positive: Num.Positive = value
        expect(positive).toBe(5)
      }
    })

    it('rejects non-positive values', () => {
      expect(Num.isPositive(0)).toBe(false)
      expect(Num.isPositive(-5)).toBe(false)
    })
  })

  describe('clamp with branded types', () => {
    it('returns InRange type', () => {
      const value = 150
      const clamped = Num.clamp(value, 0, 100)
      // Type should be Num.InRange<0, 100>
      const inRange: Num.InRange<0, 100> = clamped
      expect(inRange).toBe(100)
    })

    it('throws if min > max', () => {
      expect(() => Num.clamp(5, 10, 0)).toThrow('Min (10) must be <= max (0)')
    })
  })

  describe('abs with type preservation', () => {
    it('returns Positive from Negative', () => {
      const neg = -5
      if (Num.isNegative(neg)) {
        const result = Num.abs(neg)
        // Type should be Num.Positive
        const positive: Num.Positive = result
        expect(positive).toBe(5)
      }
    })

    it('returns NonNegative for general numbers', () => {
      const result = Num.abs(-10)
      // Type should be Num.NonNegative
      const nonNeg: Num.NonNegative = result
      expect(nonNeg).toBe(10)
    })
  })

  describe('sign with precise return types', () => {
    it('returns 1 for positive', () => {
      const pos = 5
      if (Num.isPositive(pos)) {
        const result = Num.sign(pos)
        // Type should be literal 1
        const one: 1 = result
        expect(one).toBe(1)
      }
    })

    it('returns -1 for negative', () => {
      const neg = -5
      if (Num.isNegative(neg)) {
        const result = Num.sign(neg)
        // Type should be literal -1
        const negOne: -1 = result
        expect(negOne).toBe(-1)
      }
    })

    it('returns 0 for zero', () => {
      const zero = 0
      if (Num.isZero(zero)) {
        const result = Num.sign(zero)
        // Type should be literal 0
        const zeroLit: 0 = result
        expect(zeroLit).toBe(0)
      }
    })
  })

  describe('mod returns NonNegative', () => {
    it('always returns non-negative result', () => {
      const divisor = Num.nonZero(3)
      if (!divisor) throw new Error('Expected non-zero divisor')
      const result1 = Num.mod(7, divisor)
      const result2 = Num.mod(-7, divisor)

      // Both should be NonNegative
      const nonNeg1: Num.NonNegative = result1
      const nonNeg2: Num.NonNegative = result2

      expect(nonNeg1).toBe(1)
      expect(nonNeg2).toBe(2)
    })
  })

  describe('composing branded types', () => {
    it('can combine multiple constraints', () => {
      const value: unknown = 4

      // isEven returns Even & Int
      if (Num.isEven(value)) {
        const even: Num.Even = value
        const int: Num.Int = value
        expect(even).toBe(4)
        expect(int).toBe(4)
      }

      // Can stack with more predicates
      if (Num.isPositive(value) && Num.isEven(value)) {
        // value is now Positive & Even & Int
        const positive: Num.Positive = value
        const int: Num.Int = value
        const even: Num.Even = value

        expect(positive).toBe(4)
        expect(int).toBe(4)
        expect(even).toBe(4)

        // Can use in operations that benefit from all constraints
        const halfValue = value / 2 // We know this is a positive integer
        expect(halfValue).toBe(2)
      }
    })

    it('odd predicate also returns Odd & Int', () => {
      const value: unknown = 5
      if (Num.isOdd(value)) {
        const odd: Num.Odd = value
        const int: Num.Int = value
        expect(odd).toBe(5)
        expect(int).toBe(5)
      }
    })
  })

  describe('branded types work with regular number operations', () => {
    it('branded types can be used as regular numbers', () => {
      const value = 5
      if (Num.isPositive(value)) {
        // Can use in regular operations
        expect(value + 10).toBe(15)
        expect(value * 2).toBe(10)
        expect(Math.sqrt(value)).toBeCloseTo(2.236, 3)

        // Can pass to functions expecting number
        const double = (n: number) => n * 2
        expect(double(value)).toBe(10)

        // Can use in arrays
        const numbers: number[] = [1, 2, value, 4]
        expect(numbers).toEqual([1, 2, 5, 4])
      }
    })
  })
})
