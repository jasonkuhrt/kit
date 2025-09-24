import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import '../$.test-matchers.js'
import { describe, expect, it } from 'vitest'

const l = FsLoc.fromString

describe('isRoot', () => {
  // dprint-ignore
  Test.Table.suite<
    FsLoc.FsLoc,
    boolean
  >('check if location is root', [
    { n: 'root is root',                                 i: FsLoc.Constants.absDirRoot,        o: true },
    { n: 'abs dir not root',                             i: l('/home/'),                        o: false },
    // Files with no path segments also return true for isRoot currently
    { n: 'abs file in root',                             i: l('/file.txt'),                      o: true },
    { n: 'rel dir not root',                             i: l('src/'),                          o: false },
    // Files with no path segments also return true for isRoot currently
    { n: 'rel file in current dir',                      i: l('file.txt'),                      o: true },
    // Empty relative dir also has empty segments
    { n: 'empty rel dir',                                i: FsLoc.Constants.relDirCurrent,      o: true },
  ], ({ i, o }) => {
    if (o) {
      expect(i).toBeRoot()
    } else {
      expect(i).not.toBeRoot()
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
