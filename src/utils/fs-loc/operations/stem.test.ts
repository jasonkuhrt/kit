import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import '../$.test-matchers.js'
import { describe, expect, it } from 'vitest'

const l = FsLoc.fromString

// dprint-ignore
Test.describe('.stem - get stem (name without extension) of file or directory')
    .inputType<FsLoc.FsLoc>()
    .outputType<string>()
    .cases(
      // Files with extensions
      ['abs file with extension',                      [l('/home/file.txt')],                 'file'],
      ['rel file with extension',                      [l('./docs/README.md')],               'README'],
      ['file with multiple dots',                      [l('/archive.tar.gz')],                'archive.tar'],
      ['hidden file with extension',                   [l('./.config.json')],                 '.config'],
      ['file with complex extension',                  [l('/test.d.ts')],                     'test.d'],

      // Files without extensions
      ['file without extension',                       [l('/README')],                        'README'],
      ['hidden file without extension',                [l('./.gitignore')],                   '.gitignore'],

      // Directories (same as name)
      ['abs directory',                                [l('/home/user/')],                    'user'],
      ['rel directory',                                [l('./src/')],                         'src'],
      ['nested abs directory',                         [l('/project/src/components/')],       'components'],
      ['nested rel directory',                         [l('./lib/utils/')],                   'utils'],
      ['directory with dots in name',                  [l('/my.folder.v2/')],                 'my.folder.v2'],

      // Edge cases
      ['root directory returns empty',                 [FsLoc.Constants.absDirRoot],         ''],
      ['file in root',                                 [l('/file.txt')],                      'file'],
      ['single segment abs dir',                       [l('/home/')],                         'home'],
      ['empty rel dir returns empty',                  [FsLoc.Constants.relDirCurrent],      ''],
    )
    .test(({ input, output }) => {
      const result = FsLoc.stem(input)
      expect(result).toBe(output)
    })

describe('String literal support', () => {
  it('accepts string literals', () => {
    expect(FsLoc.stem('/path/to/file.txt')).toBe('file')
    expect(FsLoc.stem('/path/to/archive.tar.gz')).toBe('archive.tar')
    expect(FsLoc.stem('/path/to/src/')).toBe('src')
    expect(FsLoc.stem('/')).toBe('')
    expect(FsLoc.stem('./relative/file.md')).toBe('file')
    expect(FsLoc.stem('./README')).toBe('README')
  })
})
