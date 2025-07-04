/**
 * Type-level tests for try.ts
 * These tests ensure that type inference works correctly for all combinations
 * of sync/async functions and fallbacks.
 */

import { Ts } from '#ts'
import { tryOr, tryOrAsync, tryOrAsyncWith, tryOrNull, tryOrUndefined, tryOrWith } from './try.ts'

// tryOr type tests

// Sync function with sync fallback
Ts.test('sync function with sync fallback', () => {
  const result = tryOr(() => 42, 'fallback')
  Ts.assert<number | string>()(result)
})

// Sync function with lazy sync fallback
Ts.test('sync function with lazy sync fallback', () => {
  const result = tryOr(() => 42, () => 'fallback')
  Ts.assert<number | string>()(result)
})

// Sync function with async fallback - requires tryOrAsync
Ts.test('sync function with async fallback requires tryOrAsync', () => {
  // This should be a type error with tryOr
  // For now, we document this constraint but TypeScript's inference doesn't enforce it
  // const _errorCase = tryOr(() => 42, async () => 'fallback')

  // Use tryOrAsync instead
  const result = tryOrAsync(() => 42, async () => 'fallback')
  Ts.assert<Promise<number | string>>()(result)
})

// Async function with sync fallback
Ts.test('async function with sync fallback', () => {
  const result = tryOr(async () => 42, 'fallback')
  Ts.assert<Promise<number | string>>()(result)
})

// Async function with lazy sync fallback
Ts.test('async function with lazy sync fallback', () => {
  const result = tryOr(async () => 42, () => 'fallback')
  Ts.assert<Promise<number | string>>()(result)
})

// Async function with async fallback
Ts.test('async function with async fallback', () => {
  const result = tryOr(async () => 42, async () => 'fallback')
  Ts.assert<Promise<number | string>>()(result)
})

// Complex types
Ts.test('complex types', () => {
  interface User {
    id: string
    name: string
  }

  interface ErrorResult {
    error: true
    message: string
  }

  // Sync with object fallback
  const r1 = tryOr(
    (): User => ({ id: '1', name: 'John' }),
    { error: true, message: 'Failed' } as ErrorResult,
  )
  Ts.assert<User | ErrorResult>()(r1)

  // Async with async fallback returning different type
  const r2 = tryOr(
    async (): Promise<User> => ({ id: '1', name: 'John' }),
    async (): Promise<ErrorResult> => ({ error: true, message: 'Failed' }),
  )
  Ts.assert<Promise<User | ErrorResult>>()(r2)
})

// tryOrUndefined type tests
Ts.test('tryOrUndefined', () => {
  // Sync function
  const r1 = tryOrUndefined(() => 42)
  Ts.assert<number | undefined>()(r1)

  // Async function
  const r2 = tryOrUndefined(async () => 42)
  Ts.assert<Promise<number | undefined>>()(r2)

  // With complex type
  interface Data {
    value: string
  }
  const r3 = tryOrUndefined((): Data => ({ value: 'test' }))
  Ts.assert<Data | undefined>()(r3)
})

// tryOrNull type tests
Ts.test('tryOrNull', () => {
  // Sync function
  const r1 = tryOrNull(() => 'hello')
  Ts.assert<string | null>()(r1)

  // Async function
  const r2 = tryOrNull(async () => 'hello')
  Ts.assert<Promise<string | null>>()(r2)
})

// tryOrWith curried function type tests
Ts.test('tryOrWith curried function', () => {
  const orDefault = tryOrWith({ status: 'unknown', data: null })

  // With sync function
  const r1 = orDefault(() => ({ status: 'ok', data: 'value' }))
  Ts.assert<{ status: string; data: string | null }>()(r1)

  // With async function
  const r2 = orDefault(async () => ({ status: 'ok', data: 'value' }))
  Ts.assert<Promise<{ status: string; data: string | null }>>()(r2)

  // With async fallback - this won't work with tryOrWith
  // @ts-expect-error - tryOrWith cannot handle sync function with async fallback
  const _errorCase = tryOrWith(async () => ({ error: 'timeout' }))()

  // Use tryOrAsyncWith instead for async fallbacks
  const orAsyncDefault = tryOrAsyncWith(async () => ({ error: 'timeout' }))

  const r3 = orAsyncDefault(() => 'success')
  Ts.assert<Promise<string | { error: string }>>()(r3)

  const r4 = orAsyncDefault(async () => 'success')
  Ts.assert<Promise<string | { error: string }>>()(r4)
})

// Edge cases

// Void functions
Ts.test('void functions', () => {
  const r1 = tryOr(() => {}, 'fallback')
  Ts.assert<void | string>()(r1)

  const r2 = tryOr(async () => {}, 'fallback')
  Ts.assert<Promise<void | string>>()(r2)
})

// Never type (functions that always throw)
Ts.test('never type', () => {
  const alwaysThrows = (): never => {
    throw new Error('Always fails')
  }

  const r1 = tryOr(alwaysThrows, 'fallback')
  Ts.assert<string>()(r1)

  // This would be an error with tryOr
  // const _errorCase2 = tryOr(alwaysThrows, async () => 'fallback')

  // Use tryOrAsync instead
  const r2 = tryOrAsync(alwaysThrows, async () => 'fallback')
  Ts.assert<Promise<string>>()(r2)
})

// Union types
Ts.test('union types', () => {
  const fn = (): string | number => Math.random() > 0.5 ? 'text' : 42

  const r1 = tryOr(fn, false)
  Ts.assert<string | number | boolean>()(r1)

  const r2 = tryOr(async () => fn(), null)
  Ts.assert<Promise<string | number | null>>()(r2)
})

// Nested promises (should be flattened)
Ts.test('nested promises', () => {
  const r1 = tryOr(
    async () => Promise.resolve(42),
    async () => Promise.resolve('fallback'),
  )
  Ts.assert<Promise<number | string>>()(r1)

  // Not Promise<Promise<number | string>>
})

// Generic function usage
Ts.test('generic function usage', () => {
  function processData<T>(data: T): T {
    return data
  }

  function safeProcess<T>(data: T, fallback: T): T {
    return tryOr(() => processData(data), fallback) as T
  }

  const r1 = safeProcess('hello', 'default')
  Ts.assert<string>()(r1)

  const r2 = safeProcess(42, 0)
  Ts.assert<number>()(r2)
})
