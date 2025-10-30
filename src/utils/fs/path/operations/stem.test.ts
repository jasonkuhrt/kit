import { Fs } from '#fs'
import { Test } from '#test'
import { expect } from 'vitest'
import type { Path } from '../$.js'

const l = Fs.Path.fromString

// dprint-ignore
Test.describe('.stem - get stem (name without extension) of file or directory')
    .inputType<Path>()
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
      [Fs.Path.absDirRoot(),                ''],
      [l('/file.txt'),                      'file'],
      [l('/home/'),                         'home'],
      [Fs.Path.relDirCurrent(),             ''],
    )
    .test(({ input, output }) => {
      const result = Fs.Path.stem(input)
      expect(result).toBe(output)
    })

// dprint-ignore
Test.describe('.stem - string literal support')
    .inputType<string>()
    .outputType<string>()
    .cases(
      ['/home/file.txt',                'file'],
      ['/archive.tar.gz',               'archive.tar'],
      ['/home/user/',                   'user'],
      ['/',                             ''],
    )
    .test(({ input, output }) => {
      const result = Fs.Path.stem(input)
      expect(result).toBe(output)
    })
