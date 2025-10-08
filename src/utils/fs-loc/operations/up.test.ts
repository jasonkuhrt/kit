import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import '../$.test-matchers.js'
import { describe, expect, it } from 'vitest'

const l = FsLoc.fromString

describe('up', () => {
  // dprint-ignore
  Test.describe('move up one level')
    .inputType<FsLoc.FsLoc>()
    .outputType<string>()
    .cases(
      ['abs file up one level',                        [l('/home/user/file.txt')],      '/home/file.txt'],
      ['abs dir up one level',                         [l('/home/user/')],               '/home/'],
      ['rel file up one level',                        [l('src/index.ts')],             './index.ts'],
      ['rel dir up one level',                         [l('src/components/')],           './src/'],
      ['root stays at root',                           [FsLoc.Constants.absDirRoot],         '/'],
      ['file in root stays in root',                   [l('/file.txt')],                '/file.txt'],
    )
    .test(( i, o ) => {
      const result = FsLoc.up(i)
      expect(result).toEncodeTo(o)
    })

  describe('String literal support', () => {
    it('accepts string literals', () => {
      const up1 = FsLoc.up('/path/to/file.txt')
      expect(up1).toEncodeTo('/path/file.txt')

      const up2 = FsLoc.up('/path/to/dir/')
      expect(up2).toEncodeTo('/path/to/')
    })
  })
})
