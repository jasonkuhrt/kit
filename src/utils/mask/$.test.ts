import * as fc from 'fast-check'
import { describe, expect, test } from 'vitest'
import { Mask } from './$.js'

describe('create', () => {
  test('boolean options create binary masks', () => {
    const showMask = Mask.create(true)
    const hideMask = Mask.create(false)

    expect(showMask.type).toBe('binary')
    expect(hideMask.type).toBe('binary')

    if (showMask.type === 'binary' && hideMask.type === 'binary') {
      expect(showMask.show).toBe(true)
      expect(hideMask.show).toBe(false)
    }
  })

  test('array options create allow mode properties mask', () => {
    const mask = Mask.create(['name', 'age'])

    expect(mask.type).toBe('properties')
    if (mask.type === 'properties') {
      expect(mask.mode).toBe('allow')
      expect(mask.properties).toEqual(['name', 'age'])
    }
  })

  test('object options create mode based on values', () => {
    const allowMask = Mask.create({ name: true, age: true, password: false })
    const denyMask = Mask.create({ password: false, secret: false })

    expect(allowMask.type).toBe('properties')
    expect(denyMask.type).toBe('properties')

    if (allowMask.type === 'properties' && denyMask.type === 'properties') {
      expect(allowMask.mode).toBe('allow')
      expect(allowMask.properties).toEqual(['name', 'age'])

      expect(denyMask.mode).toBe('deny')
      expect(denyMask.properties).toEqual(['password', 'secret'])
    }
  })
})

describe('apply', () => {
  test('binary masks show/hide data', () => {
    const data = { a: 1 }

    expect(Mask.apply(data, Mask.create(true))).toBe(data)
    expect(Mask.apply(data, Mask.create(false))).toBe(undefined)
  })

  test('properties masks filter objects', () => {
    const data = { name: 'John', age: 30, password: 'secret' }

    // Allow mode
    const allowMask = Mask.create(['name', 'age'])
    expect(Mask.apply(data, allowMask)).toEqual({ name: 'John', age: 30 })

    // Deny mode
    const denyMask = Mask.create({ password: false })
    expect(Mask.apply(data, denyMask)).toEqual({ name: 'John', age: 30 })
  })

  test('properties masks throw for non-objects', () => {
    const mask = Mask.create(['name'])

    expect(() => Mask.apply('string' as any, mask)).toThrow()
    expect(() => Mask.apply(123 as any, mask)).toThrow()
    expect(() => Mask.apply(null as any, mask)).toThrow()
  })
})

describe('apply variants', () => {
  test('applyPartial allows missing properties', () => {
    const mask = Mask.create<{ name: string; age: number }>(['name', 'age'])
    const partial = { name: 'John' }

    expect(Mask.applyPartial(partial, mask)).toEqual({ name: 'John' })
    expect(Mask.applyPartial({}, mask)).toEqual({})
  })

  test('applyExact works with any data for binary masks', () => {
    const showMask = Mask.create(true)
    const hideMask = Mask.create(false)

    expect(Mask.applyExact('hello' as any, showMask)).toBe('hello')
    expect(Mask.applyExact('hello' as any, hideMask)).toBe(undefined)
  })
})

describe('semantic constructors', () => {
  test('show and hide create binary masks', () => {
    const showMask = Mask.show()
    const hideMask = Mask.hide()

    expect(showMask).toEqual({ type: 'binary', show: true })
    expect(hideMask).toEqual({ type: 'binary', show: false })
  })

  test('pick creates allow mode properties mask', () => {
    const mask = Mask.pick<{ a: number; b: string }>(['a'])

    expect(mask).toEqual({
      type: 'properties',
      mode: 'allow',
      properties: ['a'],
    })
  })

  test('omit creates deny mode properties mask', () => {
    const mask = Mask.omit<{ a: number; b: string; c: boolean }>(['b', 'c'])

    expect(mask).toEqual({
      type: 'properties',
      mode: 'deny',
      properties: ['b', 'c'],
    })
  })
})

describe('property-based tests', () => {
  test('binary masks - invariants', () => {
    fc.assert(
      fc.property(fc.anything(), (data) => {
        expect(Mask.apply(data, Mask.create(true))).toBe(data)
        expect(Mask.apply(data, Mask.create(false))).toBe(undefined)
      }),
    )
  })

  test('properties masks - allow mode preserves only specified keys', () => {
    fc.assert(
      fc.property(
        fc.dictionary(fc.string(), fc.anything()),
        fc.uniqueArray(fc.string()),
        (obj, keys) => {
          const mask = Mask.create(keys)
          const result = Mask.apply(obj as any, mask) as any

          // Result should only have keys that were both in obj and keys
          // Exclude prototype pollution keys that are filtered for security
          const dangerousKeys = ['__proto__', 'constructor', 'prototype']
          const expectedKeys = keys.filter(k => k in obj && !dangerousKeys.includes(k))
          expect(Object.keys(result).sort()).toEqual(expectedKeys.sort())

          // Values should be preserved
          expectedKeys.forEach(key => {
            expect(result[key]).toBe(obj[key])
          })
        },
      ),
    )
  })

  test('properties masks - deny mode removes only specified keys', () => {
    fc.assert(
      fc.property(
        fc.dictionary(fc.string(), fc.anything()),
        fc.uniqueArray(fc.string()),
        (obj, keysToRemove) => {
          const mask = Mask.omit(keysToRemove)
          const result = Mask.apply(obj as any, mask) as any

          // Result should have all keys except the ones to remove
          const expectedKeys = Object.keys(obj).filter(k => !keysToRemove.includes(k))
          expect(Object.keys(result).sort()).toEqual(expectedKeys.sort())

          // Values should be preserved for kept keys
          expectedKeys.forEach(key => {
            expect(result[key]).toBe(obj[key])
          })
        },
      ),
    )
  })
})
