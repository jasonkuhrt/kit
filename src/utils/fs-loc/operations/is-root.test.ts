import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import '../$.test-matchers.js'
import { describe, expect, it } from 'vitest'

const l = FsLoc.fromString

describe('isRoot', () => {
  // dprint-ignore
  Test.describe('check if location is root')
    .inputType<FsLoc.FsLoc>()
    .outputType<boolean>()
    .cases(
      [FsLoc.Constants.absDirRoot,        true],
      [l('/home/'),                        false],
      // Files with no path segments also return true for isRoot currently
      [l('/file.txt'),                      true],
      [l('src/'),                          false],
      // Files with no path segments also return true for isRoot currently
      [l('file.txt'),                      true],
      // Empty relative dir also has empty segments
      [FsLoc.Constants.relDirCurrent,      true],
    )
    .test(({ input, output }) => {
      if (output) {
        expect(input).toBeRoot()
      } else {
        expect(input).not.toBeRoot()
      }
    })

  describe('String literal support', () => {
    it('accepts string literals', () => {
      expect(FsLoc.isRoot('/')).toBe(true)
      expect(FsLoc.isRoot('/path/')).toBe(false)
      expect(FsLoc.isRoot('./')).toBe(true) // Relative current directory has 0 segments
    })
  })
})
