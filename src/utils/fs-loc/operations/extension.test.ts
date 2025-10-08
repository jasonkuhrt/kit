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
      ['abs file with extension',                      [l('/home/file.txt')],                 '.txt'],
      ['rel file with extension',                      [l('./docs/README.md')],               '.md'],
      ['file with multiple dots',                      [l('/archive.tar.gz')],                '.gz'],
      ['hidden file with extension',                   [l('./.config.json')],                 '.json'],
      ['file with complex extension',                  [l('/test.d.ts')],                     '.ts'],
      ['javascript file',                              [l('/script.js')],                     '.js'],
      ['typescript file',                              [l('/component.tsx')],                 '.tsx'],
      ['graphql file',                                 [l('/query.graphql')],                 '.graphql'],

      // Files without extensions
      ['file without extension',                       [l('/README')],                        null],
      ['hidden file without extension',                [l('./.gitignore')],                   null],
      ['file in root without extension',               [l('/Makefile')],                      null],

      // Directories always return null
      ['abs directory',                                [l('/home/user/')],                    null],
      ['rel directory',                                [l('./src/')],                         null],
      ['nested abs directory',                         [l('/project/src/components/')],       null],
      ['nested rel directory',                         [l('./lib/utils/')],                   null],
      ['directory with dots in name',                  [l('/my.folder.v2/')],                 null],
      ['root directory',                               [FsLoc.Constants.absDirRoot],         null],
      ['current directory',                            [FsLoc.Constants.relDirCurrent],      null],
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
