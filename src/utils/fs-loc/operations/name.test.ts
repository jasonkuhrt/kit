import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import '../$.test-matchers.js'
import { describe, expect, it } from 'vitest'

const l = FsLoc.fromString

// dprint-ignore
Test.describe('.name - get name of file or directory')
    .inputType<FsLoc.FsLoc>()
    .outputType<string>()
    .cases(
      // Files with extensions
      ['abs file with extension',                      [l('/home/file.txt')],                 'file.txt'],
      ['rel file with extension',                      [l('./docs/README.md')],               'README.md'],
      ['file with multiple dots',                      [l('/archive.tar.gz')],                'archive.tar.gz'],
      ['hidden file with extension',                   [l('./.config.json')],                 '.config.json'],

      // Directories
      ['abs directory',                                [l('/home/user/')],                    'user'],
      ['rel directory',                                [l('./src/')],                         'src'],
      ['nested abs directory',                         [l('/project/src/components/')],       'components'],
      ['nested rel directory',                         [l('./lib/utils/')],                   'utils'],

      // Edge cases
      ['root directory returns empty',                 [FsLoc.Constants.absDirRoot],         ''],
      ['file in root',                                 [l('/file.txt')],                      'file.txt'],
      ['single segment abs dir',                       [l('/home/')],                         'home'],
      ['empty rel dir returns empty',                  [FsLoc.Constants.relDirCurrent],      ''],
      ['directory with dots in name',                  [l('/my.folder.v2/')],                 'my.folder.v2'],
    )
    .test(({ input, output }) => {
      const result = FsLoc.name(input)
      expect(result).toBe(output)
    })

describe('String literal support', () => {
  it('accepts string literals', () => {
    expect(FsLoc.name('/path/to/file.txt')).toBe('file.txt')
    expect(FsLoc.name('/path/to/src/')).toBe('src')
    expect(FsLoc.name('/')).toBe('')
    expect(FsLoc.name('./relative/file.md')).toBe('file.md')
  })
})
