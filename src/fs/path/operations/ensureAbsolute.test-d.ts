import { Assert } from '#assert'
import { Fs } from '#fs'
import { ensureAbsolute, ensureAbsoluteOn, ensureAbsoluteWith } from './ensureAbsolute.js'

const A = Assert.exact
const p = Fs.Path.fromLiteral

// Fixtures
const base = p('/home/')
const relDir = p('./src/')
const relFile = p('./file.ts')
const absDir = p('/usr/')
const absFile = p('/file.ts')

// ensureAbsolute - Relative → Absolute type mappings
A.ofAs<Fs.Path.AbsDir>().on(ensureAbsolute(relDir, base))
A.ofAs<Fs.Path.AbsFile>().on(ensureAbsolute(relFile, base))

// ensureAbsolute - Absolute types pass through unchanged
A.ofAs<Fs.Path.AbsDir>().on(ensureAbsolute(absDir, base))
A.ofAs<Fs.Path.AbsFile>().on(ensureAbsolute(absFile, base))

// ensureAbsoluteWith (curried with base first)
const withBase = ensureAbsoluteWith(base)
A.ofAs<Fs.Path.AbsDir>().on(withBase(relDir))
A.ofAs<Fs.Path.AbsFile>().on(withBase(relFile))
A.ofAs<Fs.Path.AbsDir>().on(withBase(absDir))
A.ofAs<Fs.Path.AbsFile>().on(withBase(absFile))

// ensureAbsoluteOn (curried with path first)
A.ofAs<Fs.Path.AbsDir>().on(ensureAbsoluteOn(relDir)(base))
A.ofAs<Fs.Path.AbsFile>().on(ensureAbsoluteOn(relFile)(base))
A.ofAs<Fs.Path.AbsDir>().on(ensureAbsoluteOn(absDir)(base))
A.ofAs<Fs.Path.AbsFile>().on(ensureAbsoluteOn(absFile)(base))
