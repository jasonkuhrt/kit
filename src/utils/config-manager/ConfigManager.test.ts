import { Ts } from '#ts'
import { describe, expect, test } from 'vitest'
import { ConfigManager } from './$.js'

const A = Ts.Assert.exact.ofAs

test(`defaults are merged into input value`, () => {
  const defaults = { a: 1 }
  const input = {}
  const result = ConfigManager.mergeDefaults(defaults, input)
  A<{ a: number }>().on(result)
  expect(result).toEqual({ a: 1 })
})

test(`keys with undefined are ignored`, () => {
  const defaults = { a: 1 }
  const input = { a: undefined } as unknown as { a?: number }
  const result = ConfigManager.mergeDefaults(defaults, input)
  A<{ a: number }>().on(result)
  expect(result).toEqual({ a: 1 })
})

test(`input value is mutated`, () => {
  const defaults = { a: 1 }
  const input = {}
  const result = ConfigManager.mergeDefaults(defaults, input)
  expect(result).toBe(input)
})

test(`input value takes precedence`, () => {
  const defaults = { a: 1 }
  const input = { a: 2 }
  const result = ConfigManager.mergeDefaults(defaults, input)
  expect(result).toEqual({ a: 2 })
})

test(`defaults is not mutated`, () => {
  const defaults = { a: 1 }
  const input = { a: 2 }
  ConfigManager.mergeDefaults(defaults, input)
  expect(defaults).toEqual({ a: 1 })
})

test(`nested objects are merged`, () => {
  const defaults = { a: { b: 2 } }
  const input = {}
  const result = ConfigManager.mergeDefaults(defaults, input)
  A<{ a: { b: number } }>().on(result)
  expect(result).toEqual({ a: { b: 2 } })
})

test(`nested object input value takes precedence`, () => {
  const defaults = { a: { b: 2 } }
  const input = { a: { b: 3 } }
  const result = ConfigManager.mergeDefaults(defaults, input)
  A<{ a: { b: number } }>().on(result)
  expect(result).toEqual({ a: { b: 3 } })
})

test(`error if input object has non-object at expected object node`, () => {
  const defaults = { a: { b: 2 } }
  const input = { a: 1 }
  // @ts-expect-error: input is not a sub-type of defaults
  expect(() => ConfigManager.mergeDefaults(defaults, input)).toThrowErrorMatchingInlineSnapshot(
    `[Error: Mismatch between defaults and input. Defaults expect an object at this node. Input was: 1]`,
  )
})

test(`works with interface-typed values`, () => {
  interface Defaults {
    a: number
  }
  interface Input {
    a?: number
  }
  const defaults: Defaults = { a: 1 }
  const input: Input = {}
  const result = ConfigManager.mergeDefaults(defaults, input)
  A<{ a: number }>().on(result)
  expect(result).toEqual({ a: 1 })
})

test(`works with interface-typed nested-object values`, () => {
  interface Defaults {
    a: {
      b: number
    }
  }
  interface Input {
    a?: {
      b?: number
    }
  }
  const defaults: Defaults = { a: { b: 2 } }
  const input: Input = {}
  const result = ConfigManager.mergeDefaults(defaults, input)
  A<{ a: { b: number } }>().on(result)
  expect(result).toEqual({ a: { b: 2 } })
})

test(`input can be undefined, returns defaults`, () => {
  const defaults = { a: 1 }
  const result = ConfigManager.mergeDefaults(defaults, undefined)
  Ts.Assert.exact.ofAs<typeof defaults>().on(result)
  expect(result).toBe(defaults)
})

describe(`default custom scalars`, () => {
  test(`By default are dates and functions`, () => {
    const defaults = { a: new Date(0), b: () => 0 }
    const input = {}
    const result = ConfigManager.mergeDefaults(defaults, input)
    Ts.Assert.exact.ofAs<{ a: Date; b: () => number }>().on(result)
    expect(result).toEqual({ a: defaults.a, b: defaults.b })
  })
  test(`input takes precedence`, () => {
    const defaults = { a: new Date(0), b: () => 0 }
    const input = { a: new Date(1), b: () => 2 }
    const result = ConfigManager.mergeDefaults(defaults, input)
    Ts.Assert.exact.ofAs<{ a: Date; b: () => number }>().on(result)
    expect(result).toEqual({ a: input.a, b: input.b })
  })
})
