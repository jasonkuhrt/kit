import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import '../$.test-matchers.js'
import { describe, expect, it } from 'vitest'

const l = FsLoc.fromString

describe('isUnder', () => {
  // dprint-ignore
  Test.Table.suite<
    { child: FsLoc.FsLoc; parent: FsLoc.Groups.Dir.Dir },
    boolean
  >('check if path is under another', [
    // Absolute paths
    { n: 'abs file under abs dir',                      i: { child: l('/home/user/file.txt'), parent: l('/home/') },                         o: true },
    { n: 'abs dir under abs dir',                       i: { child: l('/home/user/src/'), parent: l('/home/') },                             o: true },
    { n: 'abs file not under abs dir',                  i: { child: l('/var/file.txt'), parent: l('/home/') },                               o: false },
    { n: 'abs file under immediate parent',             i: { child: l('/home/file.txt'), parent: l('/home/') },                              o: true },
    { n: 'abs file under root',                         i: { child: l('/file.txt'), parent: FsLoc.Constants.absDirRoot },                    o: true },

    // Relative paths
    { n: 'rel file under rel dir',                      i: { child: l('./src/index.ts'), parent: l('./src/') },                              o: true },
    { n: 'rel dir under rel dir',                       i: { child: l('./src/components/'), parent: l('./src/') },                           o: true },
    { n: 'rel file not under rel dir',                  i: { child: l('./test/file.ts'), parent: l('./src/') },                              o: false },

    // Edge cases
    { n: 'same location not under',                     i: { child: l('/home/'), parent: l('/home/') },                                      o: false },
    { n: 'parent deeper than child',                    i: { child: l('/home/'), parent: l('/home/user/') },                                 o: false },
  ], ({ i, o }) => {
    const result = FsLoc.isUnder(i.child, i.parent)
    expect(result).toBe(o)
  })

  describe('curried form', () => {
    it('isUnderOf creates a predicate', () => {
      const isInProject = FsLoc.isUnderOf(l('/project/'))
      expect(isInProject(l('/project/src/index.ts'))).toBe(true)
      expect(isInProject(l('/other/file.ts'))).toBe(false)
    })
  })

  describe('String literal support', () => {
    it('accepts string literals', () => {
      expect(FsLoc.isUnder('/home/user/src/index.ts', '/home/user/')).toBe(true)
      expect(FsLoc.isUnder('/other/path.ts', '/home/user/')).toBe(false)
      expect(FsLoc.isUnder('./src/index.ts', './src/')).toBe(true)
    })

    it('isUnderOf accepts string literals', () => {
      const isInProject = FsLoc.isUnderOf('/project/')
      expect(isInProject('/project/src/index.ts')).toBe(true)
      expect(isInProject('/other/file.ts')).toBe(false)
    })
  })
})
