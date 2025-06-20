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

test('memoize caches undefined values', () => {
  let callCount = 0
  const fn = (x: boolean) => {
    callCount++
    return x ? 'value' : undefined
  }
  const memoized = Cache.memoize(fn)

  expect(memoized(false)).toBe(undefined)
  expect(callCount).toBe(1)

  expect(memoized(false)).toBe(undefined) // cached
  expect(callCount).toBe(1) // not called again

  expect(memoized(true)).toBe('value')
  expect(callCount).toBe(2)

  expect(memoized(true)).toBe('value') // cached
  expect(callCount).toBe(2) // not called again
})

test('memoize never caches thrown errors', () => {
  let callCount = 0
  const fn = (shouldThrow: boolean) => {
    callCount++
    if (shouldThrow) throw new Error('Test error')
    return 'success'
  }
  const memoized = Cache.memoize(fn)

  // First call throws
  expect(() => memoized(true)).toThrow('Test error')
  expect(callCount).toBe(1)

  // Second call should execute again (thrown errors never cached)
  expect(() => memoized(true)).toThrow('Test error')
  expect(callCount).toBe(2)

  // Success values are cached
  expect(memoized(false)).toBe('success')
  expect(memoized(false)).toBe('success')
  expect(callCount).toBe(3)
})

test('memoize caches returned errors when cacheErrors is true', () => {
  let callCount = 0
  const fn = (shouldReturnError: boolean) => {
    callCount++
    if (shouldReturnError) return new Error(`Returned error ${callCount}`)
    return 'success'
  }
  const memoized = Cache.memoize(fn, { cacheErrors: true })

  // First call returns error
  const result1 = memoized(true)
  expect(result1).toBeInstanceOf(Error)
  expect((result1 as Error).message).toBe('Returned error 1')
  expect(callCount).toBe(1)

  // Second call returns cached error (not executed again)
  const result2 = memoized(true)
  expect(result2).toBe(result1) // Same instance
  expect(callCount).toBe(1)

  // Without cacheErrors, returned errors are not cached
  const memoized2 = Cache.memoize(fn)
  const result3 = memoized2(true)
  expect(result3).toBeInstanceOf(Error)
  const result4 = memoized2(true)
  expect(result4).toBeInstanceOf(Error)
  expect(result4).not.toBe(result3) // Different instances
})

test('memoize with shared cache', () => {
  const sharedCache = new Map<unknown, unknown>()
  let callCount1 = 0
  let callCount2 = 0

  const fn1 = (x: number) => {
    callCount1++
    return x * 2
  }
  const fn2 = (x: number) => {
    callCount2++
    return x * 3
  }

  const memoized1 = Cache.memoize(fn1, { cache: sharedCache })
  const memoized2 = Cache.memoize(fn2, { cache: sharedCache })

  // Call fn1 with 5
  expect(memoized1(5)).toBe(10)
  expect(callCount1).toBe(1)
  expect(sharedCache.size).toBe(1)

  // Call fn2 with 7
  expect(memoized2(7)).toBe(21)
  expect(callCount2).toBe(1)
  expect(sharedCache.size).toBe(2)

  // Both use the same cache
  expect(memoized1(5)).toBe(10)
  expect(memoized2(7)).toBe(21)
  expect(callCount1).toBe(1)
  expect(callCount2).toBe(1)
})

test('memoize cache management methods', () => {
  let callCount = 0
  const fn = (x: number) => {
    callCount++
    return x * 2
  }
  const memoized = Cache.memoize(fn)

  // Initial calls
  expect(memoized(5)).toBe(10)
  expect(memoized(7)).toBe(14)
  expect(callCount).toBe(2)

  // Cached calls
  expect(memoized(5)).toBe(10)
  expect(memoized(7)).toBe(14)
  expect(callCount).toBe(2)

  // Clear specific key
  memoized.cache.clearKey(JSON.stringify([5]))
  expect(memoized(5)).toBe(10) // Re-executed
  expect(callCount).toBe(3)
  expect(memoized(7)).toBe(14) // Still cached
  expect(callCount).toBe(3)

  // Clear all
  memoized.cache.clear()
  expect(memoized(5)).toBe(10) // Re-executed
  expect(memoized(7)).toBe(14) // Re-executed
  expect(callCount).toBe(5)
})

test('memoize async functions never cache thrown errors', async () => {
  let callCount = 0
  const fn = async (shouldReject: boolean) => {
    callCount++
    if (shouldReject) throw new Error('Async error')
    return 'success'
  }

  // Even with cacheErrors: true, thrown errors are not cached
  const memoized = Cache.memoize(fn, { cacheErrors: true })
  await expect(memoized(true)).rejects.toThrow('Async error')
  await expect(memoized(true)).rejects.toThrow('Async error')
  expect(callCount).toBe(2) // Function executed twice

  // Success values are cached
  expect(await memoized(false)).toBe('success')
  expect(await memoized(false)).toBe('success')
  expect(callCount).toBe(3)
})

test('memoize async functions cache returned errors when cacheErrors is true', async () => {
  let callCount = 0
  const fn = async (shouldReturnError: boolean) => {
    callCount++
    if (shouldReturnError) return new Error(`Async returned error ${callCount}`)
    return 'success'
  }

  const memoized = Cache.memoize(fn, { cacheErrors: true })

  // First call returns error
  const result1 = await memoized(true)
  expect(result1).toBeInstanceOf(Error)
  expect((result1 as Error).message).toBe('Async returned error 1')
  expect(callCount).toBe(1)

  // Second call returns cached error
  const result2 = await memoized(true)
  expect(result2).toBe(result1) // Same instance
  expect(callCount).toBe(1)
})

test('memoize caches async undefined values', async () => {
  let callCount = 0
  const fn = async (x: boolean) => {
    callCount++
    return x ? 'value' : undefined
  }
  const memoized = Cache.memoize(fn)

  expect(await memoized(false)).toBe(undefined)
  expect(callCount).toBe(1)

  expect(await memoized(false)).toBe(undefined) // cached
  expect(callCount).toBe(1) // not called again

  expect(await memoized(true)).toBe('value')
  expect(callCount).toBe(2)

  expect(await memoized(true)).toBe('value') // cached
  expect(callCount).toBe(2) // not called again
})
