import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import { Ts } from '#ts'
import '../$.test-matchers.js'
import { describe, expect, it } from 'vitest'

const A = Ts.Assert.exact.ofAs

const l = FsLoc.fromString

describe('toAbs', () => {
  // dprint-ignore
  Test.describe('convert relative to absolute')
    .inputType<FsLoc.Groups.Rel.Rel>()
    .outputType<FsLoc.Groups.Abs.Abs>()
    .contextType<{
      base?: FsLoc.AbsDir
    }>()
    .cases(
      { input: l('./file.txt'),                     output: l('/file.txt') },
      { input: l('./src/'),                         output: l('/src/') },
      { input: l('./src/index.ts'),                 output: l('/src/index.ts') },
      { input: l('file.txt'),                       output: l('/home/file.txt'), base: l('/home/') },
      { input: l('src/'),                           output: l('/home/src/'), base: l('/home/') },
      { input: l('src/index.ts'),                   output: l('/project/src/index.ts'), base: l('/project/') },
      { input: l('src/components/'),                output: l('/project/src/components/'), base: l('/project/') },
      { input: l('../file.txt'),                    output: l('/home/file.txt'), base: l('/home/user/') },
      { input: l('../lib/'),                        output: l('/home/lib/'), base: l('/home/user/') },
    )
    .test(({ input, output, base }) => {
      const result = FsLoc.toAbs(input, base)
      expect(result).toBeAbs()
      expect(result).toBeEquivalent(output, FsLoc.FsLoc)
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
