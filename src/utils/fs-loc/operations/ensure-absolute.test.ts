import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import '../$.test-matchers.js'
import { describe, expect, it } from 'vitest'

const l = FsLoc.fromString

describe('ensureAbsolute', () => {
  // dprint-ignore
  Test.describe('paths without base')
    .inputType<FsLoc.FsLoc>()
    .outputType<string | undefined>()
    .cases(
      ['abs file stays abs',                           [l('/home/file.txt')],                  '/home/file.txt'],
      ['abs dir stays abs',                            [l('/home/')],                         '/home/'],
      ['rel file without base uses cwd',               [l('file.txt')],                       undefined],
      ['rel dir without base uses cwd',                [l('src/')],                           undefined],
    )
    .test(({ input, output }) => {
      const result = FsLoc.ensureAbsolute(input)
      expect(result).toBeAbs()
      if (output) {
        expect(result).toEncodeTo(output)
      }
    })

  // dprint-ignore
  Test.describe('paths with base')
    .inputType<FsLoc.FsLoc>()
    .outputType<string | undefined>()
    .contextType<{ base: FsLoc.AbsDir }>()
    .cases(
      { n: 'rel file with base',                           i: l('file.txt'),                       base: l('/home/'),                         o: '/home/file.txt' },
      { n: 'rel dir with base',                            i: l('src/'),                           base: l('/project/'),                      o: '/project/src/' },
    )
    .test(({ input, output, base }) => {
      const result = FsLoc.ensureAbsolute(input, base)
      expect(result).toBeAbs()
      if (output) {
        expect(result).toEncodeTo(output)
      }
    })
})

describe('String literal support', () => {
  it('accepts string literals', () => {
    const abs1 = FsLoc.ensureAbsolute('./src/index.ts')
    expect(abs1).toBeFile()
    expect(abs1).toBeAbs()

    const abs2 = FsLoc.ensureAbsolute('/already/absolute.ts')
    expect(abs2).toBeFile()
    expect(abs2).toEncodeTo('/already/absolute.ts')

    const abs3 = FsLoc.ensureAbsolute('./src/', '/base/')
    expect(abs3).toBeDir()
    expect(abs3).toEncodeTo('/base/src/')
  })
})
