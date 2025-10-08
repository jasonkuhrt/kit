import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import '../$.test-matchers.js'
import { describe, expect, it } from 'vitest'

const l = FsLoc.fromString

describe('toRel', () => {
  // dprint-ignore
  Test.describe('convert absolute to relative')
    .inputType<FsLoc.Groups.Abs.Abs>()
    .outputType<FsLoc.Groups.Rel.Rel>()
    .contextType<{
      base: FsLoc.AbsDir
    }>()
    .cases(
      { n: 'abs file same base',                           i: l('/home/file.txt'),                 o: l('./file.txt'), base: l('/home/') },
      { n: 'abs dir same base',                            i: l('/home/src/'),                     o: l('./src/'), base: l('/home/') },
      { n: 'nested abs file',                              i: l('/project/src/index.ts'),          o: l('./src/index.ts'), base: l('/project/') },
      { n: 'nested abs dir',                               i: l('/project/src/components/'),       o: l('./src/components/'), base: l('/project/') },
      { n: 'file needs parent',                            i: l('/home/file.txt'),                 o: l('./../file.txt'), base: l('/home/user/') },
      { n: 'dir needs parent',                             i: l('/home/lib/'),                     o: l('./../lib/'), base: l('/home/user/') },
      { n: 'different roots',                              i: l('/var/log/app.log'),               o: l('./../../var/log/app.log'), base: l('/home/user/') },
      { n: 'same location dir',                            i: l('/home/user/'),                    o: l('./'), base: l('/home/user/') },
    )
    .test((i, o, ctx) => {
      const result = FsLoc.toRel(i, ctx.base)
      expect(result).toBeEquivalent(o, FsLoc.FsLoc)
    })

  describe('String literal support', () => {
    it('accepts string literals', () => {
      const rel1 = FsLoc.toRel('/home/user/src/index.ts', '/home/user/')
      expect(rel1).toBeFile()
      expect(rel1).toEncodeTo('./src/index.ts')

      const rel2 = FsLoc.toRel('/home/user/docs/', '/home/')
      expect(rel2).toBeDir()
      expect(rel2).toEncodeTo('./user/docs/')
    })
  })
})
