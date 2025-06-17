import { Err } from '#err/index.js'
import { describe, expect, expectTypeOf, test } from 'vitest'
import { tryAllOrRethrow, tryOrRethrow } from './try.js'
import { wrapWith } from './wrap.js'

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

describe('tryOrRethrow', () => {
  test('returns value on success', () => {
    const result = tryOrRethrow(() => 42, 'Should not throw')
    expect(result).toBe(42)
  })

  test('wraps thrown errors with string message', () => {
    expect(() =>
      tryOrRethrow(() => {
        throw new Error('Original')
      }, 'Operation failed')
    ).toThrow('Operation failed')

    try {
      tryOrRethrow(() => {
        throw new Error('Original')
      }, 'Operation failed')
    } catch (error: any) {
      expect(error.cause.message).toBe('Original')
    }
  })

  test('wraps thrown errors with options', () => {
    try {
      tryOrRethrow(() => {
        throw new Error('Original')
      }, { message: 'Operation failed', context: { id: 123 } })
    } catch (error: any) {
      expect(error.message).toBe('Operation failed')
      expect(error.context).toEqual({ id: 123 })
    }
  })

  test('wraps with custom wrapper function', () => {
    class CustomError extends Error {
      constructor(message: string, options?: ErrorOptions) {
        super(message, options)
        this.name = 'CustomError'
      }
    }

    try {
      tryOrRethrow(
        () => {
          throw new Error('Original')
        },
        (cause) => new CustomError('Custom wrapper', { cause }),
      )
    } catch (error: any) {
      expect(error).toBeInstanceOf(CustomError)
      expect(error.message).toBe('Custom wrapper')
    }
  })

  test('handles async functions that resolve', async () => {
    const result = await tryOrRethrow(
      async () => 42,
      'Should not throw',
    )
    expect(result).toBe(42)
  })

  test('wraps async function errors', async () => {
    await expect(
      tryOrRethrow(
        async () => {
          throw new Error('Async error')
        },
        'Async operation failed',
      ),
    ).rejects.toThrow('Async operation failed')

    try {
      await tryOrRethrow(
        async () => {
          throw new Error('Async error')
        },
        'Async operation failed',
      )
    } catch (error: any) {
      expect(error.cause.message).toBe('Async error')
    }
  })

  test('works with wrapWith curried function', async () => {
    const wrapAsDataError = wrapWith('Failed to fetch data')

    await expect(
      tryOrRethrow(
        async () => {
          throw new Error('Network timeout')
        },
        wrapAsDataError,
      ),
    ).rejects.toThrow('Failed to fetch data')
  })
})

describe('tryAllOrRethrow', () => {
  test('returns all results on success', async () => {
    const results = await tryAllOrRethrow(
      [
        () => 1,
        async () => 2,
        () => Promise.resolve(3),
      ],
      'Should not throw',
    )

    expect(results).toEqual([1, 2, 3])
  })

  test('throws AggregateError when any fail', async () => {
    await expect(
      tryAllOrRethrow(
        [
          () => 1,
          () => {
            throw new Error('Failed 1')
          },
          async () => {
            throw new Error('Failed 2')
          },
        ],
        'Multiple operations failed',
      ),
    ).rejects.toThrow(AggregateError)

    try {
      await tryAllOrRethrow(
        [
          () => 1,
          () => {
            throw new Error('Failed 1')
          },
          async () => {
            throw new Error('Failed 2')
          },
        ],
        'Operations failed',
      )
    } catch (error: any) {
      expect(error).toBeInstanceOf(AggregateError)
      expect(error.message).toBe('Operations failed')
      expect(error.errors).toHaveLength(2)
      expect(error.errors[0].message).toBe('Operations failed')
      expect(error.errors[0].cause.message).toBe('Failed 1')
      expect(error.errors[1].message).toBe('Operations failed')
      expect(error.errors[1].cause.message).toBe('Failed 2')
    }
  })

  test('works with wrapper function', async () => {
    class DataError extends Error {
      constructor(message: string, options?: ErrorOptions) {
        super(message, options)
        this.name = 'DataError'
      }
    }

    try {
      await tryAllOrRethrow(
        [
          () => 1,
          () => {
            throw new Error('DB error')
          },
        ],
        (cause) => new DataError('Data operation failed', { cause }),
      )
    } catch (error: any) {
      expect(error).toBeInstanceOf(AggregateError)
      expect(error.errors[0]).toBeInstanceOf(DataError)
    }
  })

  test('preserves result order', async () => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    const results = await tryAllOrRethrow(
      [
        async () => {
          await delay(100)
          return 'slow'
        },
        () => 'fast',
        async () => {
          await delay(50)
          return 'medium'
        },
      ],
      'Should not fail',
    )

    expect(results).toEqual(['slow', 'fast', 'medium'])
  })
})
