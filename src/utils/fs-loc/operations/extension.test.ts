import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import '../$.test-matchers.js'
import { describe, expect, it } from 'vitest'

const l = FsLoc.fromString

// dprint-ignore
Test.describe('.extension - get extension of file or null for directories')
    .inputType<FsLoc.FsLoc>()
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
      [FsLoc.Constants.absDirRoot,         null],
      [FsLoc.Constants.relDirCurrent,      null],
    )
    .test(({ input, output }) => {
      const result = FsLoc.extension(input)
      expect(result).toBe(output)
    })

describe('String literal support', () => {
  it('accepts string literals', () => {
    expect(FsLoc.extension('/path/to/file.txt')).toBe('.txt')
    expect(FsLoc.extension('/path/to/archive.tar.gz')).toBe('.gz')
    expect(FsLoc.extension('/path/to/src/')).toBe(null)
    expect(FsLoc.extension('/')).toBe(null)
    expect(FsLoc.extension('./relative/file.md')).toBe('.md')
    expect(FsLoc.extension('./README')).toBe(null)
  })
})
