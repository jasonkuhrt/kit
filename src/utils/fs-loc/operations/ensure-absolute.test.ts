import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import '../$.test-matchers.js'
import { describe, expect, it } from 'vitest'

const l = FsLoc.fromString

describe('ensureAbsolute', () => {
  // dprint-ignore
  Test.describe('paths without base')
    .i<FsLoc.FsLoc>()
    .o<string | undefined>()
    .cases(
      ['abs file stays abs',                           [l('/home/file.txt')],                  '/home/file.txt'],
      ['abs dir stays abs',                            [l('/home/')],                         '/home/'],
      ['rel file without base uses cwd',               [l('file.txt')],                       undefined],
      ['rel dir without base uses cwd',                [l('src/')],                           undefined],
    )
    .test((i, o) => {
      const result = FsLoc.ensureAbsolute(i)
      expect(result).toBeAbs()
      if (o) {
        expect(result).toEncodeTo(o)
      }
    })

  // dprint-ignore
  Test.describe('paths with base')
    .i<FsLoc.FsLoc>()
    .o<string | undefined>()
    .ctx<{ base: FsLoc.AbsDir }>()
    .cases(
      { n: 'rel file with base',                           i: l('file.txt'),                       base: l('/home/'),                         o: '/home/file.txt' },
      { n: 'rel dir with base',                            i: l('src/'),                           base: l('/project/'),                      o: '/project/src/' },
    )
    .test((i, o, ctx) => {
      const base = ctx.base
      const result = FsLoc.ensureAbsolute(i, base)
      expect(result).toBeAbs()
      if (o) {
        expect(result).toEncodeTo(o)
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
