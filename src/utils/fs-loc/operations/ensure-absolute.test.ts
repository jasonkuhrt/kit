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
      [l('/home/file.txt'),                  '/home/file.txt'],
      [l('/home/'),                         '/home/'],
      [l('file.txt'),                       undefined],
      [l('src/'),                           undefined],
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
      { input: l('file.txt'),                       base: l('/home/'),                         output: '/home/file.txt' },
      { input: l('src/'),                           base: l('/project/'),                      output: '/project/src/' },
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
