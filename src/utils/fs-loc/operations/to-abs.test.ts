import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import '../$.test-matchers.js'
import { describe, expect, expectTypeOf, it } from 'vitest'

const l = FsLoc.fromString

describe('toAbs', () => {
  // dprint-ignore
  Test.describe('convert relative to absolute')
    .i<FsLoc.Groups.Rel.Rel>()
    .o<FsLoc.Groups.Abs.Abs>()
    .cases<{
      base?: FsLoc.AbsDir
    }>(
      { n: 'rel file no base (re-tag)',                    i: l('./file.txt'),                     o: l('/file.txt') },
      { n: 'rel dir no base (re-tag)',                     i: l('./src/'),                         o: l('/src/') },
      { n: 'nested file no base (re-tag)',                 i: l('./src/index.ts'),                 o: l('/src/index.ts') },
      { n: 'rel file with base',                           i: l('file.txt'),                       o: l('/home/file.txt'), base: l('/home/') },
      { n: 'rel dir with base',                            i: l('src/'),                           o: l('/home/src/'), base: l('/home/') },
      { n: 'nested rel file',                              i: l('src/index.ts'),                   o: l('/project/src/index.ts'), base: l('/project/') },
      { n: 'nested rel dir',                               i: l('src/components/'),                o: l('/project/src/components/'), base: l('/project/') },
      { n: 'parent ref file',                              i: l('../file.txt'),                    o: l('/home/file.txt'), base: l('/home/user/') },
      { n: 'parent ref dir',                               i: l('../lib/'),                        o: l('/home/lib/'), base: l('/home/user/') },
    )
    .test((i, o, ctx) => {
      const result = FsLoc.toAbs(i, ctx.base)
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
