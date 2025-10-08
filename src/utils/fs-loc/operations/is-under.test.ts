import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import '../$.test-matchers.js'
import { describe, expect, it } from 'vitest'

const l = FsLoc.fromString

describe('isUnder', () => {
  // dprint-ignore
  Test.describe('check if path is under another')
    .inputType<{ child: FsLoc.FsLoc; parent: FsLoc.Groups.Dir.Dir }>()
    .outputType<boolean>()
    .cases(
      // Absolute paths
      ['abs file under abs dir',                      [{ child: l('/home/user/file.txt'), parent: l('/home/') }],                         true],
      ['abs dir under abs dir',                       [{ child: l('/home/user/src/'), parent: l('/home/') }],                             true],
      ['abs file not under abs dir',                  [{ child: l('/var/file.txt'), parent: l('/home/') }],                               false],
      ['abs file under immediate parent',             [{ child: l('/home/file.txt'), parent: l('/home/') }],                              true],
      ['abs file under root',                         [{ child: l('/file.txt'), parent: FsLoc.Constants.absDirRoot }],                    true],

      // Relative paths
      ['rel file under rel dir',                      [{ child: l('./src/index.ts'), parent: l('./src/') }],                              true],
      ['rel dir under rel dir',                       [{ child: l('./src/components/'), parent: l('./src/') }],                           true],
      ['rel file not under rel dir',                  [{ child: l('./test/file.ts'), parent: l('./src/') }],                              false],

      // Edge cases
      ['same location not under',                     [{ child: l('/home/'), parent: l('/home/') }],                                      false],
      ['parent deeper than child',                    [{ child: l('/home/'), parent: l('/home/user/') }],                                 false],
    )
    .test(( i, o ) => {
      const result = FsLoc.isUnder(i.child, i.parent)
      expect(result).toBe(o)
    })

  describe('curried form', () => {
    it('isUnderOf creates a predicate', () => {
      const isInProject = FsLoc.isUnderOf(l('/project/'))
      expect(isInProject(l('/project/src/index.ts'))).toBe(true)
      expect(isInProject(l('/other/file.ts'))).toBe(false)
    })
  })

  describe('String literal support', () => {
    it('accepts string literals', () => {
      expect(FsLoc.isUnder('/home/user/src/index.ts', '/home/user/')).toBe(true)
      expect(FsLoc.isUnder('/other/path.ts', '/home/user/')).toBe(false)
      expect(FsLoc.isUnder('./src/index.ts', './src/')).toBe(true)
    })

    it('isUnderOf accepts string literals', () => {
      const isInProject = FsLoc.isUnderOf('/project/')
      expect(isInProject('/project/src/index.ts')).toBe(true)
      expect(isInProject('/other/file.ts')).toBe(false)
    })
  })
})
