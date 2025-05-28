import { Err } from '#err/index.js'
import { describe, expect, expectTypeOf, test } from 'vitest'

const e = new Error('test error')
const v = 1

const fn = (throwValue?: unknown) => () => {
  if (throwValue) throw throwValue
  return v
}

const fnAsync = (throwValue?: unknown) => async () => {
  if (throwValue) throw throwValue
  return v
}

describe('sync', () => {
  test('tryOrCatch returns thrown error', () => {
    const tc = Err.tryCatch(fn(e))
    expectTypeOf(tc).toEqualTypeOf<number | Error>()
    expect(tc).toBe(e)
  })

  test('tryOrCatch returns returned value', () => {
    expect(Err.tryCatch(fn())).toBe(v)
  })
})

describe('async', () => {
  test('tryOrCatch returns thrown error', async () => {
    const tc = Err.tryCatch(fnAsync(e))
    expectTypeOf(tc).toEqualTypeOf<Promise<number | Error>>()
    await expect(tc).resolves.toBe(e)
  })

  test('tryOrCatch returns returned value', async () => {
    await expect(Err.tryCatch(fnAsync())).resolves.toBe(v)
  })
})
