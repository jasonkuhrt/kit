import { FsLoc } from '#fs-loc'
import { Pro } from '#pro'
import { describe, expect, test } from 'vitest'

describe('Pro', () => {
  describe('cwd', () => {
    test('returns current working directory as AbsDir', () => {
      const result = Pro.cwd()

      // Should be an AbsDir
      expect(FsLoc.AbsDir.is(result)).toBe(true)

      // Should match process.cwd()
      const expectedPath = process.cwd()
      const actualPath = FsLoc.encodeSync(result)

      // FsLoc.AbsDir always has trailing slash
      expect(actualPath).toBe(expectedPath.endsWith('/') ? expectedPath : expectedPath + '/')
    })

    test('returns a valid absolute path', () => {
      const result = Pro.cwd()
      const encoded = FsLoc.encodeSync(result)

      // Should start with /
      expect(encoded.startsWith('/')).toBe(true)

      // Should end with /
      expect(encoded.endsWith('/')).toBe(true)
    })
  })
})
