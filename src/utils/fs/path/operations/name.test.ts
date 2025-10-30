import { Fs } from '#fs'
import { Test } from '#test'
import { expect } from 'vitest'
import type { Path } from '../$.js'

const l = Fs.Path.fromString

// dprint-ignore
Test.describe('.name - get name of file or directory')
    .inputType<Path>()
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
      [Fs.Path.absDirRoot(),                ''],
      [l('/file.txt'),                      'file.txt'],
      [l('/home/'),                         'home'],
      [Fs.Path.relDirCurrent(),             ''],
      [l('/my.folder.v2/'),                 'my.folder.v2'],
    )
    .test(({ input, output }) => {
      const result = Fs.Path.name(input)
      expect(result).toBe(output)
    })

// dprint-ignore
Test.describe('.name - string literal support')
    .inputType<string>()
    .outputType<string>()
    .cases(
      ['/home/file.txt',                'file.txt'],
      ['./docs/README.md',              'README.md'],
      ['/home/user/',                   'user'],
      ['/',                             ''],
    )
    .test(({ input, output }) => {
      const result = Fs.Path.name(input)
      expect(result).toBe(output)
    })
