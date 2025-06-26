import { describe, expect, test } from 'vitest'
import { Complex } from './$.ts'

describe('Complex', () => {
  describe('from', () => {
    test('creates complex numbers', () => {
      const z = Complex.from(3, 4)
      expect(z.real).toBe(3)
      expect(z.imaginary).toBe(4)
    })

    test('defaults imaginary to 0', () => {
      const z = Complex.from(5)
      expect(z.real).toBe(5)
      expect(z.imaginary).toBe(0)
    })

    test('throws on non-finite values', () => {
      expect(() => Complex.from(Infinity, 0)).toThrow('finite')
      expect(() => Complex.from(0, NaN)).toThrow('finite')
    })
  })

  describe('constants', () => {
    test('I is the imaginary unit', () => {
      expect(Complex.I.real).toBe(0)
      expect(Complex.I.imaginary).toBe(1)
    })

    test('ZERO is zero', () => {
      expect(Complex.ZERO.real).toBe(0)
      expect(Complex.ZERO.imaginary).toBe(0)
    })

    test('ONE is one', () => {
      expect(Complex.ONE.real).toBe(1)
      expect(Complex.ONE.imaginary).toBe(0)
    })
  })

  describe('real and imaginary constructors', () => {
    test('real creates real complex number', () => {
      const z = Complex.real(5)
      expect(z.real).toBe(5)
      expect(z.imaginary).toBe(0)
    })

    test('imaginary creates pure imaginary number', () => {
      const z = Complex.imaginary(3)
      expect(z.real).toBe(0)
      expect(z.imaginary).toBe(3)
    })
  })

  describe('arithmetic operations', () => {
    test('add', () => {
      const a = Complex.from(3, 4)
      const b = Complex.from(1, 2)
      const sum = Complex.add(a, b)

      expect(sum.real).toBe(4)
      expect(sum.imaginary).toBe(6)
    })

    test('subtract', () => {
      const a = Complex.from(5, 7)
      const b = Complex.from(2, 3)
      const diff = Complex.subtract(a, b)

      expect(diff.real).toBe(3)
      expect(diff.imaginary).toBe(4)
    })

    test('multiply', () => {
      const a = Complex.from(3, 4)
      const b = Complex.from(1, 2)
      const product = Complex.multiply(a, b)

      // (3 + 4i)(1 + 2i) = 3 + 6i + 4i + 8i² = 3 + 10i - 8 = -5 + 10i
      expect(product.real).toBe(-5)
      expect(product.imaginary).toBe(10)
    })

    test('multiply by i gives i²=-1', () => {
      const result = Complex.multiply(Complex.I, Complex.I)
      expect(result.real).toBe(-1)
      expect(result.imaginary).toBe(0)
    })

    test('divide', () => {
      const a = Complex.from(1, 1)
      const b = Complex.from(1, -1)
      const quotient = Complex.divide(a, b)

      // (1 + i) / (1 - i) = (1 + i)(1 + i) / ((1 - i)(1 + i)) = (1 + 2i - 1) / 2 = 2i/2 = i
      expect(quotient.real).toBeCloseTo(0)
      expect(quotient.imaginary).toBeCloseTo(1)
    })

    test('divide throws on zero', () => {
      const a = Complex.from(1, 1)
      expect(() => Complex.divide(a, Complex.ZERO)).toThrow('zero')
    })
  })

  describe('conjugate', () => {
    test('flips imaginary sign', () => {
      const z = Complex.from(3, 4)
      const conj = Complex.conjugate(z)

      expect(conj.real).toBe(3)
      expect(conj.imaginary).toBe(-4)
    })

    test('real numbers are self-conjugate', () => {
      const z = Complex.from(5, 0)
      const conj = Complex.conjugate(z)

      expect(conj.real).toBe(5)
      expect(conj.imaginary).toBe(0)
    })
  })

  describe('abs (magnitude)', () => {
    test('3-4-5 triangle', () => {
      const z = Complex.from(3, 4)
      expect(Complex.abs(z)).toBe(5)
    })

    test('pure imaginary', () => {
      const z = Complex.from(0, 5)
      expect(Complex.abs(z)).toBe(5)
    })

    test('real number', () => {
      const z = Complex.from(-3, 0)
      expect(Complex.abs(z)).toBe(3)
    })

    test('zero', () => {
      expect(Complex.abs(Complex.ZERO)).toBe(0)
    })
  })

  describe('arg (argument/phase)', () => {
    test('positive real axis', () => {
      const z = Complex.from(1, 0)
      expect(Complex.arg(z)).toBe(0)
    })

    test('positive imaginary axis', () => {
      const z = Complex.from(0, 1)
      expect(Complex.arg(z)).toBeCloseTo(Math.PI / 2)
    })

    test('negative real axis', () => {
      const z = Complex.from(-1, 0)
      expect(Complex.arg(z)).toBeCloseTo(Math.PI)
    })

    test('negative imaginary axis', () => {
      const z = Complex.from(0, -1)
      expect(Complex.arg(z)).toBeCloseTo(-Math.PI / 2)
    })

    test('first quadrant', () => {
      const z = Complex.from(1, 1)
      expect(Complex.arg(z)).toBeCloseTo(Math.PI / 4)
    })

    test('throws on zero', () => {
      expect(() => Complex.arg(Complex.ZERO)).toThrow('undefined')
    })
  })

  describe('polar form', () => {
    test('toPolar', () => {
      const z = Complex.from(1, 1)
      const polar = Complex.toPolar(z)

      expect(polar.magnitude).toBeCloseTo(Math.sqrt(2))
      expect(polar.angle).toBeCloseTo(Math.PI / 4)
    })

    test('fromPolar', () => {
      const z = Complex.fromPolar(Math.sqrt(2), Math.PI / 4)

      expect(z.real).toBeCloseTo(1)
      expect(z.imaginary).toBeCloseTo(1)
    })

    test('fromPolar throws on negative magnitude', () => {
      expect(() => Complex.fromPolar(-1, 0)).toThrow('non-negative')
    })

    test('round trip polar conversion', () => {
      const original = Complex.from(3, 4)
      const polar = Complex.toPolar(original)
      const converted = Complex.fromPolar(polar.magnitude, polar.angle)

      expect(converted.real).toBeCloseTo(original.real)
      expect(converted.imaginary).toBeCloseTo(original.imaginary)
    })
  })

  describe('power', () => {
    test('i to various powers', () => {
      expect(Complex.power(Complex.I, 1).imaginary).toBeCloseTo(1)
      expect(Complex.power(Complex.I, 2).real).toBeCloseTo(-1)
      expect(Complex.power(Complex.I, 3).imaginary).toBeCloseTo(-1)
      expect(Complex.power(Complex.I, 4).real).toBeCloseTo(1)
    })

    test('square of (1+i)', () => {
      const z = Complex.from(1, 1)
      const squared = Complex.power(z, 2)

      // (1+i)² = 1 + 2i + i² = 1 + 2i - 1 = 2i
      expect(squared.real).toBeCloseTo(0)
      expect(squared.imaginary).toBeCloseTo(2)
    })

    test('square root of -1', () => {
      const z = Complex.from(-1, 0)
      const sqrt = Complex.power(z, 0.5)

      expect(sqrt.real).toBeCloseTo(0)
      expect(sqrt.imaginary).toBeCloseTo(1)
    })

    test('0^0 throws', () => {
      expect(() => Complex.power(Complex.ZERO, 0)).toThrow('undefined')
    })
  })

  describe('sqrt', () => {
    test('square root of -1 is i', () => {
      const z = Complex.from(-1, 0)
      const sqrt = Complex.sqrt(z)

      expect(sqrt.real).toBeCloseTo(0)
      expect(sqrt.imaginary).toBeCloseTo(1)
    })

    test('square root of 4 is 2', () => {
      const z = Complex.from(4, 0)
      const sqrt = Complex.sqrt(z)

      expect(sqrt.real).toBeCloseTo(2)
      expect(sqrt.imaginary).toBeCloseTo(0)
    })
  })

  describe('exp (exponential)', () => {
    test('Eulers identity: e^(iπ) = -1', () => {
      const z = Complex.from(0, Math.PI)
      const result = Complex.exp(z)

      expect(result.real).toBeCloseTo(-1)
      expect(result.imaginary).toBeCloseTo(0, 10)
    })

    test('e^(iπ/2) = i', () => {
      const z = Complex.from(0, Math.PI / 2)
      const result = Complex.exp(z)

      expect(result.real).toBeCloseTo(0, 10)
      expect(result.imaginary).toBeCloseTo(1)
    })

    test('e^1 = e', () => {
      const z = Complex.from(1, 0)
      const result = Complex.exp(z)

      expect(result.real).toBeCloseTo(Math.E)
      expect(result.imaginary).toBeCloseTo(0)
    })
  })

  describe('log (logarithm)', () => {
    test('log(e) = 1', () => {
      const z = Complex.from(Math.E, 0)
      const result = Complex.log(z)

      expect(result.real).toBeCloseTo(1)
      expect(result.imaginary).toBeCloseTo(0)
    })

    test('log(-1) = iπ', () => {
      const z = Complex.from(-1, 0)
      const result = Complex.log(z)

      expect(result.real).toBeCloseTo(0, 10)
      expect(result.imaginary).toBeCloseTo(Math.PI)
    })

    test('log(i) = iπ/2', () => {
      const result = Complex.log(Complex.I)

      expect(result.real).toBeCloseTo(0, 10)
      expect(result.imaginary).toBeCloseTo(Math.PI / 2)
    })

    test('throws on zero', () => {
      expect(() => Complex.log(Complex.ZERO)).toThrow('undefined')
    })
  })

  describe('equals', () => {
    test('exact equality', () => {
      const a = Complex.from(1, 2)
      const b = Complex.from(1, 2)
      expect(Complex.equals(a, b)).toBe(true)
    })

    test('inequality', () => {
      const a = Complex.from(1, 2)
      const b = Complex.from(1, 3)
      expect(Complex.equals(a, b)).toBe(false)
    })

    test('within tolerance', () => {
      const a = Complex.from(1, 2)
      const b = Complex.from(1.0000000001, 2) // 1e-10 difference
      expect(Complex.equals(a, b)).toBe(true)
    })

    test('custom tolerance', () => {
      const a = Complex.from(1, 2)
      const b = Complex.from(1.01, 2)
      expect(Complex.equals(a, b, 0.1)).toBe(true)
      expect(Complex.equals(a, b, 0.001)).toBe(false)
    })
  })

  describe('toString', () => {
    test('general form', () => {
      const z = Complex.from(3, 4)
      expect(Complex.toString(z)).toBe('3 + 4i')
    })

    test('negative imaginary', () => {
      const z = Complex.from(3, -4)
      expect(Complex.toString(z)).toBe('3 - 4i')
    })

    test('pure real', () => {
      const z = Complex.from(5, 0)
      expect(Complex.toString(z)).toBe('5')
    })

    test('pure imaginary', () => {
      const z = Complex.from(0, 3)
      expect(Complex.toString(z)).toBe('3i')
    })

    test('imaginary unit', () => {
      expect(Complex.toString(Complex.I)).toBe('i')
    })

    test('negative imaginary unit', () => {
      const z = Complex.from(0, -1)
      expect(Complex.toString(z)).toBe('-i')
    })

    test('zero', () => {
      expect(Complex.toString(Complex.ZERO)).toBe('0')
    })

    test('with real and imaginary unit', () => {
      const z = Complex.from(2, 1)
      expect(Complex.toString(z)).toBe('2 + i')
    })

    test('with real and negative imaginary unit', () => {
      const z = Complex.from(2, -1)
      expect(Complex.toString(z)).toBe('2 - i')
    })
  })

  describe('curried functions', () => {
    test('fromWith', () => {
      const realFive = Complex.fromWith(5)
      const z = realFive(3)
      expect(z.real).toBe(5)
      expect(z.imaginary).toBe(3)
    })

    test('fromOn', () => {
      const imaginaryTwo = Complex.fromOn(2)
      const z = imaginaryTwo(3)
      expect(z.real).toBe(3)
      expect(z.imaginary).toBe(2)
    })

    test('addWith', () => {
      const addI = Complex.addWith(Complex.I)
      const result = addI(Complex.from(3, 0))
      expect(result.real).toBe(3)
      expect(result.imaginary).toBe(1)
    })

    test('addOn', () => {
      const addToBase = Complex.addOn(Complex.from(5, 3))
      const result = addToBase(Complex.from(1, 1))
      expect(result.real).toBe(6)
      expect(result.imaginary).toBe(4)
    })

    test('multiplyWith', () => {
      const double = Complex.multiplyWith(Complex.from(2, 0))
      const result = double(Complex.from(3, 4))
      expect(result.real).toBe(6)
      expect(result.imaginary).toBe(8)
    })

    test('multiplyOn', () => {
      const multiplyBase = Complex.multiplyOn(Complex.from(3, 4))
      const result = multiplyBase(Complex.from(2, 0))
      expect(result.real).toBe(6)
      expect(result.imaginary).toBe(8)
    })

    test('subtractWith', () => {
      const subtractFromI = Complex.subtractWith(Complex.I)
      const result = subtractFromI(Complex.from(3, 2))
      expect(result.real).toBe(-3)
      expect(result.imaginary).toBe(-1)
    })

    test('subtractOn', () => {
      const subtractFromTen = Complex.subtractOn(Complex.from(10, 0))
      const result = subtractFromTen(Complex.from(3, 0))
      expect(result.real).toBe(7)
      expect(result.imaginary).toBe(0)
    })

    test('divideWith', () => {
      const divideByTwo = Complex.divideWith(Complex.from(6, 8))
      const result = divideByTwo(Complex.from(2, 0))
      expect(result.real).toBe(3)
      expect(result.imaginary).toBe(4)
    })

    test('divideOn', () => {
      const divideTenBy = Complex.divideOn(Complex.from(10, 0))
      const result = divideTenBy(Complex.from(2, 0))
      expect(result.real).toBe(5)
      expect(result.imaginary).toBe(0)
    })

    test('powerWith', () => {
      const square = Complex.powerWith(2)
      const result = square(Complex.I)
      expect(result.real).toBeCloseTo(-1)
      expect(result.imaginary).toBeCloseTo(0)
    })

    test('powerOn', () => {
      const iPower = Complex.powerOn(Complex.I)
      const result = iPower(2)
      expect(result.real).toBeCloseTo(-1)
      expect(result.imaginary).toBeCloseTo(0)
    })

    test('equalsWith', () => {
      const equalsZero = Complex.equalsWith(Complex.ZERO)
      expect(equalsZero(Complex.ZERO)).toBe(true)
      expect(equalsZero(Complex.ONE)).toBe(false)
    })

    test('equalsOn', () => {
      const checkZero = Complex.equalsOn(Complex.ZERO)
      expect(checkZero(Complex.ZERO)).toBe(true)
      expect(checkZero(Complex.ONE)).toBe(false)
    })
  })

  describe('is', () => {
    test('recognizes valid complex numbers', () => {
      expect(Complex.is({ real: 3, imaginary: 4 })).toBe(true)
      expect(Complex.is({ real: 0, imaginary: 0 })).toBe(true)
      expect(Complex.is({ real: -1, imaginary: 2.5 })).toBe(true)
    })

    test('rejects invalid values', () => {
      expect(Complex.is(3)).toBe(false)
      expect(Complex.is({ real: 'a', imaginary: 4 })).toBe(false)
      expect(Complex.is({ real: 3 })).toBe(false)
      expect(Complex.is({ real: Infinity, imaginary: 0 })).toBe(false)
      expect(Complex.is({ real: 0, imaginary: NaN })).toBe(false)
      expect(Complex.is(null)).toBe(false)
    })
  })
})
