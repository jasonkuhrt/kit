import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import '../$.test-matchers.js'
import { describe, expect, it } from 'vitest'

const l = FsLoc.fromString

describe('up', () => {
  // dprint-ignore
  Test.Table.suite<
    FsLoc.FsLoc,
    string
  >('move up one level', [
    { n: 'abs file up one level',                        i: l('/home/user/file.txt'),      o: '/home/file.txt' },
    { n: 'abs dir up one level',                         i: l('/home/user/'),               o: '/home/' },
    { n: 'rel file up one level',                        i: l('src/index.ts'),             o: './index.ts' },
    { n: 'rel dir up one level',                         i: l('src/components/'),           o: './src/' },
    { n: 'root stays at root',                           i: FsLoc.Constants.absDirRoot,         o: '/' },
    { n: 'file in root stays in root',                   i: l('/file.txt'),                o: '/file.txt' },
  ], ({ i, o }) => {
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
