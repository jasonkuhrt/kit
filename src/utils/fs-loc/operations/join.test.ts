import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import '../$.test-matchers.js'
import { describe, expect, expectTypeOf, it } from 'vitest'

const l = FsLoc.fromString

describe('join', () => {
  // dprint-ignore
  Test.describe('join paths')
    .inputType<{ base: FsLoc.Groups.Dir.Dir; rel: FsLoc.Groups.Rel.Rel }>()
    .outputType<string>()
    .cases(
      // Joining directories with files
      ['abs dir + rel file',                           [{ base: l('/home/'),                         rel: l('file.txt') }],                         '/home/file.txt'],
      ['rel dir + rel file',                           [{ base: l('src/'),                           rel: l('index.ts') }],                         './src/index.ts'],
      ['root + rel file',                              [{ base: l('/'),                              rel: l('file.txt') }],                         '/file.txt'],

      // Joining directories with directories
      ['abs dir + rel dir',                            [{ base: l('/home/'),                         rel: l('documents/') }],                       '/home/documents/'],
      ['rel dir + rel dir',                            [{ base: l('src/'),                           rel: l('components/') }],                      './src/components/'],
      ['root + rel dir',                               [{ base: FsLoc.Constants.absDirRoot,          rel: l('home/') }],                           '/home/'],

      // Parent references (resolved during join)
      ['parent refs with file',                        [{ base: l('../'),                            rel: l('lib/utils.js') }],                    './lib/utils.js'],
      ['parent refs in nested path',                   [{ base: l('src/'),                           rel: l('../test/file.ts') }],                 './test/file.ts'],
    )
    .test(({ input, output }) => {
      const result = FsLoc.join(input.base, input.rel)
      expect(result).toEncodeTo(output)
    })

  describe('String literal support', () => {
    it('accepts string literals', () => {
      // Absolute directory + relative file
      const file1 = FsLoc.join('/home/user/', 'config.json')
      expectTypeOf(file1).toEqualTypeOf<FsLoc.AbsFile>()
      expect(file1).toBeFile()
      expect(file1).toEncodeTo('/home/user/config.json')

      // With ./ prefix should also work
      const file1b = FsLoc.join('/home/user/', './config.json')
      expectTypeOf(file1b).toEqualTypeOf<FsLoc.AbsFile>()
      expect(file1b).toBeFile()
      expect(file1b).toEncodeTo('/home/user/config.json')

      // Absolute directory + relative directory
      const dir1 = FsLoc.join('/home/user/', 'src/')
      expectTypeOf(dir1).toEqualTypeOf<FsLoc.AbsDir>()
      expect(dir1).toBeDir()
      expect(dir1).toEncodeTo('/home/user/src/')

      // Relative directory + relative file
      const file2 = FsLoc.join('./src/', 'index.ts')
      expectTypeOf(file2).toEqualTypeOf<FsLoc.RelFile>()
      expect(file2).toBeFile()
      expect(file2).toEncodeTo('./src/index.ts')

      // Relative directory + relative directory
      const dir2 = FsLoc.join('./base/', 'nested/')
      expectTypeOf(dir2).toEqualTypeOf<FsLoc.RelDir>()
      expect(dir2).toBeDir()
      expect(dir2).toEncodeTo('./base/nested/')
    })
  })
})
