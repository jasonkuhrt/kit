import * as fc from 'fast-check'
import { describe, expect, test } from 'vitest'
import { Num } from './$.js'

describe('type predicates', () => {
  describe('is', () => {
    test('property: accepts all numbers except NaN', () => {
      fc.assert(
        fc.property(fc.double({ noNaN: true }), (n) => {
          expect(Num.is(n)).toBe(true)
        }),
      )
    })

    test('property: rejects NaN', () => {
      expect(Num.is(NaN)).toBe(false)
    })

    test('property: rejects non-numbers', () => {
      fc.assert(
        fc.property(
          fc.anything().filter(v => typeof v !== 'number'),
          (value) => {
            expect(Num.is(value)).toBe(false)
          },
        ),
      )
    })
  })

  describe('isFinite', () => {
    test('property: accepts finite numbers', () => {
      fc.assert(
        fc.property(fc.double({ noNaN: true, noDefaultInfinity: true }), (n) => {
          expect(Num.Finite.is(n)).toBe(true)
        }),
      )
    })

    test('property: rejects infinite and NaN', () => {
      expect(Num.Finite.is(Infinity)).toBe(false)
      expect(Num.Finite.is(-Infinity)).toBe(false)
      expect(Num.Finite.is(NaN)).toBe(false)
    })
  })

  describe('isInt', () => {
    test('property: accepts all integers', () => {
      fc.assert(
        fc.property(fc.integer(), (n) => {
          expect(Num.Int.is(n)).toBe(true)
        }),
      )
    })

    test('property: rejects non-integers', () => {
      fc.assert(
        fc.property(
          fc.double({ noNaN: true }).filter(n => !Number.isInteger(n)),
          (n) => {
            expect(Num.Int.is(n)).toBe(false)
          },
        ),
      )
    })
  })

  describe('isFloat', () => {
    test('property: accepts non-integer finite numbers', () => {
      fc.assert(
        fc.property(
          fc.double({ noNaN: true, noDefaultInfinity: true }).filter(n => !Number.isInteger(n)),
          (n) => {
            expect(Num.Float.is(n)).toBe(true)
          },
        ),
      )
    })

    test('property: rejects integers, NaN, and infinities', () => {
      fc.assert(
        fc.property(fc.integer(), (n) => {
          expect(Num.Float.is(n)).toBe(false)
        }),
      )
      expect(Num.Float.is(NaN)).toBe(false)
      expect(Num.Float.is(Infinity)).toBe(false)
      expect(Num.Float.is(-Infinity)).toBe(false)
    })
  })

  describe('isNaN', () => {
    test('property: only accepts NaN', () => {
      expect(Num.isNaN(NaN)).toBe(true)
      fc.assert(
        fc.property(fc.double({ noNaN: true }), (n) => {
          expect(Num.isNaN(n)).toBe(false)
        }),
      )
    })
  })

  describe('isPositive', () => {
    test('property: accepts numbers > 0', () => {
      fc.assert(
        fc.property(fc.double({ min: Number.MIN_VALUE, noNaN: true }), (n) => {
          expect(Num.Positive.is(n)).toBe(true)
        }),
      )
    })

    test('property: rejects numbers <= 0', () => {
      fc.assert(
        fc.property(fc.double({ max: 0, noNaN: true }), (n) => {
          expect(Num.Positive.is(n)).toBe(false)
        }),
      )
    })
  })

  describe('isNegative', () => {
    test('property: accepts numbers < 0', () => {
      fc.assert(
        fc.property(fc.double({ max: -Number.MIN_VALUE, noNaN: true }), (n) => {
          expect(Num.Negative.is(n)).toBe(true)
        }),
      )
    })

    test('property: rejects numbers >= 0', () => {
      fc.assert(
        fc.property(fc.double({ min: 0, noNaN: true }), (n) => {
          expect(Num.Negative.is(n)).toBe(false)
        }),
      )
    })
  })

  describe('isZero', () => {
    test('property: only accepts 0 and -0', () => {
      expect(Num.Zero.is(0)).toBe(true)
      expect(Num.Zero.is(-0)).toBe(true)
      fc.assert(
        fc.property(
          fc.double({ noNaN: true }).filter(n => n !== 0 && !Object.is(n, -0)),
          (n) => {
            expect(Num.Zero.is(n)).toBe(false)
          },
        ),
      )
    })
  })

  describe('isEven', () => {
    test('property: n is even iff n % 2 === 0', () => {
      fc.assert(
        fc.property(fc.integer(), (n) => {
          expect(Num.Even.is(n)).toBe(n % 2 === 0)
        }),
      )
    })

    test('property: rejects non-integers', () => {
      fc.assert(
        fc.property(
          fc.double({ noNaN: true }).filter(n => !Number.isInteger(n)),
          (n) => {
            expect(Num.Even.is(n)).toBe(false)
          },
        ),
      )
    })
  })

  describe('isOdd', () => {
    test('property: n is odd iff n % 2 !== 0', () => {
      fc.assert(
        fc.property(fc.integer(), (n) => {
          expect(Num.Odd.is(n)).toBe(n % 2 !== 0)
        }),
      )
    })

    test('property: isOdd and isEven are mutually exclusive for integers', () => {
      fc.assert(
        fc.property(fc.integer(), (n) => {
          expect(Num.Odd.is(n)).toBe(!Num.Even.is(n))
        }),
      )
    })
  })

  describe('isSafeInt', () => {
    test('property: accepts safe integers', () => {
      fc.assert(
        fc.property(fc.integer({ min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER }), (n) => {
          expect(Num.SafeInt.is(n)).toBe(true)
        }),
      )
    })

    test('property: rejects unsafe values', () => {
      expect(Num.SafeInt.is(Number.MAX_SAFE_INTEGER + 1)).toBe(false)
      expect(Num.SafeInt.is(Number.MIN_SAFE_INTEGER - 1)).toBe(false)
      expect(Num.SafeInt.is(1.5)).toBe(false)
    })
  })

  describe('inRange', () => {
    test('property: min <= value <= max', () => {
      fc.assert(
        fc.property(
          fc.double({ noNaN: true }),
          fc.double({ noNaN: true }),
          fc.double({ noNaN: true }),
          (a, b, value) => {
            const min = Math.min(a, b)
            const max = Math.max(a, b)
            expect(Num.InRange.is(value, min, max)).toBe(value >= min && value <= max)
          },
        ),
      )
    })

    test('property: inRangeWith creates equivalent function', () => {
      fc.assert(
        fc.property(
          fc.double({ noNaN: true }),
          fc.double({ noNaN: true }),
          fc.double({ noNaN: true }),
          (min, max, value) => {
            expect(Num.InRange.isWith(min, max)(value)).toBe(Num.InRange.is(value, min, max))
          },
        ),
      )
    })
  })
})

describe('core operations', () => {
  describe('clamp', () => {
    test('property: result is always within bounds', () => {
      fc.assert(
        fc.property(
          fc.double({ noNaN: true }),
          fc.double({ noNaN: true }),
          fc.double({ noNaN: true }),
          (value, a, b) => {
            const min = Math.min(a, b)
            const max = Math.max(a, b)
            const result = Num.InRange.clamp(value, min, max)
            expect(result).toBeGreaterThanOrEqual(min)
            expect(result).toBeLessThanOrEqual(max)
          },
        ),
      )
    })

    test('property: idempotent', () => {
      fc.assert(
        fc.property(
          fc.double({ noNaN: true }),
          fc.double({ noNaN: true }),
          fc.double({ noNaN: true }),
          (value, a, b) => {
            const min = Math.min(a, b)
            const max = Math.max(a, b)
            const once = Num.InRange.clamp(value, min, max)
            const twice = Num.InRange.clamp(once, min, max)
            expect(twice).toBe(once)
          },
        ),
      )
    })

    test('property: curried versions are equivalent', () => {
      fc.assert(
        fc.property(
          fc.double({ noNaN: true }),
          fc.double({ noNaN: true }),
          fc.double({ noNaN: true }),
          (value, a, b) => {
            const min = Math.min(a, b)
            const max = Math.max(a, b)
            expect(Num.InRange.clampOn(value)(min, max)).toBe(Num.InRange.clamp(value, min, max))
            expect(Num.InRange.clampWith(min, max)(value)).toBe(Num.InRange.clamp(value, min, max))
          },
        ),
      )
    })
  })

  describe('abs', () => {
    test('property: always non-negative', () => {
      fc.assert(
        fc.property(fc.double({ noNaN: true }), (n) => {
          expect(Num.abs(n)).toBeGreaterThanOrEqual(0)
        }),
      )
    })

    test('property: abs(abs(n)) = abs(n)', () => {
      fc.assert(
        fc.property(fc.double({ noNaN: true }), (n) => {
          expect(Num.abs(Num.abs(n))).toBe(Num.abs(n))
        }),
      )
    })

    test('property: abs(-n) = abs(n)', () => {
      fc.assert(
        fc.property(fc.double({ noNaN: true }), (n) => {
          expect(Num.abs(-n)).toBe(Num.abs(n))
        }),
      )
    })
  })

  describe('sign', () => {
    test('property: returns -1, 0, or 1', () => {
      fc.assert(
        fc.property(fc.double({ noNaN: true }), (n) => {
          const s = Num.sign(n)
          expect(s === -1 || s === 0 || s === 1).toBe(true)
        }),
      )
    })

    test('property: sign(n) * abs(n) = n (except for -0)', () => {
      fc.assert(
        fc.property(fc.double({ noNaN: true }), (n) => {
          if (Object.is(n, -0)) return // Special case for -0
          expect(Num.sign(n) * Num.abs(n)).toBe(n)
        }),
      )
    })
  })

  describe('inc/dec', () => {
    test('property: inc(n) = n + 1', () => {
      fc.assert(
        fc.property(fc.double({ noNaN: true, noDefaultInfinity: true }), (n) => {
          expect(Num.inc(n)).toBe(n + 1)
        }),
      )
    })

    test('property: dec(n) = n - 1', () => {
      fc.assert(
        fc.property(fc.double({ noNaN: true, noDefaultInfinity: true }), (n) => {
          expect(Num.dec(n)).toBe(n - 1)
        }),
      )
    })

    test('property: inc(dec(n)) = n', () => {
      fc.assert(
        fc.property(fc.double({ noNaN: true, noDefaultInfinity: true, min: -1e15, max: 1e15 }), (n) => {
          // Skip extremely small numbers due to floating point precision
          if (Math.abs(n) < Number.EPSILON) return
          const result = Num.inc(Num.dec(n))
          // For large numbers, floating point precision loss is expected
          const tolerance = Math.max(Math.abs(n) * Number.EPSILON * 10, Number.EPSILON)
          expect(Math.abs(result - n)).toBeLessThanOrEqual(tolerance)
        }),
      )
    })
  })

  describe('safeDiv', () => {
    test('property: returns dividend/divisor when divisor != 0 and both are finite', () => {
      fc.assert(
        fc.property(
          fc.double({ noNaN: true, noDefaultInfinity: true }),
          fc.double({ noNaN: true, noDefaultInfinity: true }).filter(n => n !== 0),
          (dividend, divisor) => {
            expect(Num.NonZero.safeDiv(dividend, divisor)).toBe(dividend / divisor)
          },
        ),
      )
    })

    test('property: returns null when divisor = 0 or values are infinite', () => {
      fc.assert(
        fc.property(
          fc.double({ noNaN: true }),
          (dividend) => {
            expect(Num.NonZero.safeDiv(dividend, 0)).toBe(null)
          },
        ),
      )
      expect(Num.NonZero.safeDiv(Infinity, 1)).toBe(null)
      expect(Num.NonZero.safeDiv(1, Infinity)).toBe(null)
      expect(Num.NonZero.safeDiv(-Infinity, 1)).toBe(null)
    })

    test('property: safeDivWith is equivalent', () => {
      fc.assert(
        fc.property(
          fc.double({ noNaN: true }),
          fc.double({ noNaN: true }),
          (dividend, divisor) => {
            expect(Num.NonZero.safeDivWith(divisor)(dividend)).toBe(Num.NonZero.safeDiv(dividend, divisor))
          },
        ),
      )
    })
  })

  describe('mod', () => {
    test('property: result has same sign as divisor when divisor > 0', () => {
      fc.assert(
        fc.property(
          fc.double({ noNaN: true, noDefaultInfinity: true, min: -1e100, max: 1e100 }),
          fc.double({ min: Number.MIN_VALUE, noNaN: true, noDefaultInfinity: true, max: 1e100 }),
          (dividend, divisor) => {
            const nonZeroDivisor = Num.NonZero.from(divisor)
            if (!nonZeroDivisor) return // Skip if divisor is zero
            const result = Num.mod(dividend, nonZeroDivisor)
            // Skip if result is NaN due to overflow
            if (isNaN(result)) return
            expect(result).toBeGreaterThanOrEqual(0)
            expect(result).toBeLessThan(Math.abs(divisor))
          },
        ),
      )
    })

    test('property: modWith is equivalent', () => {
      fc.assert(
        fc.property(
          fc.double({ noNaN: true }),
          fc.double({ noNaN: true }).filter(n => n !== 0),
          (dividend, divisor) => {
            const nonZeroDivisor = Num.NonZero.from(divisor)
            if (!nonZeroDivisor) return // Skip if divisor is zero
            expect(Num.modWith(nonZeroDivisor)(dividend)).toBe(Num.mod(dividend, nonZeroDivisor))
          },
        ),
      )
    })
  })
})

describe('mathematical operations', () => {
  describe('arithmetic', () => {
    test('property: addition is commutative', () => {
      fc.assert(
        fc.property(
          fc.double({ noNaN: true }),
          fc.double({ noNaN: true }),
          (a, b) => {
            expect(Num.add(a, b)).toBe(Num.add(b, a))
          },
        ),
      )
    })

    test('property: multiplication is commutative', () => {
      fc.assert(
        fc.property(
          fc.double({ noNaN: true }),
          fc.double({ noNaN: true }),
          (a, b) => {
            expect(Num.multiply(a, b)).toBe(Num.multiply(b, a))
          },
        ),
      )
    })

    test('property: subtraction is inverse of addition', () => {
      fc.assert(
        fc.property(
          fc.double({ noNaN: true, noDefaultInfinity: true, min: -1e15, max: 1e15 }),
          fc.double({ noNaN: true, noDefaultInfinity: true, min: -1e15, max: 1e15 }),
          (a, b) => {
            const result = Num.subtract(Num.add(a, b), b)
            // Use relative tolerance based on the magnitude of the operation
            const magnitude = Math.max(Math.abs(a), Math.abs(b), Math.abs(a + b))
            const tolerance = Math.max(magnitude * Number.EPSILON * 10, 1e-9)
            expect(Math.abs(result - a)).toBeLessThanOrEqual(tolerance)
          },
        ),
      )
    })

    test('property: division is inverse of multiplication', () => {
      fc.assert(
        fc.property(
          fc.double({ noNaN: true, noDefaultInfinity: true, min: -1e15, max: 1e15 }),
          fc.double({ noNaN: true, noDefaultInfinity: true, min: -1e15, max: 1e15 }).filter(n => Math.abs(n) > 1e-10),
          (a, b) => {
            const result = Num.divide(Num.multiply(a, b), Num.NonZero.from(b))
            // Use relative tolerance for floating point comparisons
            const tolerance = Math.max(Math.abs(a) * 1e-9, 1e-9)
            expect(Math.abs(result - a)).toBeLessThanOrEqual(tolerance)
          },
        ),
      )
    })

    test('property: curried versions are equivalent', () => {
      fc.assert(
        fc.property(
          fc.double({ noNaN: true }),
          fc.double({ noNaN: true }),
          (a, b) => {
            expect(Num.addWith(a)(b)).toBe(Num.add(a, b))
            expect(Num.subtractWith(a)(b)).toBe(Num.subtract(a, b))
            expect(Num.multiplyWith(b)(a)).toBe(Num.multiply(a, b))
            // Only test divide when b is non-zero
            if (b !== 0) {
              expect(Num.divideWith(Num.NonZero.from(b))(a)).toBe(Num.divide(a, Num.NonZero.from(b)))
            }
          },
        ),
      )
    })
  })

  describe('power', () => {
    test('property: x^0 = 1', () => {
      fc.assert(
        fc.property(fc.double({ noNaN: true }), (x) => {
          expect(Num.power(x, 0)).toBe(1)
        }),
      )
    })

    test('property: x^1 = x', () => {
      fc.assert(
        fc.property(fc.double({ noNaN: true }), (x) => {
          expect(Num.power(x, 1)).toBe(x)
        }),
      )
    })

    test('property: x^(a+b) = x^a * x^b', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.1, max: 10, noNaN: true }),
          fc.integer({ min: -5, max: 5 }),
          fc.integer({ min: -5, max: 5 }),
          (x, a, b) => {
            // Skip cases that might lead to very small or very large numbers
            if (Math.abs(a + b) > 10) return
            const left = Num.power(x, a + b)
            const right = Num.multiply(Num.power(x, a), Num.power(x, b))
            // Use relative tolerance for larger numbers
            const tolerance = Math.max(Math.abs(left) * 1e-10, 1e-10)
            expect(Math.abs(left - right)).toBeLessThan(tolerance)
          },
        ),
      )
    })
  })

  describe('rounding', () => {
    test('property: round is idempotent', () => {
      fc.assert(
        fc.property(fc.double({ noNaN: true }), fc.integer({ min: 0, max: 10 }), (n, precision) => {
          const once = Num.round(n, precision)
          const twice = Num.round(once, precision)
          expect(twice).toBe(once)
        }),
      )
    })

    test('property: roundWith creates equivalent function', () => {
      fc.assert(
        fc.property(fc.double({ noNaN: true }), fc.integer({ min: 0, max: 10 }), (n, precision) => {
          expect(Num.roundWith(precision)(n)).toBe(Num.round(n, precision))
        }),
      )
    })

    test('property: floor(n) <= n <= ceil(n)', () => {
      fc.assert(
        fc.property(fc.double({ noNaN: true, noDefaultInfinity: true }), (n) => {
          const finite = Num.Finite.from(n)
          if (!finite) return // Skip if not finite
          expect(Num.floor(finite)).toBeLessThanOrEqual(n)
          expect(Num.ceil(finite)).toBeGreaterThanOrEqual(n)
        }),
      )
    })

    test('property: trunc removes fractional part', () => {
      fc.assert(
        fc.property(fc.double({ noNaN: true, noDefaultInfinity: true }), (n) => {
          const finite = Num.Finite.from(n)
          if (!finite) return // Skip if not finite
          const truncated = Num.trunc(finite)
          expect(Number.isInteger(truncated) || !Number.isFinite(truncated)).toBe(true)
        }),
      )
    })
  })

  describe('roots and logarithms', () => {
    test('property: sqrt(x)^2 = x for x >= 0', () => {
      fc.assert(
        fc.property(fc.double({ min: 0, max: 1e15, noNaN: true, noDefaultInfinity: true }), (x) => {
          const nonNeg = Num.NonNegative.from(x)
          if (!nonNeg) return // This should never happen as x >= 0
          const result = Num.power(Num.sqrt(nonNeg), 2)
          // Use relative tolerance
          const tolerance = Math.max(x * 1e-10, 1e-10)
          expect(Math.abs(result - x)).toBeLessThan(tolerance)
        }),
      )
    })

    test('property: cbrt(x)^3 = x', () => {
      fc.assert(
        fc.property(fc.double({ noNaN: true, noDefaultInfinity: true, min: -1000, max: 1000 }), (x) => {
          expect(Num.power(Num.cbrt(x), 3)).toBeCloseTo(x, 10)
        }),
      )
    })

    test('property: log(e^x) = x', () => {
      fc.assert(
        fc.property(fc.double({ min: -100, max: 100, noNaN: true }), (x) => {
          const expX = Math.exp(x)
          if (expX > 0) {
            expect(Num.log(Num.Positive.from(expX))).toBeCloseTo(x, 10)
          }
        }),
      )
    })

    test('property: log10(10^x) = x', () => {
      fc.assert(
        fc.property(fc.double({ min: -100, max: 100, noNaN: true }), (x) => {
          const pow10X = Math.pow(10, x)
          if (pow10X > 0) {
            expect(Num.log10(Num.Positive.from(pow10X))).toBeCloseTo(x, 10)
          }
        }),
      )
    })

    test('property: log2(2^x) = x', () => {
      fc.assert(
        fc.property(fc.double({ min: -100, max: 100, noNaN: true }), (x) => {
          const pow2X = Math.pow(2, x)
          if (pow2X > 0) {
            expect(Num.log2(Num.Positive.from(pow2X))).toBeCloseTo(x, 10)
          }
        }),
      )
    })
  })

  describe('trigonometry', () => {
    test('property: sin^2 + cos^2 = 1', () => {
      fc.assert(
        fc.property(fc.double({ noNaN: true, noDefaultInfinity: true }), (x) => {
          const finite = Num.Finite.from(x)
          if (!finite) return // Skip if not finite
          const sin2 = Num.power(Num.sin(finite), 2)
          const cos2 = Num.power(Num.cos(finite), 2)
          expect(sin2 + cos2).toBeCloseTo(1, 10)
        }),
      )
    })

    test('property: tan = sin/cos', () => {
      fc.assert(
        fc.property(
          fc.double({ noNaN: true }).filter(x => Math.abs(Math.cos(x)) > 0.0001),
          (x) => {
            const finite = Num.Finite.from(x)
            if (!finite) return // Skip if not finite
            const cosX = Num.cos(finite)
            if (cosX === 0) return // Skip if cos(x) is zero
            const nonZeroCos = Num.NonZero.from(cosX)
            if (!nonZeroCos) return // Skip if we can't create NonZero
            expect(Num.tan(finite)).toBeCloseTo(Num.sin(finite) / nonZeroCos, 10)
          },
        ),
      )
    })

    test('property: asin(sin(x)) = x for x in [-π/2, π/2]', () => {
      fc.assert(
        fc.property(fc.double({ min: -Math.PI / 2, max: Math.PI / 2, noNaN: true }), (x) => {
          const finite = Num.Finite.from(x)
          if (!finite) return // Skip if not finite
          expect(Num.asin(Num.sin(finite))).toBeCloseTo(x, 10)
        }),
      )
    })

    test('property: degToRad and radToDeg are inverses', () => {
      fc.assert(
        fc.property(fc.double({ noNaN: true, noDefaultInfinity: true, min: -1e10, max: 1e10 }), (deg) => {
          const result = Num.radToDeg(Num.degToRad(Num.Degrees.from(deg)))
          // Use relative tolerance for floating point comparisons
          const tolerance = Math.max(Math.abs(deg) * 1e-10, 1e-10)
          expect(Math.abs(result - deg)).toBeLessThan(tolerance)
        }),
      )
    })
  })

  describe('min/max', () => {
    test('property: min(a,b) <= a and min(a,b) <= b', () => {
      fc.assert(
        fc.property(
          fc.double({ noNaN: true }),
          fc.double({ noNaN: true }),
          (a, b) => {
            const m = Num.min(a, b)
            expect(m).toBeLessThanOrEqual(a)
            expect(m).toBeLessThanOrEqual(b)
          },
        ),
      )
    })

    test('property: max(a,b) >= a and max(a,b) >= b', () => {
      fc.assert(
        fc.property(
          fc.double({ noNaN: true }),
          fc.double({ noNaN: true }),
          (a, b) => {
            const m = Num.max(a, b)
            expect(m).toBeGreaterThanOrEqual(a)
            expect(m).toBeGreaterThanOrEqual(b)
          },
        ),
      )
    })

    test('property: min and max are idempotent', () => {
      fc.assert(
        fc.property(
          fc.double({ noNaN: true }),
          fc.double({ noNaN: true }),
          (a, b) => {
            expect(Num.min(a, Num.min(a, b))).toBe(Num.min(a, b))
            expect(Num.max(a, Num.max(a, b))).toBe(Num.max(a, b))
          },
        ),
      )
    })
  })

  describe('gcd/lcm', () => {
    test('property: gcd divides both numbers', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10000 }),
          fc.integer({ min: 1, max: 10000 }),
          (a, b) => {
            const intA = Num.Int.from(a)
            const intB = Num.Int.from(b)
            if (!intA || !intB) return // This should never happen
            const g = Num.gcd(intA, intB)
            expect(a % g).toBe(0)
            expect(b % g).toBe(0)
          },
        ),
      )
    })

    test('property: lcm is divisible by both numbers', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 1000 }),
          fc.integer({ min: 1, max: 1000 }),
          (a, b) => {
            const intA = Num.Int.from(a)
            const intB = Num.Int.from(b)
            if (!intA || !intB) return // This should never happen
            const l = Num.lcm(intA, intB)
            expect(l % a).toBe(0)
            expect(l % b).toBe(0)
          },
        ),
      )
    })

    test('property: gcd(a,b) * lcm(a,b) = |a * b|', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 1000 }),
          fc.integer({ min: 1, max: 1000 }),
          (a, b) => {
            const intA = Num.Int.from(a)
            const intB = Num.Int.from(b)
            if (!intA || !intB) return // This should never happen
            expect(Num.gcd(intA, intB) * Num.lcm(intA, intB)).toBe(Math.abs(a * b))
          },
        ),
      )
    })
  })

  describe('constants', () => {
    test('mathematical constants are correct', () => {
      expect(Num.PI).toBe(Math.PI)
      expect(Num.E).toBe(Math.E)
      expect(Num.TAU).toBe(2 * Math.PI)
      expect(Num.GOLDEN_RATIO).toBeCloseTo((1 + Math.sqrt(5)) / 2, 10)
    })

    test('property: TAU = 2 * PI', () => {
      expect(Num.TAU).toBe(2 * Num.PI)
    })
  })

  describe('BigInt module', () => {
    test('BigInt is accessible as Num.BigInt', () => {
      expect(typeof Num.BigInt).toBe('object')
      expect(typeof Num.BigInt.from).toBe('function')
      expect(typeof Num.BigInt.add).toBe('function')
    })

    test('BigInt basic operations work', () => {
      const a = Num.BigInt.from(123)
      const b = Num.BigInt.from(456)
      const sum = Num.BigInt.add(a, b)

      expect(sum).toBe(579n)
      expect(Num.BigInt.is(sum)).toBe(true)
    })

    test('BigInt handles large numbers', () => {
      const large = Num.BigInt.from('123456789012345678901234567890')
      expect(Num.BigInt.toString(large)).toBe('123456789012345678901234567890')
    })
  })
})
