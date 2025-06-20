import { property } from '#test/test'
import fc from 'fast-check'
import { expect, test } from 'vitest'
import { Cache } from './$.ts'

property('memoize caches results by JSON key', fc.array(fc.tuple(fc.integer(), fc.integer())), (pairs) => {
  let callCount = 0
  const add = (a: number, b: number) => {
    callCount++
    return a + b
  }
  const memoized = Cache.memoize(add)

  pairs.forEach(([a, b]) => memoized(a, b))
  const uniquePairs = new Set(pairs.map(([a, b]) => JSON.stringify([a, b]))).size
  expect(callCount).toBe(uniquePairs)
})

test('memoize with custom key function', () => {
  let callCount = 0
  const fn = (user: { id: string; name: string }) => {
    callCount++
    return user.name
  }
  const memoized = Cache.memoize(fn, ([user]) => user.id)

  expect(memoized({ id: '1', name: 'Alice' })).toBe('Alice')
  expect(memoized({ id: '1', name: 'Bob' })).toBe('Alice') // cached by id
  expect(callCount).toBe(1)
})

test('memoize with null key uses reference', () => {
  let callCount = 0
  const fn = (obj: any) => {
    callCount++
    return obj
  }
  const memoized = Cache.memoize(fn, null)

  const obj = { a: 1 }
  memoized(obj)
  memoized(obj) // new args array each time
  expect(callCount).toBe(2)
})

property('memoize caches function calls', fc.array(fc.anything()), (values) => {
  let callCount = 0
  const fn = (input: unknown) => {
    callCount++
    return { input, id: callCount }
  }

  const memoized = Cache.memoize(fn)

  // First calls
  const firstResults = values.map(v => memoized(v))
  const uniqueInputs = new Set(values.map(v => JSON.stringify([v]))).size
  expect(callCount).toBe(uniqueInputs)

  // Second calls should return cached results
  const secondResults = values.map(v => memoized(v))
  expect(callCount).toBe(uniqueInputs) // No new calls

  // Results should be identical (same object references)
  firstResults.forEach((result, i) => {
    expect(secondResults[i]).toBe(result)
  })
})

test('memoize handles async functions', async () => {
  let callCount = 0
  const async = async (x: number) => {
    callCount++
    return x * 2
  }
  const memoized = Cache.memoize(async)

  expect(await memoized(5)).toBe(10)
  expect(await memoized(5)).toBe(10)
  expect(callCount).toBe(1)
})

test('memoize does not cache undefined', () => {
  let callCount = 0
  const fn = (x: boolean) => {
    callCount++
    return x ? 'value' : undefined
  }
  const memoized = Cache.memoize(fn)

  memoized(false)
  memoized(false) // not cached
  expect(callCount).toBe(2)

  memoized(true)
  memoized(true) // cached
  expect(callCount).toBe(3)
})
