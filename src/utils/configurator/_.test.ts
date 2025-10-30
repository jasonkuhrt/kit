import { expect, test } from 'vitest'
import { Configurator } from './$.ts'

test(`if input resolver returns null, reference to current is returned`, () => {
  const c = Configurator.create().input().inputResolver(() => null).return()
  const current = {}
  expect(c.inputResolver({ current, input: {} })).toBe(current)
})

test(`standard input resolver filters out undefined values from input`, () => {
  const c = Configurator.create().input().default({ a: 1, b: 2 }).return()
  const result = c.inputResolver({
    current: { a: 1, b: 2 },
    input: { a: undefined, b: 3, c: undefined },
  })
  expect(result).toEqual({ a: 1, b: 3 })
})
