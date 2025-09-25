import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import '../$.test-matchers.js'
import { describe, expect, it } from 'vitest'

const l = FsLoc.fromString

describe('toDir', () => {
  // dprint-ignore
  Test.describe('get parent directory of file')
    .i<FsLoc.Groups.File.File>()
    .o<string>()
    .cases(
      ['abs file to parent dir',                       [l('/home/file.txt')],                  '/home/'],
      ['rel file to parent dir',                       [l('src/index.ts')],                    './src/'],
      ['file in root to root dir',                     [l('/file.txt')],                       '/'],
      ['rel file in current dir',                      [l('./a.md')],                          './'],
      ['nested file to parent dir',                    [l('./a/b/c.md')],                      './a/b/'],
      ['abs nested file to parent',                    [l('/home/user/docs/file.txt')],        '/home/user/docs/'],
    )
    .test(( i, o ) => {
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
