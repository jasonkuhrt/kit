import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import '../$.test-matchers.js'
import { describe, expect, it } from 'vitest'

const l = FsLoc.fromString

describe('toDir', () => {
  // dprint-ignore
  Test.describe('get parent directory of file')
    .inputType<FsLoc.Groups.File.File>()
    .outputType<string>()
    .cases(
      [l('/home/file.txt'),                  '/home/'],
      [l('src/index.ts'),                    './src/'],
      [l('/file.txt'),                       '/'],
      [l('./a.md'),                          './'],
      [l('./a/b/c.md'),                      './a/b/'],
      [l('/home/user/docs/file.txt'),        '/home/user/docs/'],
    )
    .test(({ input, output }) => {
      const result = FsLoc.toDir(input)
      expect(result).toBeDir()
      expect(result).toEncodeTo(output)
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
