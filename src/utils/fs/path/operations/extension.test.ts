import { Fs } from '#fs'
import { Test } from '#test'
import { describe, expect, it } from 'vitest'
import type { Path } from '../_.js'

const l = Fs.Path.fromString

// dprint-ignore
Test.describe('.extension - get extension of file or null for directories')
    .inputType<Path>()
    .outputType<string | null>()
    .cases(
      // Files with extensions
      [l('/home/file.txt'),                 '.txt'],
      [l('./docs/README.md'),               '.md'],
      [l('/archive.tar.gz'),                '.gz'],
      [l('./.config.json'),                 '.json'],
      [l('/test.d.ts'),                     '.ts'],
      [l('/script.js'),                     '.js'],
      [l('/component.tsx'),                 '.tsx'],
      [l('/query.graphql'),                 '.graphql'],

      // Files without extensions
      [l('/README'),                        null],
      [l('./.gitignore'),                   null],
      [l('/Makefile'),                      null],

      // Directories always return null
      [l('/home/user/'),                    null],
      [l('./src/'),                         null],
      [l('/project/src/components/'),       null],
      [l('./lib/utils/'),                   null],
      [l('/my.folder.v2/'),                 null],
      [Fs.Path.absDirRoot(),                null],
      [Fs.Path.relDirCurrent(),             null],
    )
    .test(({ input, output }) => {
      const result = Fs.Path.extension(input)
      expect(result).toBe(output)
    })

// dprint-ignore
Test.describe('.extension - string literal support')
    .inputType<string>()
    .outputType<string | null>()
    .cases(
      ['/home/file.txt',                '.txt'],
      ['/archive.tar.gz',               '.gz'],
      ['/README',                       null],
      ['/home/user/',                   null],
    )
    .test(({ input, output }) => {
      const result = Fs.Path.extension(input)
      expect(result).toBe(output)
    })
