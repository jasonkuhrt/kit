import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import '../$.test-matchers.js'
import { describe, expect, it } from 'vitest'

const l = FsLoc.fromString

describe('isAbove', () => {
  // dprint-ignore
  Test.describe('check if path is above another')
    .inputType<{ parent: FsLoc.Groups.Dir.Dir; child: FsLoc.FsLoc }>()
    .outputType<boolean>()
    .cases(
      // Absolute paths
      [{ parent: l('/home/'), child: l('/home/user/file.txt') },                         true],
      [{ parent: l('/home/'), child: l('/home/user/src/') },                             true],
      [{ parent: l('/home/'), child: l('/var/file.txt') },                               false],
      [{ parent: l('/home/'), child: l('/home/file.txt') },                              true],
      [{ parent: FsLoc.Constants.absDirRoot, child: l('/file.txt') },                    true],

      // Relative paths
      [{ parent: l('./src/'), child: l('./src/index.ts') },                              true],
      [{ parent: l('./src/'), child: l('./src/components/') },                           true],
      [{ parent: l('./src/'), child: l('./test/file.ts') },                              false],

      // Edge cases
      [{ parent: l('/home/'), child: l('/home/') },                                      false],
      [{ parent: l('/home/user/'), child: l('/home/') },                                 false],
    )
    .test(({ input, output }) => {
      const result = FsLoc.isAbove(input.parent, input.child)
      expect(result).toBe(output)
    })

  describe('curried form', () => {
    it('isAboveOf creates a predicate', () => {
      const hasAsParent = FsLoc.isAboveOf(l('/home/user/src/index.ts'))
      expect(hasAsParent(l('/home/user/'))).toBe(true)
      expect(hasAsParent(l('/other/'))).toBe(false)
    })
  })

  describe('String literal support', () => {
    it('accepts string literals', () => {
      expect(FsLoc.isAbove('/home/', '/home/user/file.txt')).toBe(true)
      expect(FsLoc.isAbove('/other/', '/home/user/file.txt')).toBe(false)
    })

    it('isAboveOf accepts string literals', () => {
      const hasAsParent = FsLoc.isAboveOf('/home/user/src/index.ts')
      expect(hasAsParent('/home/user/')).toBe(true)
      expect(hasAsParent('/other/')).toBe(false)
    })
  })
})
