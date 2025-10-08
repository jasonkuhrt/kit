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
      [l('/home/user/file.txt'),      '/home/file.txt'],
      [l('/home/user/'),               '/home/'],
      [l('src/index.ts'),             './index.ts'],
      [l('src/components/'),           './src/'],
      [FsLoc.Constants.absDirRoot,         '/'],
      [l('/file.txt'),                '/file.txt'],
    )
    .test(({ input, output }) => {
      const result = FsLoc.up(input)
      expect(result).toEncodeTo(output)
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
