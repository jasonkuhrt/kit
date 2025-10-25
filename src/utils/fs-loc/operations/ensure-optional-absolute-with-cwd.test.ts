import { FsLoc } from '#fs-loc'
import { Ts } from '#ts'
import { Schema as S } from 'effect'
import { describe, it } from 'vitest'

const A = Ts.Assert.exact.ofAs

// Local helper functions for decoding
const decodeAbsFile = S.decodeSync(FsLoc.AbsFile.String)
const decodeRelFile = S.decodeSync(FsLoc.RelFile.String)
const decodeAbsDir = S.decodeSync(FsLoc.AbsDir.String)
const decodeRelDir = S.decodeSync(FsLoc.RelDir.String)

describe('ensureOptionalAbsoluteWithCwd', () => {
  describe('type inference', () => {
    it('undefined returns AbsDir', () => {
      const result = FsLoc.ensureOptionalAbsoluteWithCwd(undefined)
      A<FsLoc.AbsDir>().on(result)
    })

    it('AbsFile stays AbsFile', () => {
      const absFile = decodeAbsFile('/path/to/file.txt')
      const result = FsLoc.ensureOptionalAbsoluteWithCwd(absFile)
      A<FsLoc.AbsFile>().on(result)
    })

    it('AbsDir stays AbsDir', () => {
      const absDir = decodeAbsDir('/path/to/dir/')
      const result = FsLoc.ensureOptionalAbsoluteWithCwd(absDir)
      A<FsLoc.AbsDir>().on(result)
    })

    it('RelFile becomes AbsFile', () => {
      const relFile = decodeRelFile('./file.txt')
      const result = FsLoc.ensureOptionalAbsoluteWithCwd(relFile)
      A<FsLoc.AbsFile>().on(result)
    })

    it('RelDir becomes AbsDir', () => {
      const relDir = decodeRelDir('./dir/')
      const result = FsLoc.ensureOptionalAbsoluteWithCwd(relDir)
      A<FsLoc.AbsDir>().on(result)
    })

    it('union type with undefined', () => {
      const loc = Math.random() > 0.5 ? decodeRelFile('./file.txt') : undefined
      const result = FsLoc.ensureOptionalAbsoluteWithCwd(loc)
      A<FsLoc.AbsFile | FsLoc.AbsDir>().on(result)
    })
  })
})
