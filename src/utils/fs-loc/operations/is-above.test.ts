import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import '../$.test-matchers.js'
import { describe, expect, it } from 'vitest'

const l = FsLoc.fromString

describe('isAbove', () => {
  // dprint-ignore
  Test.Table.suite<
    { parent: FsLoc.Groups.Dir.Dir; child: FsLoc.FsLoc },
    boolean
  >('check if path is above another', [
    // Absolute paths
    { n: 'abs dir above abs file',                      i: { parent: l('/home/'), child: l('/home/user/file.txt') },                         o: true },
    { n: 'abs dir above abs dir',                       i: { parent: l('/home/'), child: l('/home/user/src/') },                             o: true },
    { n: 'abs dir not above abs file',                  i: { parent: l('/home/'), child: l('/var/file.txt') },                               o: false },
    { n: 'immediate parent above file',                 i: { parent: l('/home/'), child: l('/home/file.txt') },                              o: true },
    { n: 'root above file',                             i: { parent: FsLoc.Constants.absDirRoot, child: l('/file.txt') },                    o: true },

    // Relative paths
    { n: 'rel dir above rel file',                      i: { parent: l('./src/'), child: l('./src/index.ts') },                              o: true },
    { n: 'rel dir above rel dir',                       i: { parent: l('./src/'), child: l('./src/components/') },                           o: true },
    { n: 'rel dir not above rel file',                  i: { parent: l('./src/'), child: l('./test/file.ts') },                              o: false },

    // Edge cases
    { n: 'same location not above',                     i: { parent: l('/home/'), child: l('/home/') },                                      o: false },
    { n: 'child deeper than parent',                    i: { parent: l('/home/user/'), child: l('/home/') },                                 o: false },
  ], ({ i, o }) => {
    const result = FsLoc.isAbove(i.parent, i.child)
    expect(result).toBe(o)
  })

  describe('curried form', () => {
    it('isAboveOf creates a predicate', () => {
      const hasAsParent = FsLoc.isAboveOf(l('/home/user/src/index.ts'))
      expect(hasAsParent(l('/home/user/'))).toBe(true)
      expect(hasAsParent(l('/other/'))).toBe(false)
    })
  })

  describe('String literal support', () => {
    it('accepts string literals', () => {
      expect(FsLoc.isAbove('/home/', '/home/user/file.txt')).toBe(true)
      expect(FsLoc.isAbove('/other/', '/home/user/file.txt')).toBe(false)
    })

    it('isAboveOf accepts string literals', () => {
      const hasAsParent = FsLoc.isAboveOf('/home/user/src/index.ts')
      expect(hasAsParent('/home/user/')).toBe(true)
      expect(hasAsParent('/other/')).toBe(false)
    })
  })
})
