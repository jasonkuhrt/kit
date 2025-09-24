import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import '../$.test-matchers.js'
import { describe, expect, expectTypeOf, it } from 'vitest'

const l = FsLoc.fromString

describe('join', () => {
  // dprint-ignore
  Test.Table.suite<
    { base: FsLoc.Groups.Dir.Dir; rel: FsLoc.Groups.Rel.Rel },
    string
  >('join paths', [
    // Joining directories with files
    { n: 'abs dir + rel file',                           i: { base: l('/home/'),                         rel: l('file.txt') },                         o: '/home/file.txt' },
    { n: 'rel dir + rel file',                           i: { base: l('src/'),                           rel: l('index.ts') },                         o: './src/index.ts' },
    { n: 'root + rel file',                              i: { base: l('/'),                              rel: l('file.txt') },                         o: '/file.txt' },

    // Joining directories with directories
    { n: 'abs dir + rel dir',                            i: { base: l('/home/'),                         rel: l('documents/') },                       o: '/home/documents/' },
    { n: 'rel dir + rel dir',                            i: { base: l('src/'),                           rel: l('components/') },                      o: './src/components/' },
    { n: 'root + rel dir',                               i: { base: FsLoc.Constants.absDirRoot,          rel: l('home/') },                           o: '/home/' },

    // Parent references (resolved during join)
    { n: 'parent refs with file',                        i: { base: l('../'),                            rel: l('lib/utils.js') },                    o: './lib/utils.js' },
    { n: 'parent refs in nested path',                   i: { base: l('src/'),                           rel: l('../test/file.ts') },                 o: './test/file.ts' },
  ], ({ i, o }) => {
    const result = FsLoc.join(i.base, i.rel)
    expect(result).toEncodeTo(o)
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
