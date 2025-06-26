import fc from 'fast-check'
import { describe, expect, test } from 'vitest'
import { nativeToDomainOrThrow } from './domain.ts'
import type { GetDomain } from './domain.ts'

describe('nativeToDomainOrThrow', () => {
  test('maps null to Null', () => {
    expect(nativeToDomainOrThrow(null)).toBe('Null')
  })

  test('maps undefined to Undefined', () => {
    expect(nativeToDomainOrThrow(undefined)).toBe('Undefined')
  })

  test('maps booleans to Bool', () => {
    expect(nativeToDomainOrThrow(true)).toBe('Bool')
    expect(nativeToDomainOrThrow(false)).toBe('Bool')
  })

  test('maps numbers to Num', () => {
    fc.assert(
      fc.property(fc.oneof(fc.integer(), fc.float()), (n) => {
        expect(nativeToDomainOrThrow(n)).toBe('Num')
      }),
    )
  })

  test('maps strings to Str', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        expect(nativeToDomainOrThrow(s)).toBe('Str')
      }),
    )
  })

  test('maps arrays to Arr', () => {
    expect(nativeToDomainOrThrow([])).toBe('Arr')
    expect(nativeToDomainOrThrow([1, 2, 3])).toBe('Arr')
    expect(nativeToDomainOrThrow(['a', 'b'])).toBe('Arr')

    // Property test with various array types
    fc.assert(
      fc.property(fc.array(fc.anything()), (arr) => {
        expect(nativeToDomainOrThrow(arr)).toBe('Arr')
      }),
    )
  })

  test('maps objects to Obj', () => {
    expect(nativeToDomainOrThrow({})).toBe('Obj')
    expect(nativeToDomainOrThrow({ a: 1 })).toBe('Obj')
    expect(nativeToDomainOrThrow(new Date())).toBe('Obj')

    // Property test with objects
    fc.assert(
      fc.property(fc.object(), (obj) => {
        expect(nativeToDomainOrThrow(obj)).toBe('Obj')
      }),
    )
  })

  test('throws for unsupported types', () => {
    // Currently only symbol and function would throw
    expect(() => nativeToDomainOrThrow(Symbol('test'))).toThrow()
    expect(() => nativeToDomainOrThrow(() => {})).toThrow()
  })
})

test('GetDomain type-level tests', () => {
  // Type-level tests
  type TestNull = GetDomain<null>
  type TestUndefined = GetDomain<undefined>
  type TestBool = GetDomain<boolean>
  type TestNum = GetDomain<number>
  type TestStr = GetDomain<string>
  type TestArr = GetDomain<number[]>
  type TestReadonlyArr = GetDomain<readonly string[]>
  type TestObj = GetDomain<{ a: 1 }>

  // These are compile-time checks
  const _null: TestNull = 'Null'
  const _undefined: TestUndefined = 'Undefined'
  const _bool: TestBool = 'Bool'
  const _num: TestNum = 'Num'
  const _str: TestStr = 'Str'
  const _arr: TestArr = 'Arr'
  const _readonlyArr: TestReadonlyArr = 'Arr'
  const _obj: TestObj = 'Obj'

  // Runtime assertion to satisfy test runner
  expect(true).toBe(true)
})
