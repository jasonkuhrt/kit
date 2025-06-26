import { describe, expect, test } from 'vitest'
import { Ref } from './$.ts'

describe('Ref', () => {
  test('is/isnt are inverses', () => {
    const obj1 = { a: 1 }
    const obj2 = { a: 1 }
    const arr1 = [1, 2, 3]
    const fn1 = () => {}

    // Same reference
    expect(Ref.is(obj1, obj1)).toBe(true)
    expect(Ref.isnt(obj1, obj1)).toBe(false)

    // Different references
    expect(Ref.is(obj1, obj2)).toBe(false)
    expect(Ref.isnt(obj1, obj2)).toBe(true)

    // Arrays
    expect(Ref.is(arr1, arr1)).toBe(true)
    expect(Ref.isnt(arr1, arr1)).toBe(false)

    // Functions
    expect(Ref.is(fn1, fn1)).toBe(true)
    expect(Ref.isnt(fn1, fn1)).toBe(false)
  })

  test('isOn/isntOn are curried versions', () => {
    const obj = { id: 1 }
    const other = { id: 1 }

    const isSameObj = Ref.isOn(obj)
    const isNotSameObj = Ref.isntOn(obj)

    expect(isSameObj(obj)).toBe(true)
    expect(isSameObj(other)).toBe(false)

    expect(isNotSameObj(obj)).toBe(false)
    expect(isNotSameObj(other)).toBe(true)
  })

  test('isReferenceEquality/isValueEquality correctly identify types', () => {
    // Reference types
    expect(Ref.isReferenceEquality({})).toBe(true)
    expect(Ref.isReferenceEquality([])).toBe(true)
    expect(Ref.isReferenceEquality(() => {})).toBe(true)
    expect(Ref.isReferenceEquality(new Date())).toBe(true)

    // Primitive types
    expect(Ref.isReferenceEquality('hello')).toBe(false)
    expect(Ref.isReferenceEquality(42)).toBe(false)
    expect(Ref.isReferenceEquality(true)).toBe(false)
    expect(Ref.isReferenceEquality(null)).toBe(false)
    expect(Ref.isReferenceEquality(undefined)).toBe(false)
    expect(Ref.isReferenceEquality(Symbol('test'))).toBe(false)
    expect(Ref.isReferenceEquality(42n)).toBe(false)

    // isValueEquality should be inverse
    expect(Ref.isValueEquality({})).toBe(false)
    expect(Ref.isValueEquality('hello')).toBe(true)
    expect(Ref.isValueEquality(42)).toBe(true)
    expect(Ref.isValueEquality(null)).toBe(true)
  })
})
