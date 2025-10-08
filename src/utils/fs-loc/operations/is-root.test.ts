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
      ['root is root',                                 [FsLoc.Constants.absDirRoot],        true],
      ['abs dir not root',                             [l('/home/')],                        false],
      // Files with no path segments also return true for isRoot currently
      ['abs file in root',                             [l('/file.txt')],                      true],
      ['rel dir not root',                             [l('src/')],                          false],
      // Files with no path segments also return true for isRoot currently
      ['rel file in current dir',                      [l('file.txt')],                      true],
      // Empty relative dir also has empty segments
      ['empty rel dir',                                [FsLoc.Constants.relDirCurrent],      true],
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
