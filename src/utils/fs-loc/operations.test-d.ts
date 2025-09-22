import { expectTypeOf } from 'vitest'
import * as FsLoc from './$$.js'
import { ensureOptionalAbsoluteWithCwd } from './operations.js'

// Test that undefined returns AbsDir
{
  const result = ensureOptionalAbsoluteWithCwd(undefined)
  expectTypeOf(result).toEqualTypeOf<FsLoc.AbsDir.AbsDir>()
}

// Test that AbsFile stays AbsFile
{
  const absFile = FsLoc.AbsFile.decodeSync('/path/to/file.txt')
  const result = ensureOptionalAbsoluteWithCwd(absFile)
  expectTypeOf(result).toEqualTypeOf<FsLoc.AbsFile.AbsFile>()
}

// Test that AbsDir stays AbsDir
{
  const absDir = FsLoc.AbsDir.decodeSync('/path/to/dir/')
  const result = ensureOptionalAbsoluteWithCwd(absDir)
  expectTypeOf(result).toEqualTypeOf<FsLoc.AbsDir.AbsDir>()
}

// Test that RelFile becomes AbsFile
{
  const relFile = FsLoc.RelFile.decodeSync('./file.txt')
  const result = ensureOptionalAbsoluteWithCwd(relFile)
  expectTypeOf(result).toEqualTypeOf<FsLoc.AbsFile.AbsFile>()
}

// Test that RelDir becomes AbsDir
{
  const relDir = FsLoc.RelDir.decodeSync('./dir/')
  const result = ensureOptionalAbsoluteWithCwd(relDir)
  expectTypeOf(result).toEqualTypeOf<FsLoc.AbsDir.AbsDir>()
}

// Test with union type
{
  const loc = Math.random() > 0.5 ? FsLoc.RelFile.decodeSync('./file.txt') : undefined
  const result = ensureOptionalAbsoluteWithCwd(loc)
  expectTypeOf(result).toEqualTypeOf<FsLoc.AbsFile.AbsFile | FsLoc.AbsDir.AbsDir>()
}
