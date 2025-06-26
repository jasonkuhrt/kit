import { describe, expect, test } from 'vitest'
import { Registry } from './$.ts'

test('Registry.create creates empty registry', () => {
  const registry = Registry.create()
  expect(registry.data).toEqual({})
})

describe('register', () => {
  test('registers implementation for trait and domain', () => {
    const registry = Registry.create()
    const impl = { is: (a: any, b: any) => a === b }

    Registry.register(registry.data, 'Eq', 'Num', impl)

    expect(registry.data).toEqual({
      Eq: {
        Num: impl,
      },
    })
  })

  test('multiple domains for same trait', () => {
    const registry = Registry.create()
    const numImpl = { is: (a: number, b: number) => a === b }
    const strImpl = { is: (a: string, b: string) => a === b }

    Registry.register(registry.data, 'Eq', 'Num', numImpl)
    Registry.register(registry.data, 'Eq', 'Str', strImpl)

    expect(registry.data).toEqual({
      Eq: {
        Num: numImpl,
        Str: strImpl,
      },
    })
  })

  test('multiple traits', () => {
    const registry = Registry.create()
    const eqImpl = { is: (a: any, b: any) => a === b }
    const ordImpl = { compare: (a: any, b: any) => a - b }

    Registry.register(registry.data, 'Eq', 'Num', eqImpl)
    Registry.register(registry.data, 'Ord', 'Num', ordImpl)

    expect(registry.data).toEqual({
      Eq: { Num: eqImpl },
      Ord: { Num: ordImpl },
    })
  })
})

describe('proxy', () => {
  test('allows registration via assignment', () => {
    const registry = Registry.create()
    const impl = { is: (a: any[], b: any[]) => a.length === b.length }

    registry.proxy.Eq.Arr = impl

    expect(registry.data).toEqual({
      Eq: {
        Arr: impl,
      },
    })
  })

  test('allows reading implementations', () => {
    const registry = Registry.create()
    const impl = { is: (a: string, b: string) => a === b }

    registry.proxy.Eq.Str = impl

    expect(registry.proxy.Eq.Str).toBe(impl)
  })

  test('returns undefined for non-existent implementations', () => {
    const registry = Registry.create()

    expect(registry.proxy.Eq.Str).toBeUndefined()
  })
})
