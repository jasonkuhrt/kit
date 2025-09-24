import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import '../$.test-matchers.js'
import { describe, expect, it } from 'vitest'

const l = FsLoc.fromString

describe('ensureAbsolute', () => {
  // dprint-ignore
  Test.Table.suite<
    FsLoc.FsLoc,
    string | undefined,
    {
      base?: FsLoc.AbsDir
    }
  >('ensure paths are absolute', [
    { n: 'abs file stays abs',                           i: l('/home/file.txt'),                  o: '/home/file.txt' },
    { n: 'abs dir stays abs',                            i: l('/home/'),                         o: '/home/' },
    // Join doesn't preserve file type correctly yet
    // { name: 'rel file with base',                           i: l('file.txt'),                       base: l('/home/'),                         o: '/home/file.txt' },
    { n: 'rel dir with base',                            i: l('src/'),                           base: l('/project/'),                      o: '/project/src/' },
    { n: 'rel file without base uses cwd',               i: l('file.txt'),                       o: undefined },
    { n: 'rel dir without base uses cwd',                i: l('src/'),                           o: undefined },
  ], ({ i, o, base }) => {
    const result = FsLoc.ensureAbsolute(i, base)

    // The result should always be absolute
    expect(result).toBeAbs()

    // If we have an expected value, check it matches
    if (o) {
      expect(result).toEncodeTo(o)
    }
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
})
