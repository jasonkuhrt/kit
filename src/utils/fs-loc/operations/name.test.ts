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
      [l('/home/file.txt'),                 'file.txt'],
      [l('./docs/README.md'),               'README.md'],
      [l('/archive.tar.gz'),                'archive.tar.gz'],
      [l('./.config.json'),                 '.config.json'],

      // Directories
      [l('/home/user/'),                    'user'],
      [l('./src/'),                         'src'],
      [l('/project/src/components/'),       'components'],
      [l('./lib/utils/'),                   'utils'],

      // Edge cases
      [FsLoc.Constants.absDirRoot,         ''],
      [l('/file.txt'),                      'file.txt'],
      [l('/home/'),                         'home'],
      [FsLoc.Constants.relDirCurrent,      ''],
      [l('/my.folder.v2/'),                 'my.folder.v2'],
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
