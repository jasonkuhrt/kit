import { property } from '#test/test'
import fc from 'fast-check'
import { expect, test } from 'vitest'
import { Json } from './$.js'

property('isPrimitive detects JSON primitives', fc.jsonValue(), (value) => {
  const isPrimitive = typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    || value === null
  expect(Json.isPrimitive(value)).toBe(isPrimitive)
})

test('isPrimitive rejects non-JSON values', () => {
  expect(Json.isPrimitive(undefined)).toBe(false)
  expect(Json.isPrimitive(new Date())).toBe(false)
  expect(Json.isPrimitive(() => {})).toBe(false)
})

property('isValue accepts all JSON values', fc.jsonValue(), (value) => {
  expect(Json.isValue(value)).toBe(true)
})

test('isValue rejects non-JSON types', () => {
  expect(Json.isValue(undefined)).toBe(false)
  expect(Json.isValue(new Date())).toBe(false)
  expect(Json.isValue(() => {})).toBe(false)
  expect(Json.isValue(Symbol('test'))).toBe(false)
})

property('isObject detects JSON objects', fc.jsonValue(), (value) => {
  const isObject = value !== null && typeof value === 'object' && !Array.isArray(value)
  expect(Json.isObject(value)).toBe(isObject)
})

property('codec round-trips JSON values', fc.jsonValue(), (value) => {
  const encoded = Json.codec.encode(value)
  const decoded = Json.codec.decode(encoded)

  // Handle +0/-0 edge case: JSON.stringify converts -0 to 0
  const hasNegativeZero = (v: unknown): boolean => {
    if (Object.is(v, -0)) return true
    if (Array.isArray(v)) return v.some(hasNegativeZero)
    if (v && typeof v === 'object') {
      return Object.values(v).some(hasNegativeZero)
    }
    return false
  }

  if (hasNegativeZero(value)) {
    // For -0 values, JSON will convert to +0, so we need to handle this case
    const normalizeZero = (v: unknown): unknown => {
      if (Object.is(v, -0)) return 0
      if (Array.isArray(v)) return v.map(normalizeZero)
      if (v && typeof v === 'object') {
        const result: any = {}
        for (const [k, val] of Object.entries(v)) {
          result[k] = normalizeZero(val)
        }
        return result
      }
      return v
    }
    expect(decoded).toEqual(normalizeZero(value))
  } else {
    expect(decoded).toEqual(value)
  }
})

test('codec pretty-prints', () => {
  const encoded = Json.codec.encode({ a: 1, b: [2, 3] })
  expect(encoded).toContain('\n')
  expect(encoded).toContain('  ')
  expect(encoded).toBe('{\n  "a": 1,\n  "b": [\n    2,\n    3\n  ]\n}')
})

test('codec handles typed values', () => {
  const user = { name: 'John', age: 30 }

  const encoded = Json.encode(user)
  const decoded = Json.decode(encoded)

  expect(decoded).toEqual(user)
  expect(encoded).toContain('"name": "John"')
})

property('encode/decode are codec aliases', fc.jsonValue(), (value) => {
  expect(Json.encode(value)).toBe(Json.codec.encode(value))
  expect(Json.decode(Json.encode(value))).toEqual(value)
})

test('decode throws on invalid JSON', () => {
  expect(() => Json.decode('invalid')).toThrow()
  expect(() => Json.decode('{incomplete')).toThrow()
})

property('schemas parse valid JSON', fc.jsonValue(), (value) => {
  expect(Json.Value.parse(value)).toEqual(value)

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) {
    expect(Json.Primitive.parse(value)).toEqual(value)
  }

  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    expect(Json.ObjectParser.parse(value)).toEqual(value)
  }
})
