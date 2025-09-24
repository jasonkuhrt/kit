import { FsLoc } from '#fs-loc'
import { Schema as S } from 'effect'
import { describe, expectTypeOf, it } from 'vitest'

// Local helper functions for decoding
const decodeAbsFile = S.decodeSync(FsLoc.AbsFile.String)
const decodeRelFile = S.decodeSync(FsLoc.RelFile.String)
const decodeAbsDir = S.decodeSync(FsLoc.AbsDir.String)
const decodeRelDir = S.decodeSync(FsLoc.RelDir.String)

describe('ensureOptionalAbsoluteWithCwd', () => {
  describe('type inference', () => {
    it('undefined returns AbsDir', () => {
      const result = FsLoc.ensureOptionalAbsoluteWithCwd(undefined)
      expectTypeOf(result).toEqualTypeOf<FsLoc.AbsDir>()
    })

    it('AbsFile stays AbsFile', () => {
      const absFile = decodeAbsFile('/path/to/file.txt')
      const result = FsLoc.ensureOptionalAbsoluteWithCwd(absFile)
      expectTypeOf(result).toEqualTypeOf<FsLoc.AbsFile>()
    })

    it('AbsDir stays AbsDir', () => {
      const absDir = decodeAbsDir('/path/to/dir/')
      const result = FsLoc.ensureOptionalAbsoluteWithCwd(absDir)
      expectTypeOf(result).toEqualTypeOf<FsLoc.AbsDir>()
    })

    it('RelFile becomes AbsFile', () => {
      const relFile = decodeRelFile('./file.txt')
      const result = FsLoc.ensureOptionalAbsoluteWithCwd(relFile)
      expectTypeOf(result).toEqualTypeOf<FsLoc.AbsFile>()
    })

    it('RelDir becomes AbsDir', () => {
      const relDir = decodeRelDir('./dir/')
      const result = FsLoc.ensureOptionalAbsoluteWithCwd(relDir)
      expectTypeOf(result).toEqualTypeOf<FsLoc.AbsDir>()
    })

    it('union type with undefined', () => {
      const loc = Math.random() > 0.5 ? decodeRelFile('./file.txt') : undefined
      const result = FsLoc.ensureOptionalAbsoluteWithCwd(loc)
      expectTypeOf(result).toEqualTypeOf<FsLoc.AbsFile | FsLoc.AbsDir>()
    })
  })
})
