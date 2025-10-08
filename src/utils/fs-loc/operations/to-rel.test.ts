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
      { input: l('/home/file.txt'),                 output: l('./file.txt'), base: l('/home/') },
      { input: l('/home/src/'),                     output: l('./src/'), base: l('/home/') },
      { input: l('/project/src/index.ts'),          output: l('./src/index.ts'), base: l('/project/') },
      { input: l('/project/src/components/'),       output: l('./src/components/'), base: l('/project/') },
      { input: l('/home/file.txt'),                 output: l('./../file.txt'), base: l('/home/user/') },
      { input: l('/home/lib/'),                     output: l('./../lib/'), base: l('/home/user/') },
      { input: l('/var/log/app.log'),               output: l('./../../var/log/app.log'), base: l('/home/user/') },
      { input: l('/home/user/'),                    output: l('./'), base: l('/home/user/') },
    )
    .test(({ input, output, base }) => {
      const result = FsLoc.toRel(input, base)
      expect(result).toBeEquivalent(output, FsLoc.FsLoc)
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
