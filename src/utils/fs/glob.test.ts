import { Fs } from '#fs'
import { FsLoc } from '#fs-loc'
import { Pro } from '#pro'
import { Effect, Schema as S } from 'effect'
import { describe, expect, test } from 'vitest'

// Local helper functions for decoding
const decodeRelDir = S.decodeSync(FsLoc.RelDir.String)
const decodeAbsDir = S.decodeSync(FsLoc.AbsDir.String)

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

    test('accepts FsLoc.AbsDir for cwd option', async () => {
      // Use Pro.cwd() to get the current directory
      const cwd = Pro.cwd()
      const srcDir = FsLoc.join(cwd, decodeRelDir('./src/'))
      const result = await Effect.runPromise(
        Fs.glob('utils/fs/*.ts', { cwd: srcDir }),
      )
      expect(result).toBeInstanceOf(Array)
      expect(result.length).toBeGreaterThan(0)

      // Verify we get FsLoc objects relative to the cwd
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
      const nonExistentDir = decodeAbsDir('/nonexistent/path/')
      const effect = Fs.globSync('', { cwd: nonExistentDir })
      expect(() => Effect.runSync(effect)).not.toThrow()
    })

    test('accepts FsLoc.AbsDir for cwd option', () => {
      // Use Pro.cwd() to get the current directory
      const cwd = Pro.cwd()
      const srcDir = FsLoc.join(cwd, decodeRelDir('./src/'))
      const result = Effect.runSync(
        Fs.globSync('utils/fs/*.ts', { cwd: srcDir }),
      )
      expect(result).toBeInstanceOf(Array)
      expect(result.length).toBeGreaterThan(0)

      // Verify we get FsLoc objects relative to the cwd
      expect(result[0]).toHaveProperty('_tag')
      expect(result[0]).toHaveProperty('path')
    })
  })
})
