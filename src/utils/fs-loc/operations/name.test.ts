import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import '../$.test-matchers.js'
import { describe, expect, it } from 'vitest'

const l = FsLoc.fromString

describe('name', () => {
  // dprint-ignore
  Test.Table.suite<
    FsLoc.FsLoc,
    string
  >('get name of file or directory', [
    // Files with extensions
    { n: 'abs file with extension',                      i: l('/home/file.txt'),                 o: 'file.txt' },
    { n: 'rel file with extension',                      i: l('./docs/README.md'),               o: 'README.md' },
    { n: 'file with multiple dots',                      i: l('/archive.tar.gz'),                o: 'archive.tar.gz' },
    { n: 'hidden file with extension',                   i: l('./.config.json'),                 o: '.config.json' },

    // Directories
    { n: 'abs directory',                                i: l('/home/user/'),                    o: 'user' },
    { n: 'rel directory',                                i: l('./src/'),                         o: 'src' },
    { n: 'nested abs directory',                         i: l('/project/src/components/'),       o: 'components' },
    { n: 'nested rel directory',                         i: l('./lib/utils/'),                   o: 'utils' },

    // Edge cases
    { n: 'root directory returns empty',                 i: FsLoc.Constants.absDirRoot,         o: '' },
    { n: 'file in root',                                 i: l('/file.txt'),                      o: 'file.txt' },
    { n: 'single segment abs dir',                       i: l('/home/'),                         o: 'home' },
    { n: 'empty rel dir returns empty',                  i: FsLoc.Constants.relDirCurrent,      o: '' },
    { n: 'directory with dots in name',                  i: l('/my.folder.v2/'),                 o: 'my.folder.v2' },
  ], ({ i, o }) => {
    const result = FsLoc.name(i)
    expect(result).toBe(o)
  })

  describe('String literal support', () => {
    it('accepts string literals', () => {
      expect(FsLoc.name('/path/to/file.txt')).toBe('file.txt')
      expect(FsLoc.name('/path/to/src/')).toBe('src')
      expect(FsLoc.name('/')).toBe('')
      expect(FsLoc.name('./relative/file.md')).toBe('file.md')
    })
  })
})
