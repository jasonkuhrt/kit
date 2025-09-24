import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import '../$.test-matchers.js'
import { describe, expect, it } from 'vitest'

const l = FsLoc.fromString

describe('toRel', () => {
  // dprint-ignore
  Test.Table.suite<
    FsLoc.Groups.Abs.Abs,
    FsLoc.Groups.Rel.Rel,
    {
      base: FsLoc.AbsDir
    }
  >('convert absolute to relative', [
    { n: 'abs file same base',                           i: l('/home/file.txt'),                 base: l('/home/'),                         o: l('./file.txt') },
    { n: 'abs dir same base',                            i: l('/home/src/'),                     base: l('/home/'),                         o: l('./src/') },
    { n: 'nested abs file',                              i: l('/project/src/index.ts'),          base: l('/project/'),                      o: l('./src/index.ts') },
    { n: 'nested abs dir',                               i: l('/project/src/components/'),       base: l('/project/'),                      o: l('./src/components/') },
    { n: 'file needs parent',                            i: l('/home/file.txt'),                 base: l('/home/user/'),                    o: l('./../file.txt') },
    { n: 'dir needs parent',                             i: l('/home/lib/'),                     base: l('/home/user/'),                    o: l('./../lib/') },
    { n: 'different roots',                              i: l('/var/log/app.log'),               base: l('/home/user/'),                    o: l('./../../var/log/app.log') },
    { n: 'same location dir',                            i: l('/home/user/'),                    base: l('/home/user/'),                    o: l('./') },
  ], ({ i, o, base }) => {
    const result = FsLoc.toRel(i, base)
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
