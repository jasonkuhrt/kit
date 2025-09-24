import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import '../$.test-matchers.js'
import { describe, expect, it } from 'vitest'

const l = FsLoc.fromString

describe('toDir', () => {
  // dprint-ignore
  Test.Table.suite<
    FsLoc.Groups.File.File,
    string
  >('get parent directory of file', [
    { n: 'abs file to parent dir',                       i: l('/home/file.txt'),                  o: '/home/' },
    { n: 'rel file to parent dir',                       i: l('src/index.ts'),                    o: './src/' },
    { n: 'file in root to root dir',                     i: l('/file.txt'),                       o: '/' },
    { n: 'rel file in current dir',                      i: l('./a.md'),                          o: './' },
    { n: 'nested file to parent dir',                    i: l('./a/b/c.md'),                      o: './a/b/' },
    { n: 'abs nested file to parent',                    i: l('/home/user/docs/file.txt'),        o: '/home/user/docs/' },
  ], ({ i, o }) => {
    const result = FsLoc.toDir(i)
    expect(result).toBeDir()
    expect(result).toEncodeTo(o)
  })

  describe('String literal support', () => {
    it('accepts string literals', () => {
      const dir1 = FsLoc.toDir('/path/to/file.txt')
      expect(dir1).toBeDir()
      expect(dir1).toEncodeTo('/path/to/')

      const dir2 = FsLoc.toDir('./src/index.ts')
      expect(dir2).toBeDir()
      expect(dir2).toEncodeTo('./src/')
    })
  })
})
