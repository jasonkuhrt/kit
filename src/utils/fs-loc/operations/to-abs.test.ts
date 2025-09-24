import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import '../$.test-matchers.js'
import { describe, expect, expectTypeOf, it } from 'vitest'

const l = FsLoc.fromString

describe('toAbs', () => {
  // dprint-ignore
  Test.Table.suite<
    FsLoc.Groups.Rel.Rel,
    FsLoc.Groups.Abs.Abs,
    {
      base?: FsLoc.AbsDir
    }
  >('convert relative to absolute', [
    { n: 'rel file no base (re-tag)',                    i: l('./file.txt'),                     o: l('/file.txt') },
    { n: 'rel dir no base (re-tag)',                     i: l('./src/'),                         o: l('/src/') },
    { n: 'nested file no base (re-tag)',                 i: l('./src/index.ts'),                 o: l('/src/index.ts') },
    { n: 'rel file with base',                           i: l('file.txt'),                       base: l('/home/'),                         o: l('/home/file.txt') },
    { n: 'rel dir with base',                            i: l('src/'),                           base: l('/home/'),                         o: l('/home/src/') },
    { n: 'nested rel file',                              i: l('src/index.ts'),                   base: l('/project/'),                      o: l('/project/src/index.ts') },
    { n: 'nested rel dir',                               i: l('src/components/'),                base: l('/project/'),                      o: l('/project/src/components/') },
    { n: 'parent ref file',                              i: l('../file.txt'),                    base: l('/home/user/'),                    o: l('/home/file.txt') },
    { n: 'parent ref dir',                               i: l('../lib/'),                        base: l('/home/user/'),                    o: l('/home/lib/') },
  ], ({ i, o, base }) => {
    const result = FsLoc.toAbs(i, base)
    expect(result).toBeAbs()
    expect(result).toBeEquivalent(o, FsLoc.FsLoc)
  })

  describe('String literal support', () => {
    it('accepts string literals', () => {
      const abs1 = FsLoc.toAbs('./relative/path.ts')
      expect(abs1).toBeFile()
      expect(abs1).toEncodeTo('/relative/path.ts')

      const abs2 = FsLoc.toAbs('./rel/', '/base/')
      expect(abs2).toBeDir()
      expect(abs2).toEncodeTo('/base/rel/')
    })
  })
})
