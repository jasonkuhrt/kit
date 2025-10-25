import { Test } from '#test'
import { Ts } from '#ts'
import '../test/matchers/$.js'
import { Schema as S } from 'effect'
import { describe, expect, it } from 'vitest'
import { FsLoc } from './$.js'
import './$.test-matchers.js'

const A = Ts.Assert.exact.ofAs

const P = FsLoc.Path
const F = FsLoc.File
const l = FsLoc.fromString

// dprint-ignore
Test.describe('.decodeSync - AbsFile')
  .on(S.decodeSync(FsLoc.FsLoc))
  .cases(
    [['/file.txt']],
    [['/home/user/doc.pdf']],
    [['/a/b/c/d/e.js']],
    [['/archive.tar.gz']],
    [['/.config.json']],
    [['/my docs/file name.txt']],
  )

// dprint-ignore
Test.describe('.decodeSync - RelFile')
  .on(S.decodeSync(FsLoc.FsLoc))
  .cases(
    [['file.txt']],
    [['./file.txt']],
    [['../file.txt']],
    [['src/index.ts']],
    [['../../lib/util.js']],
    [['./src/components/App.tsx']],
  )

// dprint-ignore
Test.describe('.decodeSync - AbsDir')
  .on(S.decodeSync(FsLoc.FsLoc))
  .cases(
    [['/']],
    [['/home/']],
    [['/home']],
    [['/usr/local/bin/']],
    [['/a/b/c/d/e/']],
    [['/my documents/projects/']],
  )

// dprint-ignore
Test.describe('.decodeSync - RelDir')
  .on(S.decodeSync(FsLoc.FsLoc))
  .cases(
    [['./']],
    [['src/']],
    [['../']],
    [['src/components/']],
    [['../../lib/']],
    [['./src/']],
    [['../src/lib/utils/']],
    [['src']],
  )

const LocLoose = FsLoc.FsLocLoose.make
// dprint-ignore
Test.describe('.FsLocLoose.decodeSync')
  .inputType<string>()
  .outputType<FsLoc.FsLocLoose.FsLocLooseClass>()
  .cases(
    ['/home/file.txt',           LocLoose({ path: P.Abs.make({ segments: ['home'] }), file: F.make({ stem: 'file', extension: '.txt' }) })],
    ['/home/',                   LocLoose({ path: P.Abs.make({ segments: ['home'] }), file: null })],
    ['file.txt',                 LocLoose({ path: P.Rel.make({ segments: [] }), file: F.make({ stem: 'file', extension: '.txt' }) })],
    ['src/',                     LocLoose({ path: P.Rel.make({ segments: ['src'] }), file: null })],
    ['/',                        LocLoose({ path: P.Abs.make({ segments: [] }), file: null })],
    // Files without extensions are treated as directories - changed to .js extension
    ['/usr/local/bin/node.js',   LocLoose({ path: P.Abs.make({ segments: ['usr', 'local', 'bin'] }), file: F.make({ stem: 'node', extension: '.js' }) })],
  )
  .test(({ input, output }) => {
    const result = FsLoc.FsLocLoose.decodeSync(input)
    expect(result).toBeEquivalent(output, FsLoc.FsLocLoose.FsLocLooseClass)
  })

describe('.Constants', () => {
  describe('absDirRoot', () => {
    it('represents the root directory /', () => {
      expect(FsLoc.Constants.absDirRoot).toEqual(l('/'))
      expect(S.encodeSync(FsLoc.AbsDir.String as any)(FsLoc.Constants.absDirRoot)).toBe('/')
    })
  })

  describe('relDirCurrent', () => {
    it('represents the current directory .', () => {
      expect(FsLoc.Constants.relDirCurrent).toEqual(l('./'))
      expect(S.encodeSync(FsLoc.RelDir.String as any)(FsLoc.Constants.relDirCurrent)).toBe('./')
    })
  })

  describe('relDirParent', () => {
    it('represents the parent directory ..', () => {
      expect(FsLoc.Constants.relDirParent).toEqual(l('../'))
      expect(S.encodeSync(FsLoc.RelDir.String as any)(FsLoc.Constants.relDirParent)).toBe('./../')
    })
  })
})

describe('.fromString', () => {
  it('returns AbsFile for absolute file paths', () => {
    const result = FsLoc.fromString('/path/file.txt')
    expect(result._tag).toBe('LocAbsFile')
    A<FsLoc.AbsFile>().on(result)
  })

  it('returns RelFile for relative file paths', () => {
    const result = FsLoc.fromString('file.txt')
    expect(result._tag).toBe('LocRelFile')
    A<FsLoc.RelFile>().on(result)
  })

  it('returns AbsDir for absolute directory paths', () => {
    const result = FsLoc.fromString('/home/')
    expect(result._tag).toBe('LocAbsDir')
    A<FsLoc.AbsDir>().on(result)
  })

  it('returns RelDir for relative directory paths', () => {
    const result = FsLoc.fromString('./src/')
    expect(result._tag).toBe('LocRelDir')
    A<FsLoc.RelDir>().on(result)
  })

  it('type-errors when given non-literal string', () => {
    // @ts-expect-error: fromString requires a literal string
    FsLoc.fromString('/' as string)
  })
})

// dprint-ignore
Test.describe('Groups *.assert')
  .inputType<string>()
  .outputType<{ assert: Function; pass: boolean }>()
  .cases(
    ['file.txt',  { assert: FsLoc.Groups.Rel.assert,  pass: true }],
    ['/file.txt', { assert: FsLoc.Groups.Rel.assert,  pass: false }],

    ['/file.txt', { assert: FsLoc.Groups.Abs.assert,  pass: true }],
    ['file.txt',  { assert: FsLoc.Groups.Abs.assert,  pass: false }],

    ['file.txt',  { assert: FsLoc.Groups.File.assert, pass: true }],
    ['./src/',    { assert: FsLoc.Groups.File.assert, pass: false }],

    ['./src/',    { assert: FsLoc.Groups.Dir.assert,  pass: true }],
    ['file.txt',  { assert: FsLoc.Groups.Dir.assert,  pass: false }],

    ['/file.txt',  { assert: S.asserts(FsLoc.AbsFile),  pass: true }],
    ['file.txt',   { assert: S.asserts(FsLoc.AbsFile),  pass: false }],
    ['/dir/',      { assert: S.asserts(FsLoc.AbsFile),  pass: false }],

    ['file.txt',   { assert: S.asserts(FsLoc.RelFile),  pass: true }],
    ['/file.txt',  { assert: S.asserts(FsLoc.RelFile),  pass: false }],
    ['./dir/',     { assert: S.asserts(FsLoc.RelFile),  pass: false }],

    ['/dir/',      { assert: S.asserts(FsLoc.AbsDir),   pass: true }],
    ['./dir/',     { assert: S.asserts(FsLoc.AbsDir),   pass: false }],
    ['/file.txt',  { assert: S.asserts(FsLoc.AbsDir),   pass: false }],

    ['./dir/',     { assert: S.asserts(FsLoc.RelDir),   pass: true }],
    ['/dir/',      { assert: S.asserts(FsLoc.RelDir),   pass: false }],
    ['file.txt',   { assert: S.asserts(FsLoc.RelDir),   pass: false }],
  )
  .test(({ input, output }) => {
    const loc = FsLoc.decodeSync(input)
    if (output.pass) {
      expect(() => output.assert(loc)).not.toThrow()
    } else {
      expect(() => output.assert(loc)).toThrow()
    }
  })
