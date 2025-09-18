import { Fs } from '#fs'
import { Effect } from 'effect'
import { describe, expect, test } from 'vitest'

describe('Glob', () => {
  describe('glob', () => {
    test('returns an Effect that resolves to an array of file paths', async () => {
      const result = await Effect.runPromise(
        Fs.glob('src/utils/fs/*.ts'),
      )
      expect(result).toBeInstanceOf(Array)
      expect(result.length).toBeGreaterThan(0)
      expect(result).toContain('src/utils/fs/glob.ts')
      expect(result).toContain('src/utils/fs/fs.ts')
    })

    test('handles glob patterns with options', async () => {
      const result = await Effect.runPromise(
        Fs.glob('**/*.test.ts', { cwd: 'src/utils/fs' }),
      )
      expect(result).toBeInstanceOf(Array)
      expect(result.some(f => f.endsWith('.test.ts'))).toBe(true)
    })

    test('handles array of patterns', async () => {
      const result = await Effect.runPromise(
        Fs.glob(['src/utils/fs/$.ts', 'src/utils/fs/$$.ts']),
      )
      expect(result).toBeInstanceOf(Array)
      expect(result.length).toBe(2)
      expect(result).toContain('src/utils/fs/$.ts')
      expect(result).toContain('src/utils/fs/$$.ts')
    })
  })

  describe('globSync', () => {
    test('returns an Effect that contains the result synchronously', () => {
      const result = Effect.runSync(
        Fs.globSync('src/utils/fs/*.ts'),
      )
      expect(result).toBeInstanceOf(Array)
      expect(result.length).toBeGreaterThan(0)
      expect(result).toContain('src/utils/fs/glob.ts')
    })

    test('handles errors gracefully', () => {
      // Test with an invalid pattern that might cause an error
      const effect = Fs.globSync('', { cwd: '/nonexistent/path' })
      expect(() => Effect.runSync(effect)).not.toThrow()
    })
  })
})
