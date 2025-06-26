import { Obj } from '#obj'
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
  const testObj = { a: 1, b: 2, c: 3, d: 4 }

  test('allow mode picks specified keys', () => {
    expect(Obj.policyFilter('allow', testObj, ['a', 'c'])).toEqual({ a: 1, c: 3 })
    expect(Obj.policyFilter('allow', testObj, [])).toEqual({})
    expect(Obj.policyFilter('allow', testObj, ['a', 'z'] as any)).toEqual({ a: 1 })
  })

  test('deny mode omits specified keys', () => {
    expect(Obj.policyFilter('deny', testObj, ['a', 'c'])).toEqual({ b: 2, d: 4 })
    expect(Obj.policyFilter('deny', testObj, [])).toEqual(testObj)
    expect(Obj.policyFilter('deny', testObj, ['z'] as any)).toEqual(testObj)
  })

  test('preserves undefined values', () => {
    const obj = { a: 1, b: undefined, c: 3 }
    expect(Obj.policyFilter('allow', obj, ['a', 'b'])).toEqual({ a: 1, b: undefined })
  })
})

describe('filter', () => {
  const testObj = { a: 1, b: 2, c: 3, d: 4 }

  test('filters by predicates', () => {
    // By value
    expect(Obj.filter(testObj, (k, v) => v > 2)).toEqual({ c: 3, d: 4 })

    // By key
    expect(Obj.filter(testObj, k => k === 'a' || k === 'c')).toEqual({ a: 1, c: 3 })

    // By full object context
    expect(Obj.filter(testObj, (k, v, obj) => {
      const avg = Object.values(obj).reduce((a, b) => a + b, 0) / Object.keys(obj).length
      return v < avg
    })).toEqual({ a: 1, b: 2 })
  })

  test('edge cases', () => {
    expect(Obj.filter(testObj, () => false)).toEqual({})
    expect(Obj.filter(testObj, () => true)).toEqual(testObj)
    expect(Obj.filter({}, () => true)).toEqual({})
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
