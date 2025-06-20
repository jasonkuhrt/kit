import { Err } from '#err'
import { describe, expect, expectTypeOf, test } from 'vitest'
import { tryAllOrRethrow, tryOr, tryOrRethrow } from './try.ts'
import { wrapWith } from './wrap.ts'

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

describe('tryOr', () => {
  test('returns value on success', () => {
    const result = tryOr(() => 42, 'fallback')
    expect(result).toBe(42)
  })

  test('returns fallback on error', () => {
    const result = tryOr(() => {
      throw new Error('fail')
    }, 'fallback')
    expect(result).toBe('fallback')
  })

  test('returns lazy fallback on error', () => {
    const result = tryOr(() => {
      throw new Error('fail')
    }, () => 'lazy fallback')
    expect(result).toBe('lazy fallback')
  })

  test('handles async function that resolves', async () => {
    const result = await tryOr(async () => 42, 'fallback')
    expect(result).toBe(42)
  })

  test('handles async function that rejects with static fallback', async () => {
    const result = await tryOr(async () => {
      throw new Error('fail')
    }, 'fallback')
    expect(result).toBe('fallback')
  })

  test('handles async function that rejects with lazy fallback', async () => {
    const result = await tryOr(async () => {
      throw new Error('fail')
    }, () => 'lazy fallback')
    expect(result).toBe('lazy fallback')
  })

  test('handles async function with async fallback', async () => {
    const result = await tryOr(
      async () => {
        throw new Error('fail')
      },
      async () => {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 10))
        return 'async fallback'
      },
    )
    expect(result).toBe('async fallback')
  })

  test('sync function with async fallback should use tryOrAsync', async () => {
    const { tryOrAsync } = await import('./try.ts')
    const result = await tryOrAsync(
      () => {
        throw new Error('fail')
      },
      async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
        return 'async fallback from sync error'
      },
    )

    // Result should be the fallback value
    expect(result).toBe('async fallback from sync error')
  })

  test('tryOrAsync always returns Promise', async () => {
    const { tryOrAsync } = await import('./try.ts')

    // Even when both are sync, tryOrAsync returns Promise
    const result1 = tryOrAsync(
      () => 42,
      () => 'never used',
    )
    expect(result1).toBeInstanceOf(Promise)
    expect(await result1).toBe(42)

    // Works with async fallback too
    const result2 = tryOrAsync(
      () => 42,
      async () => 'never used',
    )
    expect(result2).toBeInstanceOf(Promise)
    expect(await result2).toBe(42)
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
