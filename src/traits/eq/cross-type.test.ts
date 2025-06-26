import { Arr } from '#arr'
import { Obj } from '#obj'
import { Str } from '#str'
import { describe, expect, test } from 'vitest'

describe('Eq cross-type comparisons', () => {
  test('string vs non-string', () => {
    expect(Str.Eq.is('hello', 123 as any)).toBe(false)
    expect(Str.Eq.is('hello', [] as any)).toBe(false)
    expect(Str.Eq.is('hello', {} as any)).toBe(false)
    expect(Str.Eq.is('hello', null as any)).toBe(false)
    expect(Str.Eq.is('hello', undefined as any)).toBe(false)
  })

  test('array vs non-array', () => {
    expect(Arr.Eq.is([1, 2], 'hello' as any)).toBe(false)
    expect(Arr.Eq.is([1, 2], 123 as any)).toBe(false)
    expect(Arr.Eq.is([1, 2], {} as any)).toBe(false)
    expect(Arr.Eq.is([1, 2], null as any)).toBe(false)
  })

  test('object vs non-object', () => {
    expect(Obj.Eq.is({ a: 1 }, 'hello' as any)).toBe(false)
    expect(Obj.Eq.is({ a: 1 }, 123 as any)).toBe(false)
    expect(Obj.Eq.is({ a: 1 }, [1, 2] as any)).toBe(false)
    expect(Obj.Eq.is({ a: 1 }, null as any)).toBe(false)
  })

  test('curried cross-type comparisons', () => {
    const isHello = Str.Eq.isOn('hello')
    expect(isHello(123 as any)).toBe(false)
    expect(isHello([] as any)).toBe(false)

    const isArray = Arr.Eq.isOn([1, 2])
    expect(isArray('hello' as any)).toBe(false)
    expect(isArray({} as any)).toBe(false)
  })
})
