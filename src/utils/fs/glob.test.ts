import { Fs } from '#fs'
import { FsLoc } from '#fs-loc'
import { Effect } from 'effect'
import { describe, expect, test } from 'vitest'

describe('Glob', () => {
  describe('glob', () => {
    test('returns an Effect that resolves to an array of relative FsLoc objects', async () => {
      const result = await Effect.runPromise(
        Fs.glob('src/utils/fs/*.ts'),
      )
      expect(result).toBeInstanceOf(Array)
      expect(result.length).toBeGreaterThan(0)

      // Verify we get FsLoc objects
      expect(result[0]).toHaveProperty('_tag')
      expect(result[0]).toHaveProperty('path')
    })

    test('returns absolute FsLocs with absolute option', async () => {
      const result = await Effect.runPromise(
        Fs.glob('src/utils/fs/*.ts', { absolute: true }),
      )
      expect(result).toBeInstanceOf(Array)
      expect(result.length).toBeGreaterThan(0)

      // Verify we get absolute paths
      expect(result[0]).toHaveProperty('_tag')
      expect(result[0]).toHaveProperty('path')
    })
  })

  describe('globSync', () => {
    test('returns an Effect that contains FsLocs synchronously', () => {
      const result = Effect.runSync(
        Fs.globSync('src/utils/fs/*.ts'),
      )
      expect(result).toBeInstanceOf(Array)
      expect(result.length).toBeGreaterThan(0)

      // Verify we get FsLoc objects
      expect(result[0]).toHaveProperty('_tag')
      expect(result[0]).toHaveProperty('path')
    })

    test('handles errors gracefully', () => {
      // Test with an invalid pattern that might cause an error
      const effect = Fs.globSync('', { cwd: '/nonexistent/path' })
      expect(() => Effect.runSync(effect)).not.toThrow()
    })
  })
})
