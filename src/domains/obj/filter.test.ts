import { Obj } from '#obj'
import { Test } from '#test'
import * as fc from 'fast-check'
import { describe, expect, test } from 'vitest'

describe('policyFilter', () => {
  const testObj = { a: 1, b: 2, c: 3, d: 4 }

  // dprint-ignore
  Test.describe('policyFilter')
    .inputType<{ mode: 'allow' | 'deny'; keys: string[] }>()
    .outputType<Record<string, any>>()
    .cases(
      ['allow mode picks specified keys',      [{ mode: 'allow', keys: ['a', 'c'] }], { a: 1, c: 3 }],
      ['allow mode with empty keys',           [{ mode: 'allow', keys: [] }],         {}],
      ['allow mode with non-existent key',     [{ mode: 'allow', keys: ['a', 'z'] }], { a: 1 }],
      ['deny mode omits specified keys',       [{ mode: 'deny',  keys: ['a', 'c'] }], { b: 2, d: 4 }],
      ['deny mode with empty keys',            [{ mode: 'deny',  keys: [] }],         { a: 1, b: 2, c: 3, d: 4 }],
      ['deny mode with non-existent key',      [{ mode: 'deny',  keys: ['z'] }],      { a: 1, b: 2, c: 3, d: 4 }],
    )
    .test((i, o) => {
      expect(Obj.policyFilter(i.mode, testObj, i.keys as any)).toEqual(o)
    })

  test('preserves undefined values', () => {
    const obj = { a: 1, b: undefined, c: 3 }
    expect(Obj.policyFilter('allow', obj, ['a', 'b'])).toEqual({ a: 1, b: undefined })
  })
})

describe('filter', () => {
  const testObj = { a: 1, b: 2, c: 3, d: 4 }

  // dprint-ignore
  Test.describe('filter')
    .inputType<{ testType: 'byValue' | 'byKey' | 'byContext' | 'allFalse' | 'allTrue' | 'emptyObj' }>()
    .outputType<Record<string, any>>()
    .cases(
      ['filters by value predicate',      [{ testType: 'byValue' }],   { c: 3, d: 4 }],
      ['filters by key predicate',        [{ testType: 'byKey' }],     { a: 1, c: 3 }],
      ['filters by full context',         [{ testType: 'byContext' }], { a: 1, b: 2 }],
      ['returns empty when all false',    [{ testType: 'allFalse' }],  {}],
      ['returns all when all true',       [{ testType: 'allTrue' }],   { a: 1, b: 2, c: 3, d: 4 }],
      ['handles empty object',            [{ testType: 'emptyObj' }],  {}],
    )
    .test((i, o) => {
      let result: any
      switch (i.testType) {
        case 'byValue':
          result = Obj.filter(testObj, (k, v) => v > 2)
          break
        case 'byKey':
          result = Obj.filter(testObj, k => k === 'a' || k === 'c')
          break
        case 'byContext':
          result = Obj.filter(testObj, (k, v, obj) => {
            const avg = Object.values(obj).reduce((a, b) => a + b, 0) / Object.keys(obj).length
            return v < avg
          })
          break
        case 'allFalse':
          result = Obj.filter(testObj, () => false)
          break
        case 'allTrue':
          result = Obj.filter(testObj, () => true)
          break
        case 'emptyObj':
          result = Obj.filter({}, () => true)
          break
      }
      expect(result).toEqual(o)
    })
})

describe('partition', () => {
  test('partitions object into picked and omitted', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 }
    const result = Obj.partition(obj, ['a', 'c'])

    expect(result.picked).toEqual({ a: 1, c: 3 })
    expect(result.omitted).toEqual({ b: 2, d: 4 })
  })

  test('handles empty keys', () => {
    const obj = { a: 1, b: 2 }
    const result = Obj.partition(obj, [])

    expect(result.picked).toEqual({})
    expect(result.omitted).toEqual(obj)
  })

  test('handles non-existent keys', () => {
    const obj = { a: 1, b: 2 }
    const result = Obj.partition(obj, ['a', 'z'] as any)

    expect(result.picked).toEqual({ a: 1 })
    expect(result.omitted).toEqual({ b: 2 })
  })
})

describe('property-based tests', () => {
  test('policyFilter allow/deny are complementary', () => {
    fc.assert(
      fc.property(
        fc.dictionary(fc.string(), fc.anything()),
        fc.array(fc.string()),
        (obj, keys) => {
          // Filter out prototype pollution keys
          const safeObj = Object.fromEntries(
            Object.entries(obj).filter(([k]) =>
              ![
                '__proto__',
                'constructor',
                'prototype',
                'valueOf',
                'toString',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'toLocaleString',
              ].includes(k)
            ),
          )
          const safeKeys = keys.filter(k =>
            ![
              '__proto__',
              'constructor',
              'prototype',
              'valueOf',
              'toString',
              'hasOwnProperty',
              'isPrototypeOf',
              'propertyIsEnumerable',
              'toLocaleString',
            ].includes(k)
          )

          const allowed = Obj.policyFilter('allow', safeObj, safeKeys)
          const denied = Obj.policyFilter('deny', safeObj, safeKeys)

          // Every own key in obj is either in allowed or denied, never both
          Object.keys(safeObj).forEach(key => {
            const inAllowed = Object.prototype.hasOwnProperty.call(allowed, key)
            const inDenied = Object.prototype.hasOwnProperty.call(denied, key)
            expect(inAllowed).toBe(!inDenied)
          })

          // Combined they reconstruct the original object
          expect({ ...allowed, ...denied }).toEqual(safeObj)
        },
      ),
    )
  })

  test('filter preserves values unchanged', () => {
    fc.assert(
      fc.property(
        fc.dictionary(fc.string(), fc.anything()),
        (obj) => {
          // Filter out prototype pollution keys
          const safeObj = Object.fromEntries(
            Object.entries(obj).filter(([k]) => !['__proto__', 'constructor', 'prototype'].includes(k)),
          )

          const filtered = Obj.filter(safeObj, () => true)
          expect(filtered).toEqual(safeObj)

          // Values are the same reference
          Object.keys(filtered).forEach(key => {
            expect(filtered[key]).toBe(safeObj[key])
          })
        },
      ),
    )
  })

  test('policyFilter is immutable', () => {
    fc.assert(
      fc.property(
        fc.dictionary(fc.string(), fc.anything()),
        fc.array(fc.string()),
        fc.oneof(fc.constant('allow' as const), fc.constant('deny' as const)),
        (obj, keys, mode) => {
          const original = { ...obj }
          Obj.policyFilter(mode, obj, keys)
          expect(obj).toEqual(original)
        },
      ),
    )
  })

  test('empty keys behavior', () => {
    fc.assert(
      fc.property(
        fc.dictionary(fc.string(), fc.anything()),
        (obj) => {
          expect(Obj.policyFilter('allow', obj, [])).toEqual({})
          expect(Obj.policyFilter('deny', obj, [])).toEqual(obj)
        },
      ),
    )
  })
})
