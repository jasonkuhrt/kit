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
      [l('/home/file.txt'),                 'file'],
      [l('./docs/README.md'),               'README'],
      [l('/archive.tar.gz'),                'archive.tar'],
      [l('./.config.json'),                 '.config'],
      [l('/test.d.ts'),                     'test.d'],

      // Files without extensions
      [l('/README'),                        'README'],
      [l('./.gitignore'),                   '.gitignore'],

      // Directories (same as name)
      [l('/home/user/'),                    'user'],
      [l('./src/'),                         'src'],
      [l('/project/src/components/'),       'components'],
      [l('./lib/utils/'),                   'utils'],
      [l('/my.folder.v2/'),                 'my.folder.v2'],

      // Edge cases
      [FsLoc.Constants.absDirRoot,         ''],
      [l('/file.txt'),                      'file'],
      [l('/home/'),                         'home'],
      [FsLoc.Constants.relDirCurrent,      ''],
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
