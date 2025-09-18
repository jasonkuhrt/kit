import { Obj } from '#obj'
import { Test } from '#test'
import * as fc from 'fast-check'
import { describe, expect, expectTypeOf, test } from 'vitest'

describe('Obj.entries', () => {
  describe('type-level behavior', () => {
    test('optional key has undefined removed from value type', () => {
      type OptionalKeyObj = { name?: string }
      type Entries = Obj.entries<OptionalKeyObj>

      // Optional key should not include undefined in value type
      expectTypeOf<Entries>().toMatchTypeOf<['name', string][]>()
    })

    test('required key with undefined preserves undefined in value type', () => {
      type RequiredUndefinedObj = { name: string | undefined }
      type Entries = Obj.entries<RequiredUndefinedObj>

      // Required key with undefined should preserve undefined in value type
      expectTypeOf<Entries>().toMatchTypeOf<['name', string | undefined][]>()
    })

    test('mixed optional and required keys with complex types', () => {
      type MixedObj = {
        name?: string
        age: number | undefined
        city: string
        hobbies?: string[]
      }

      type Entries = Obj.entries<MixedObj>

      // Should be union of all possible entry types
      type ExpectedEntries = (
        | [string, string] // name (optional, no undefined)
        | [string, number | undefined] // age (required, undefined preserved)
        | [string, string] // city (required, no undefined)
        | [string, string[]] // hobbies (optional, no undefined)
      )[]

      expectTypeOf<Entries>().toMatchTypeOf<ExpectedEntries>()
    })

    test('object with only optional keys', () => {
      type AllOptionalObj = {
        name?: string
        age?: number
        city?: string
      }

      type Entries = Obj.entries<AllOptionalObj>

      // All values should not include undefined since keys are optional
      type ExpectedEntries = (
        | [string, string] // name
        | [string, number] // age
        | [string, string] // city
      )[]

      expectTypeOf<Entries>().toMatchTypeOf<ExpectedEntries>()
    })

    test('object with only required keys having undefined', () => {
      type AllRequiredUndefinedObj = {
        name: string | undefined
        age: number | undefined
      }

      type Entries = Obj.entries<AllRequiredUndefinedObj>

      // All values should preserve undefined since keys are required
      type ExpectedEntries = (
        | [string, string | undefined]
        | [string, number | undefined]
      )[]

      expectTypeOf<Entries>().toMatchTypeOf<ExpectedEntries>()
    })

    test('nested object structures', () => {
      type NestedObj = {
        user?: { name: string; age?: number }
        metadata: { created: Date | undefined }
      }

      type Entries = Obj.entries<NestedObj>

      type ExpectedEntries = (
        | [string, { name: string; age?: number }] // user (optional key, no undefined)
        | [string, { created: Date | undefined }] // metadata (required key, preserve type)
      )[]

      expectTypeOf<Entries>().toMatchTypeOf<ExpectedEntries>()
    })

    test('complex value types with optional vs required distinction', () => {
      type ComplexObj = {
        requiredArray: string[] | undefined
        optionalArray?: string[]
        requiredObject: { x: number } | undefined
        optionalObject?: { x: number }
        requiredFunction: (() => void) | undefined
        optionalFunction?: () => void
      }

      type Entries = Obj.entries<ComplexObj>

      type ExpectedEntries = (
        | [string, string[] | undefined] // requiredArray (required, undefined preserved)
        | [string, string[]] // optionalArray (optional, undefined removed)
        | [string, { x: number } | undefined] // requiredObject (required, undefined preserved)
        | [string, { x: number }] // optionalObject (optional, undefined removed)
        | [string, (() => void) | undefined] // requiredFunction (required, undefined preserved)
        | [string, () => void] // optionalFunction (optional, undefined removed)
      )[]

      expectTypeOf<Entries>().toMatchTypeOf<ExpectedEntries>()
    })

    test('empty object', () => {
      type EmptyObj = {}
      type Entries = Obj.entries<EmptyObj>

      expectTypeOf<Entries>().toMatchTypeOf<never[]>()
    })

    test('object with readonly properties', () => {
      type ReadonlyObj = {
        readonly name?: string
        readonly age: number | undefined
      }

      type Entries = Obj.entries<ReadonlyObj>

      type ExpectedEntries = (
        | [string, string] // name (optional, undefined removed)
        | [string, number | undefined] // age (required, undefined preserved)
      )[]

      expectTypeOf<Entries>().toMatchTypeOf<ExpectedEntries>()
    })

    test('fixed: ExcludeUndefined preserves null for optional keys', () => {
      type OptionalWithNull = {
        value?: string | null
      }

      type Entries = Obj.entries<OptionalWithNull>

      // FIXED: Now using ExcludeUndefined instead of NonNullable
      // ExcludeUndefined<string | null | undefined> = string | null (correct)
      // NonNullable<string | null | undefined> = string (incorrect)

      // This should now correctly preserve null for optional keys
      expectTypeOf<Entries>().toMatchTypeOf<['value', string | null][]>()
    })

    test('required key with null should preserve null', () => {
      type RequiredWithNull = {
        value: string | null
      }

      type Entries = Obj.entries<RequiredWithNull>

      // Required keys should preserve null correctly
      expectTypeOf<Entries>().toMatchTypeOf<['value', string | null][]>()
    })

    test('demonstrate correct behavior: only undefined removed from optional keys', () => {
      type TestCases = {
        optionalWithNull?: string | null
        optionalWithUndefined?: string | undefined
        optionalWithBoth?: string | null | undefined
        requiredWithNull: string | null
        requiredWithUndefined: string | undefined
        requiredWithBoth: string | null | undefined
      }

      type Entries = Obj.entries<TestCases>

      // Optional keys should remove undefined but preserve null
      type ExpectedEntries = (
        | ['optionalWithNull', string | null] // null preserved
        | ['optionalWithUndefined', string] // undefined removed
        | ['optionalWithBoth', string | null] // undefined removed, null preserved
        | ['requiredWithNull', string | null] // null preserved
        | ['requiredWithUndefined', string | undefined] // undefined preserved
        | ['requiredWithBoth', string | null | undefined] // both preserved
      )[]

      expectTypeOf<Entries>().toMatchTypeOf<ExpectedEntries>()
    })
  })
})

describe('policyFilter', () => {
  // dprint-ignore
  const policyFilterCases: Test.Table.Case<{
    mode: 'allow' | 'deny'
    keys: string[]
    expected: Record<string, any>
  }>[] = [
    { name: 'allow mode picks specified keys',      mode: 'allow', keys: ['a', 'c'], expected: { a: 1, c: 3 } },
    { name: 'allow mode with empty keys',           mode: 'allow', keys: [],         expected: {} },
    { name: 'allow mode with non-existent key',     mode: 'allow', keys: ['a', 'z'], expected: { a: 1 } },
    { name: 'deny mode omits specified keys',       mode: 'deny',  keys: ['a', 'c'], expected: { b: 2, d: 4 } },
    { name: 'deny mode with empty keys',            mode: 'deny',  keys: [],         expected: { a: 1, b: 2, c: 3, d: 4 } },
    { name: 'deny mode with non-existent key',      mode: 'deny',  keys: ['z'],      expected: { a: 1, b: 2, c: 3, d: 4 } },
  ]

  const testObj = { a: 1, b: 2, c: 3, d: 4 }

  Test.Table.each(policyFilterCases, (case_) => {
    expect(Obj.policyFilter(case_.mode, testObj, case_.keys as any)).toEqual(case_.expected)
  })

  test('preserves undefined values', () => {
    const obj = { a: 1, b: undefined, c: 3 }
    expect(Obj.policyFilter('allow', obj, ['a', 'b'])).toEqual({ a: 1, b: undefined })
  })
})

describe('filter', () => {
  // dprint-ignore
  const filterCases: Test.Table.Case<{
    testType: 'byValue' | 'byKey' | 'byContext' | 'allFalse' | 'allTrue' | 'emptyObj'
    expected: Record<string, any>
  }>[] = [
    { name: 'filters by value predicate',      testType: 'byValue',   expected: { c: 3, d: 4 } },
    { name: 'filters by key predicate',        testType: 'byKey',     expected: { a: 1, c: 3 } },
    { name: 'filters by full context',         testType: 'byContext', expected: { a: 1, b: 2 } },
    { name: 'returns empty when all false',    testType: 'allFalse',  expected: {} },
    { name: 'returns all when all true',       testType: 'allTrue',   expected: { a: 1, b: 2, c: 3, d: 4 } },
    { name: 'handles empty object',            testType: 'emptyObj',  expected: {} },
  ]

  const testObj = { a: 1, b: 2, c: 3, d: 4 }

  Test.Table.each(filterCases, (case_) => {
    let result: any
    switch (case_.testType) {
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
    expect(result).toEqual(case_.expected)
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

describe('spreadShallow', () => {
  // dprint-ignore
  const spreadShallowCases: Test.Table.Case<{
    objects?: any[]
    expected: Record<string, any>
  }>[] = [
    { name: 'merges objects while omitting undefined values', objects: [{ a: 1, b: 2, c: 3 }, { a: 1, b: undefined, c: 4, d: 5 }],                                           expected: { a: 1, b: 2, c: 4, d: 5 } },
    { name: 'handles multiple objects',                       objects: [{ a: 1, b: 2 }, { a: 1, b: undefined, c: 3 }, { a: 1, b: 2, c: undefined, d: 4 }],                   expected: { a: 1, b: 2, c: 3, d: 4 } },
    { name: 'handles empty objects',                          objects: [{}, {}],                                                                                              expected: {} },
    { name: 'merges empty with non-empty',                    objects: [{ a: 1 }, {}],                                                                                        expected: { a: 1 } },
    { name: 'merges non-empty with empty',                    objects: [{}, { a: 1 }],                                                                                        expected: { a: 1 } },
    { name: 'handles single object',                          objects: [{ a: 1, b: undefined, c: 3 }],                                                                        expected: { a: 1, c: 3 } },
    { name: 'handles no objects',                             objects: [],                                                                                                     expected: {} },
    { name: 'handles undefined objects in middle',            objects: [undefined, { a: 1, b: 2 }, undefined],                                                               expected: { a: 1, b: 2 } },
    { name: 'handles undefined at end',                       objects: [{ a: 1, b: 2 }, undefined],                                                                          expected: { a: 1, b: 2 } },
    { name: 'handles all undefined',                          objects: [undefined, undefined],                                                                               expected: {} },
    { name: 'preserves null values',                          objects: [{ a: 1, b: null }, { a: 1, b: 2, c: null }],                                                         expected: { a: 1, b: 2, c: null } },
    { name: 'preserves false and 0 values',                   objects: [{ a: true, b: 1 }, { a: false, b: 0 }],                                                              expected: { a: false, b: 0 } },
  ]

  Test.Table.each(spreadShallowCases, (case_) => {
    const result = Obj.spreadShallow<any>(...(case_.objects || []))
    expect(result).toEqual(case_.expected)
  })

  test('property-based: never includes undefined values', () => {
    fc.assert(
      fc.property(
        fc.array(fc.dictionary(fc.string(), fc.option(fc.anything()))),
        (objects) => {
          const result = Obj.spreadShallow(...objects)
          Object.values(result).forEach(value => {
            expect(value).not.toBe(undefined)
          })
        },
      ),
    )
  })

  test('property-based: later objects override earlier ones', () => {
    fc.assert(
      fc.property(
        fc.object(),
        fc.object(),
        fc.string().filter(k => k !== '__proto__' && k !== 'constructor' && k !== 'prototype'),
        fc.anything().filter(v => v !== undefined),
        (obj1, obj2, key, value) => {
          // Set the same key in both objects
          obj1[key] = 'first'
          obj2[key] = value

          const result = Obj.spreadShallow(obj1, obj2)
          expect(result[key]).toBe(value)
        },
      ),
    )
  })

  test('protects against prototype pollution', () => {
    // Test __proto__ pollution attempt
    const maliciousObj = { '__proto__': { polluted: true } } as any
    const normalObj = { safe: 'value' }

    const result = Obj.spreadShallow(normalObj, maliciousObj)

    // The result should not have __proto__ key
    expect(Object.prototype.hasOwnProperty.call(result, '__proto__')).toBe(false)

    // The Object prototype should not be polluted
    expect((Object.prototype as any).polluted).toBeUndefined()

    // Test constructor pollution attempt
    const constructorObj = { constructor: { polluted: true } } as any
    const result2 = Obj.spreadShallow(normalObj, constructorObj)
    expect(Object.prototype.hasOwnProperty.call(result2, 'constructor')).toBe(false)

    // Test prototype pollution attempt
    const prototypeObj = { prototype: { polluted: true } } as any
    const result3 = Obj.spreadShallow(normalObj, prototypeObj)
    expect(Object.prototype.hasOwnProperty.call(result3, 'prototype')).toBe(false)
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
